package unipegaso.slotguard.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.configuration.SlotProperties;
import unipegaso.slotguard.model.*;
import unipegaso.slotguard.model.dto.PrenotazioneDTOReq;
import unipegaso.slotguard.model.dto.PrenotazioneDTORes;
import unipegaso.slotguard.model.dto.RicercaPrenotazioneDTO;
import unipegaso.slotguard.model.dto.UpdatePrenotazioneDTOReq;
import unipegaso.slotguard.model.enums.StatoPrenotazione;
import unipegaso.slotguard.repository.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

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

    @Autowired
    private SlotProperties slotProperties;

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

        // Risolve lo slot corretto: cerca prima slot storici nel DB (config diversa),
        // poi valida sulla config attuale. Lock pessimistico incluso.
        SlotAppuntamento slot = resolveAndLockSlot(req.getDataAppuntamento());
        LocalDateTime inizio = slot.getInizio();

        // Blocca prenotazioni nel weekend (già gestito in resolveAndLockSlot per nuovi slot,
        // ma uno slot storico potrebbe essere caduto in un giorno festivo per errore)
        DayOfWeek dow = inizio.toLocalDate().getDayOfWeek();
        if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Il centro è chiuso nel weekend");
        }

        // Verifica capienza massima (configurata sullo slot)
        if (slot.getPrenotati() >= slot.getCapacita()) {
            throw new IllegalStateException("Slot pieno: capacità massima di " + slot.getCapacita() + " appuntamenti raggiunta");
        }

        // Un servizio non può comparire due volte nello stesso slot
        List<StatoPrenotazione> statiAttivi = List.of(StatoPrenotazione.BOOKED, StatoPrenotazione.CONFIRMED);
        boolean servizioGiaPresente = prenotazioneRepository
                .existsBySlotIdAndServizioIdAndStatoPrenotazioneIn(slot.getId(), servizio.getId(), statiAttivi);
        if (servizioGiaPresente) {
            throw new IllegalStateException(
                    "Il servizio '" + servizio.getDescrizione() + "' è già prenotato in questo slot");
        }

        slot.setPrenotati(slot.getPrenotati() + 1);
        slotRepository.save(slot);

        Prenotazione prenotazione = new Prenotazione(inizio, null,
                req.getSemaforoUrgenza(), utente, operatore, servizio, operatore, slot);
        prenotazioneRepository.save(prenotazione);
        return PrenotazioneDTORes.toDTO(prenotazione);
    }

    @Transactional(readOnly = true)
    public PrenotazioneDTORes getPrenotazione(Long id) throws Exception {
        Prenotazione prenotazione =  prenotazioneRepository.findPrenotazioneById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Prenotazione non trovata"
                ));
        return PrenotazioneDTORes.toDTO(prenotazione);
    }

    @Transactional
    public PrenotazioneDTORes updatePrenotazione(UpdatePrenotazioneDTOReq req) throws Exception {

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

        boolean oldOccupato = StatoPrenotazione.isSlotOccupato(oldState);

        // 1) cambio data -> spostamento slot (solo se occupa)
        if (req.getDataAppuntamento() != null) {

                SlotAppuntamento newSlot = resolveAndLockSlot(req.getDataAppuntamento());
                LocalDateTime nuovaData = newSlot.getInizio();

                if (oldOccupato) {
                    if (newSlot.getPrenotati() >= newSlot.getCapacita()) {
                        throw new IllegalStateException("Slot nuovo pieno");
                    }

                    // libera vecchio slot
                    currentSlot.setPrenotati(currentSlot.getPrenotati() - 1);

                    // occupa nuovo slot
                    newSlot.setPrenotati(newSlot.getPrenotati() + 1);
                }

                prenotazione.setSlot(newSlot);
                prenotazione.setDataAppuntamento(nuovaData);
                slotRepository.save(currentSlot);
                currentSlot = newSlot; // aggiorna riferimento (serve per il punto 2)
        }

        // 2) cambio stato -> libera posto se passi da occupante a non-occupante (CANCELLATO/COMPLETATO/NO_SHOW)
        if (req.getStatoPrenotazione() != null && req.getStatoPrenotazione() != oldState) {
            applyCambioStato(prenotazione, req.getStatoPrenotazione(), currentSlot);
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

    @Transactional
    public PrenotazioneDTORes updateStatoPrenotazione(Long id, StatoPrenotazione stato) throws Exception {
        Prenotazione prenotazione =  prenotazioneRepository.findPrenotazioneById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Prenotazione non trovata"
                ));

        SlotAppuntamento slot = slotRepository.findByIdForUpdate(prenotazione.getSlot().getId())
                .orElseThrow(() -> new EntityNotFoundException("Slot attuale non trovato"));

        applyCambioStato(prenotazione, stato, slot);
        prenotazioneRepository.save(prenotazione);
        return PrenotazioneDTORes.toDTO(prenotazione);
    }

    private void applyCambioStato(Prenotazione prenotazione, StatoPrenotazione nuovoStato, SlotAppuntamento slotCorrente) {
        StatoPrenotazione statoCorrente = prenotazione.getStatoPrenotazione();

        if (!statoCorrente.canChangeTo(nuovoStato)) {
            throw new IllegalStateException("Transizione non consentita: " + statoCorrente + " -> " + nuovoStato);
        }

        boolean oldOccupato = StatoPrenotazione.isSlotOccupato(statoCorrente);
        boolean newOccupato = StatoPrenotazione.isSlotOccupato(nuovoStato);

        if (oldOccupato && !newOccupato) {
            int prenotati = slotCorrente.getPrenotati();
            slotCorrente.setPrenotati(Math.max(0, prenotati - 1));
        }

        prenotazione.setStatoPrenotazione(nuovoStato);
    }

    /**
     * Risolve e blocca lo slot corretto per una prenotazione.
     *
     * Strategia:
     * 1. Cerca nel DB lo slot esistente il cui inizio è <= del timestamp richiesto
     *    e verifica che il timestamp cada dentro la sua finestra (inizio + durata).
     *    Questo supporta slot storici creati con una configurazione diversa.
     * 2. Se non esiste uno slot storico valido, valida l'orario rispetto alla
     *    configurazione attuale, genera lo slot se mancante e lo blocca.
     */
    private SlotAppuntamento resolveAndLockSlot(LocalDateTime requested) {
        int duration = slotProperties.getDurationMinutes();

        // 1. Cerca slot storico nel DB che contenga il timestamp richiesto
        Optional<SlotAppuntamento> existing = slotRepository.findSlotContainingForUpdate(requested);
        if (existing.isPresent()) {
            SlotAppuntamento candidate = existing.get();
            LocalDateTime slotFine = candidate.getInizio().plusMinutes(duration);
            // Il timestamp deve cadere dentro la finestra dello slot
            if (!requested.isBefore(candidate.getInizio()) && requested.isBefore(slotFine)) {
                return candidate;
            }
        }

        // 2. Nessuno slot storico valido: valida su config attuale e genera
        LocalTime workStart = slotProperties.getWorkingHours().getStart();
        LocalTime workEnd   = slotProperties.getWorkingHours().getEnd();

        long minutesFromMidnight = ChronoUnit.MINUTES.between(LocalTime.MIDNIGHT, requested.toLocalTime());
        long slotMinutes = (minutesFromMidnight / duration) * duration;
        LocalTime candidateTime = LocalTime.MIDNIGHT.plusMinutes(slotMinutes);

        if (candidateTime.isBefore(workStart) || !candidateTime.isBefore(workEnd)) {
            throw new IllegalArgumentException(
                    "Orario non valido: gli slot sono disponibili dalle " + workStart +
                    " alle " + workEnd + " con durata di " + duration + " minuti");
        }

        DayOfWeek dow = requested.toLocalDate().getDayOfWeek();
        if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Il centro è chiuso nel weekend");
        }

        LocalDateTime slotInizio = requested.toLocalDate().atTime(candidateTime);
        slotService.ensureSlots(slotInizio.toLocalDate(), slotInizio.toLocalDate());

        return slotRepository.findByInizioForUpdate(slotInizio)
                .orElseThrow(() -> new EntityNotFoundException("Slot non trovato per: " + slotInizio));
    }
}

