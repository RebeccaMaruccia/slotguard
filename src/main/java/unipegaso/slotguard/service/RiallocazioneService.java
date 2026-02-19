package unipegaso.slotguard.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.model.Notifica;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.SlotAppuntamento;
import unipegaso.slotguard.model.TentativoRiallocazione;
import unipegaso.slotguard.model.enums.StatoNotifica;
import unipegaso.slotguard.model.enums.StatoPrenotazione;
import unipegaso.slotguard.model.enums.TipoNotifica;
import unipegaso.slotguard.repository.NotificaRepository;
import unipegaso.slotguard.repository.PrenotazioneRepository;
import unipegaso.slotguard.repository.RiallocazioneRepository;
import unipegaso.slotguard.repository.SlotRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RiallocazioneService {

    @Autowired
    private RiallocazioneRepository riallocazioneRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private PrenotazioneRepository prenotazioneRepository;

    @Autowired
    private NotificaRepository notificaRepository;

    @Transactional
    public void avviaTentativoRiallocazione(Prenotazione prenotazioneSorgente) {
        creaTentativoRiallocazione(prenotazioneSorgente);
    }

    public TentativoRiallocazione creaTentativoRiallocazione(Prenotazione prenotazioneCanc) {

        List<Prenotazione> pAnticipabili = prenotazioneRepository.findCandidatiRiallocazione(
                prenotazioneCanc.getServizio().getId(), LocalDate.now().plusDays(3).atTime(9,0));

        if (pAnticipabili == null && pAnticipabili.isEmpty()) {
            throw new IllegalStateException("Nessuna prenotazione risulta anticipabile");
        }

        Notifica nRiallocazione = creaNotificaRiallocazione(pAnticipabili.get(0));
        TentativoRiallocazione tentativo = new TentativoRiallocazione(nRiallocazione, prenotazioneCanc);

        riallocazioneRepository.save(tentativo);
        notificaRepository.save(nRiallocazione);
        return tentativo;
    }

    public TentativoRiallocazione updateTentativoRiallocazione(TentativoRiallocazione tentativo, boolean esito) {
        Prenotazione pCancellata = tentativo.getPrenotazione();
        if(esito){
            Prenotazione pAnticipata = tentativo.getNotifica().getPrenotazione();

            //libero lo slot della prenotazione che sto anticipando
            SlotAppuntamento slotLibero = slotRepository.findByIdForUpdate(pCancellata.getSlot().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Slot liberato non trovato"));

            slotLibero.setPrenotati(slotLibero.getPrenotati() + 1);

            SlotAppuntamento previousSlot = slotRepository.findByIdForUpdate(pAnticipata.getSlot().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Slot attuale non trovato"));

            previousSlot.setPrenotati(Math.max(0, previousSlot.getPrenotati() - 1));

            pAnticipata.setSlot(slotLibero);
            pAnticipata.setDataAppuntamento(slotLibero.getInizio());
            pAnticipata.setStatoPrenotazione(StatoPrenotazione.CONFIRMED);

            pAnticipata.setDataUpdate(LocalDateTime.now());
            prenotazioneRepository.save(pAnticipata);
            tentativo.setEsito(true);

        }else{
            tentativo.setEsito(false);
        }

        riallocazioneRepository.save(tentativo);
        return tentativo;
    }

    private Notifica creaNotificaRiallocazione(Prenotazione prenotazioneTarget) {
        LocalDateTime now = LocalDateTime.now();
        Notifica notifica = new Notifica(
                null,
                now.plusHours(12),
                now,
                UUID.randomUUID().toString(),
                StatoNotifica.SENT,
                TipoNotifica.PROPOSTA_RIALLOCAZIONE,
                prenotazioneTarget
        );
        return notificaRepository.save(notifica);
    }
}
