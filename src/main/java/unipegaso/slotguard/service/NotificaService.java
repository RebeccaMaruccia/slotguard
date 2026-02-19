package unipegaso.slotguard.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
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
@Slf4j
public class NotificaService {

    @Autowired
    private NotificaRepository notificaRepository;

    @Autowired
    private PrenotazioneRepository prenotazioneRepository;

    @Autowired
    private RiallocazioneService riallocazioneService;

    @Autowired
    private RiallocazioneRepository riallocazioneRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void pianificaRichiesteConferma() {
        LocalDate oggi = LocalDate.now();
        LocalDate target = oggi.plusDays(3);
        LocalDateTime start = target.atStartOfDay();
        LocalDateTime end = target.plusDays(1).atStartOfDay(); // esclusivo


        List<Prenotazione> prenotazioni = prenotazioneRepository.findByDataAppuntamentoRangeAndStati(start, end, StatoPrenotazione.BOOKED);

        for (Prenotazione prenotazione : prenotazioni) {
            if (!notificaRepository.existsByPrenotazioneIdAndTipoNotifica(prenotazione.getId(), TipoNotifica.RICHIESTA_CONFERMA)) {
                Notifica notifica = creaNotifica(prenotazione, TipoNotifica.RICHIESTA_CONFERMA, LocalDateTime.now().plusHours(24));
                notificaRepository.save(notifica);
                inviaEmail(prenotazione, "Richiesta conferma appuntamento", buildLink(notifica.getToken()));
            }
        }
    }

    @Scheduled(cron = "0 0 */12 * * *")
    @Transactional
    public void gestisciScadenzeNotifiche() {
        LocalDateTime now = LocalDateTime.now();
        List<Notifica> scadute = notificaRepository.findByStatoNotificaAndTsScadenzaBefore(StatoNotifica.SENT, now);

        for (Notifica notifica : scadute) {
            notifica.setStatoNotifica(StatoNotifica.EXPIRED);
            notifica.setTsRisposta(now);

            if (notifica.getTipoNotifica() == TipoNotifica.RICHIESTA_CONFERMA) {
                cancellaPrenotazioneELiberaSlot(notifica.getPrenotazione(), StatoPrenotazione.CANCELLED_AUTO);
                inviaEmail(notifica.getPrenotazione(), "Prenotazione cancellata da sistema", buildLink(notifica.getToken()));
            }

            if (notifica.getTipoNotifica() == TipoNotifica.PROPOSTA_RIALLOCAZIONE) {
                TentativoRiallocazione tentativo = riallocazioneRepository.findTentativoRiallocazioneByNotifica(notifica)
                        .orElseThrow(() -> new EntityNotFoundException("Riallocazione non presente"));
                provaInvioProssimoCandidato(tentativo.getPrenotazione());
            }
        }
    }


    @Transactional
    public void rispondiNotifica(String token, boolean accettata) {
        Notifica notifica = notificaRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Token notifica non valido"));

        if (notifica.getStatoNotifica() != StatoNotifica.SENT) {
            throw new IllegalStateException("Notifica già gestita");
        }

        if (notifica.getTsScadenza() != null && LocalDateTime.now().isAfter(notifica.getTsScadenza())) {
            notifica.setStatoNotifica(StatoNotifica.EXPIRED);
            notifica.setTsRisposta(LocalDateTime.now());
            throw new IllegalStateException("Token scaduto");
        }

        notifica.setStatoNotifica(accettata ? StatoNotifica.CONFIRMED : StatoNotifica.REJECTED);
        notifica.setTsRisposta(LocalDateTime.now());

        if (notifica.getTipoNotifica() == TipoNotifica.RICHIESTA_CONFERMA) {
            notifica.getPrenotazione().setStatoPrenotazione(accettata ? StatoPrenotazione.CONFIRMED : StatoPrenotazione.CANCELLED_USER);

            if (!accettata) {
                //libero lo slot della prenotazione cancellata dall'utente
                cancellaPrenotazioneELiberaSlot(notifica.getPrenotazione(), StatoPrenotazione.CANCELLED_USER);
                //cerco di anticipare la prenotazione di qualcuno
                trovaCandidatoPerAnticipo(notifica.getPrenotazione());
            }
        }

        if (notifica.getTipoNotifica() == TipoNotifica.PROPOSTA_RIALLOCAZIONE) {
            gestisciRispostaRiallocazione(notifica, accettata);
        }
    }

    private void gestisciRispostaRiallocazione(Notifica notifica, boolean accettata) {

        if (notifica.getPrenotazione() == null) {
            throw new IllegalStateException("Prenotazione non presente per riallocazione");
        }

        TentativoRiallocazione tentativo = riallocazioneRepository.findTentativoRiallocazioneByNotifica(notifica)
                .orElseThrow(() -> new EntityNotFoundException("Riallocazione non presente"));

        riallocazioneService.updateTentativoRiallocazione(tentativo, accettata);

        if (!accettata){
            provaInvioProssimoCandidato(tentativo.getPrenotazione());
        }
    }

    private void trovaCandidatoPerAnticipo(Prenotazione prenotazioneCancellata){
        provaInvioProssimoCandidato(prenotazioneCancellata);
    }

    private void provaInvioProssimoCandidato(Prenotazione prenotazioneCancellata) {

        TentativoRiallocazione tentativo = riallocazioneService.creaTentativoRiallocazione(prenotazioneCancellata);
        Notifica notificaTentativo = tentativo.getNotifica();
        inviaEmail(
                notificaTentativo.getPrenotazione(),
                "Proposta di anticipo appuntamento",
                buildLink(notificaTentativo.getToken())
        );
    }

    private void cancellaPrenotazioneELiberaSlot(Prenotazione prenotazione, StatoPrenotazione statoFinale) {
        SlotAppuntamento slot = slotRepository.findByIdForUpdate(prenotazione.getSlot().getId())
                .orElseThrow(() -> new EntityNotFoundException("Slot attuale non trovato"));
        slot.setPrenotati(Math.max(0, slot.getPrenotati() - 1));
        prenotazione.setStatoPrenotazione(statoFinale);
        prenotazione.setDataUpdate(LocalDateTime.now());
    }


    private void inviaEmail(Prenotazione prenotazione, String oggetto, String contenuto) {
        log.info("EMAIL to={} oggetto={} contenuto={}", prenotazione.getUtente().getEmail(), oggetto, contenuto);
    }

    private String buildLink(String token) {
        return "/public/notifiche/rispondi?token=" + token;
    }

    public static Notifica creaNotifica(Prenotazione prenotazione, TipoNotifica tipo, LocalDateTime scadenza) {
        return new Notifica(null, scadenza, LocalDateTime.now(), UUID.randomUUID().toString(),
                StatoNotifica.SENT, tipo, prenotazione);
    }
}
