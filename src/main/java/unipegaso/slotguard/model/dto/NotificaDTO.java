package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.enums.StatoNotifica;
import unipegaso.slotguard.model.enums.TipoNotifica;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class NotificaDTO {

    private Long id;
    private TipoNotifica tipoNotifica;
    private StatoNotifica statoNotifica;
    private String token;
    private LocalDateTime tsInvio;
    private LocalDateTime tsScadenza;
    private LocalDateTime tsRisposta;
    private Prenotazione prenotazione;
}
