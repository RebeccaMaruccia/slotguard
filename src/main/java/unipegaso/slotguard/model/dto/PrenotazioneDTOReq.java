package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.enums.SemaforoUrgenza;
import unipegaso.slotguard.model.enums.StatoPrenotazione;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class PrenotazioneDTOReq {

    private LocalDateTime dataAppuntamento;
    private StatoPrenotazione statoPrenotazione;
    private SemaforoUrgenza semaforoUrgenza;
    private String cfUtente;
    private String matricolaOperatore;
    private long idServizio;
}
