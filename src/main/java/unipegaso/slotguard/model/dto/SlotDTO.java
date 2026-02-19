package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.SlotAppuntamento;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class SlotDTO {

    private LocalDateTime inizio;
    private LocalDateTime fine;
    private int prenotati;

    public static SlotDTO toDTO(SlotAppuntamento slotAppuntamento) {
        SlotDTO slotDTO = new SlotDTO();
        slotDTO.setInizio(slotAppuntamento.getInizio());
        slotDTO.setPrenotati(slotAppuntamento.getPrenotati());
        return slotDTO;
    }
}
