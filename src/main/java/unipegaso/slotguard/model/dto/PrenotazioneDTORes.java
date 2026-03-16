package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.Operatore;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.Servizio;
import unipegaso.slotguard.model.Utente;
import unipegaso.slotguard.model.enums.SemaforoUrgenza;
import unipegaso.slotguard.model.enums.StatoPrenotazione;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class PrenotazioneDTORes {

    private LocalDateTime dataAppuntamento;
    private StatoPrenotazione statoPrenotazione;
    private SemaforoUrgenza semaforoUrgenza;
    private Utente utente;
    private Operatore operatore;
    private Servizio servizio;
    private long id;

    public static PrenotazioneDTORes toDTO(Prenotazione p) {
        PrenotazioneDTORes dto = new PrenotazioneDTORes();
        dto.setServizio(p.getServizio());
        dto.setOperatore(p.getOperatore());
        dto.setStatoPrenotazione(p.getStatoPrenotazione());
        dto.setDataAppuntamento(p.getDataAppuntamento());
        dto.setUtente(p.getUtente());
        dto.setSemaforoUrgenza(p.getSemaforoUrgenza());
        dto.setId(p.getId());
        return dto;
    }
}
