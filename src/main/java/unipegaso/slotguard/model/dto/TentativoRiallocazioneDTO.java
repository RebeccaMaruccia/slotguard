package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.Notifica;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.Servizio;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TentativoRiallocazioneDTO {

    private Long id;
    private LocalDateTime slotLibero;
    private Servizio servizio;
    private Prenotazione prenotazione;
    private Notifica notifica;
    private LocalDateTime tsCreazione;

}
