package unipegaso.slotguard.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.model.Operatore;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.Utente;
import unipegaso.slotguard.model.dto.PrenotazioneDTOReq;
import unipegaso.slotguard.model.dto.PrenotazioneDTORes;
import unipegaso.slotguard.model.dto.RicercaPrenotazioneDTO;
import unipegaso.slotguard.model.dto.UpdatePrenotazioneDTOReq;
import unipegaso.slotguard.model.enums.StatoPrenotazione;
import unipegaso.slotguard.repository.OperatoreRepository;
import unipegaso.slotguard.repository.PrenotazioneRepository;
import unipegaso.slotguard.repository.UtenteRepository;

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

    @Transactional(readOnly = true)
    public List<PrenotazioneDTORes> ricercaPrenotazioni(RicercaPrenotazioneDTO req) throws Exception {
        return prenotazioneRepository.ricercaPrenotazioni(req)
                .stream()
                .map(PrenotazioneDTORes::toDTO)
                .toList();
    }

    @Transactional
    public PrenotazioneDTORes creaPrenotazione(PrenotazioneDTOReq req) throws Exception {
        Utente utente = utenteRepository
                .getUtenteByCodiceFiscale(req.getCfUtente())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Utente non trovato: " + req.getCfUtente()
                ));
        Operatore operatore = operatoreRepository
                .findByMatricola(req.getMatricolaOperatore())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Matricola operatore non trovata: " + req.getMatricolaOperatore()
                ));
        Prenotazione prenotazione = new Prenotazione(req.getDataAppuntamento(), null,
                req.getSemaforoUrgenza(), utente, operatore, req.getServizio(), null);
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
    public PrenotazioneDTORes updatePrenotazione(UpdatePrenotazioneDTOReq req) throws Exception {

        Prenotazione prenotazione =  prenotazioneRepository.findBy(req.getPrenotazioneId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Prenotazione non trovata"
                ));

        Operatore operatore = operatoreRepository
                .findByMatricola(req.getMatricolaOperatore())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Matricola operatore non trovata: " + req.getMatricolaOperatore()
                ));

        prenotazione.setOperatoreUpdate(operatore);

        if(req.getDataAppuntamento() != null) prenotazione.setDataAppuntamento(req.getDataAppuntamento());
        if(req.getStatoPrenotazione() != null) prenotazione.setStatoPrenotazione(req.getStatoPrenotazione());
        if(req.getServizio() != null) prenotazione.setServizio(req.getServizio());
        if(req.getSemaforoUrgenza() != null) prenotazione.setSemaforoUrgenza(req.getSemaforoUrgenza());

        prenotazione.setDataUpdate(LocalDateTime.now());

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

