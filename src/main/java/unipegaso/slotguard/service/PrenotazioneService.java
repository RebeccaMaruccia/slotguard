package unipegaso.slotguard.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.model.*;
import unipegaso.slotguard.model.dto.PrenotazioneDTOReq;
import unipegaso.slotguard.model.dto.PrenotazioneDTORes;
import unipegaso.slotguard.model.dto.RicercaPrenotazioneDTO;
import unipegaso.slotguard.model.dto.UpdatePrenotazioneDTOReq;
import unipegaso.slotguard.model.enums.StatoPrenotazione;
import unipegaso.slotguard.repository.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PrenotazioneService {

    @Autowired
    private PrenotazioneRepository prenotazioneRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private OperatoreRepository operatoreRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private ServizioRepository servizioRepository;

    @Autowired
    private SlotService slotService;

    @Transactional(readOnly = true)
    public List<PrenotazioneDTORes> ricercaPrenotazioni(RicercaPrenotazioneDTO req) throws Exception {
        return prenotazioneRepository.ricercaPrenotazioni(req)
                .stream()
                .map(PrenotazioneDTORes::toDTO)
                .toList();
    }

    @Transactional
    public PrenotazioneDTORes creaPrenotazione(PrenotazioneDTOReq req) throws Exception {
        Utente utente = utenteRepository.getUtenteByCodiceFiscale(req.getCfUtente())
                .orElseThrow(() -> new EntityNotFoundException("Utente non trovato: " + req.getCfUtente()));

        Operatore operatore = operatoreRepository.findByMatricola(req.getMatricolaOperatore())
                .orElseThrow(() -> new EntityNotFoundException("Matricola operatore non trovata: " + req.getMatricolaOperatore()));

        Servizio servizio = servizioRepository.findById(req.getIdServizio())
                .orElseThrow(() -> new EntityNotFoundException("Servizio non trovato: " + req.getIdServizio()));

        // Normalizza all'ora (coerente con slot da 1h)
        LocalDateTime inizio = req.getDataAppuntamento()
                .withMinute(0).withSecond(0).withNano(0);

        // Blocca prenotazioni nel weekend
        DayOfWeek dow = inizio.toLocalDate().getDayOfWeek();
        if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Il centro è chiuso nel weekend");
        }

        // Garantisce che lo slot esista (utile se il FE sta andando oltre il mese “precaricato”)
        slotService.ensureSlots(inizio.toLocalDate(), inizio.toLocalDate());

        // Prendi slot con lock: evita sforamenti oltre capienza
        SlotAppuntamento slot = slotRepository.findByInizioForUpdate(inizio)
                .orElseThrow(() -> new EntityNotFoundException("Slot inesistente per: " + inizio));

        if (slot.getPrenotati() >= slot.getCapacita()) {
            throw new IllegalStateException("Slot appuntamento pieno");
        }

        slot.setPrenotati(slot.getPrenotati() + 1);

        Prenotazione prenotazione = new Prenotazione(req.getDataAppuntamento(), null,
                req.getSemaforoUrgenza(), utente, operatore, servizio, null, slot);
        prenotazioneRepository.save(prenotazione);
        return PrenotazioneDTORes.toDTO(prenotazione);
    }

    @Transactional(readOnly = true)
    public PrenotazioneDTORes getPrenotazione(Long id) throws Exception {
        Prenotazione prenotazione =  prenotazioneRepository.findBy(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Prenotazione non trovata"
                ));
        return PrenotazioneDTORes.toDTO(prenotazione);
    }

    @Transactional
    public PrenotazioneDTORes updatePrenotazione(UpdatePrenotazioneDTOReq req) {

        Prenotazione prenotazione = prenotazioneRepository.findById(req.getPrenotazioneId())
                .orElseThrow(() -> new EntityNotFoundException("Prenotazione non trovata"));

        Operatore operatore = operatoreRepository.findByMatricola(req.getMatricolaOperatore())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Matricola operatore non trovata: " + req.getMatricolaOperatore()));

        // audit
        prenotazione.setOperatoreUpdate(operatore);
        prenotazione.setDataUpdate(LocalDateTime.now());

        // lock slot corrente (ci servirà sia per cambio data che per cambio stato)
        SlotAppuntamento currentSlot = slotRepository.findByIdForUpdate(prenotazione.getSlot().getId())
                .orElseThrow(() -> new EntityNotFoundException("Slot attuale non trovato"));

        StatoPrenotazione oldState = prenotazione.getStatoPrenotazione();
        StatoPrenotazione newState = (req.getStatoPrenotazione() != null)
                ? req.getStatoPrenotazione()
                : oldState;

        // controllo transizione (FSM)
        if (req.getStatoPrenotazione() != null && !oldState.canChangeTo(newState)) {
            throw new IllegalStateException("Transizione non consentita: " + oldState + " -> " + newState);
        }

        boolean oldOccupato = StatoPrenotazione.isSlotOccupato(oldState);
        boolean newOccupato = StatoPrenotazione.isSlotOccupato(newState);

        // 1) cambio data -> spostamento slot (solo se occupa)
        if (req.getDataAppuntamento() != null) {

            LocalDateTime nuovaData = req.getDataAppuntamento()
                    .withMinute(0).withSecond(0).withNano(0);

            if (!nuovaData.equals(prenotazione.getDataAppuntamento())) {

                slotService.ensureSlots(nuovaData.toLocalDate(), nuovaData.toLocalDate());

                SlotAppuntamento newSlot = slotRepository.findByInizioForUpdate(nuovaData)
                        .orElseThrow(() -> new EntityNotFoundException("Slot nuovo non trovato per: " + nuovaData));

                if (oldOccupato) {
                    if (newSlot.getPrenotati() >= newSlot.getCapacita()) {
                        throw new IllegalStateException("Slot nuovo pieno");
                    }

                    // libera vecchio slot
                    int oldPrenotati = currentSlot.getPrenotati();
                    currentSlot.setPrenotati(Math.max(0, oldPrenotati - 1));

                    // occupa nuovo slot
                    newSlot.setPrenotati(newSlot.getPrenotati() + 1);
                }

                prenotazione.setSlot(newSlot);
                prenotazione.setDataAppuntamento(nuovaData);
                currentSlot = newSlot; // aggiorna riferimento (serve per il punto 2)
            }
        }

        /* 2) cambio stato -> libera posto se passi da occupante a non-occupante (CANCELLATO/COMPLETATO/NO_SHOW) */
        if (req.getStatoPrenotazione() != null && newState != oldState) {

            if (oldOccupato && !newOccupato) {
                int prenotati = currentSlot.getPrenotati();
                currentSlot.setPrenotati(Math.max(0, prenotati - 1));
            }

            // non esiste transizione da non-occupato a occupato, quindi non serve fare ++ qui.

            prenotazione.setStatoPrenotazione(newState);
        }

        // 3) altri campi
        if (req.getIdServizio() != null) {
            Servizio servizio = servizioRepository.findById(req.getIdServizio())
                    .orElseThrow(() -> new EntityNotFoundException("Servizio non trovato: " + req.getIdServizio()));
            prenotazione.setServizio(servizio);
        }

        if (req.getSemaforoUrgenza() != null) {
            prenotazione.setSemaforoUrgenza(req.getSemaforoUrgenza());
        }

        prenotazioneRepository.save(prenotazione);
        return PrenotazioneDTORes.toDTO(prenotazione);
    }

    @Transactional(readOnly = true)
    public PrenotazioneDTORes updateStatoPrenotazione(Long id, StatoPrenotazione stato) throws Exception {
        Prenotazione prenotazione =  prenotazioneRepository.findBy(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Prenotazione non trovata"
                ));
        prenotazione.setStatoPrenotazione(stato);
        return PrenotazioneDTORes.toDTO(prenotazione);
    }
}

