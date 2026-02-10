package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class RicercaPrenotazioneDTO {

    private LocalDateTime dataInizio;
    private LocalDateTime dataFine;
    private String statoPrenotazione;
    private String semaforoUrgenza;
    private String cfUtente;
    private String matricolaOperatore;
    private Long idServizio;
}
