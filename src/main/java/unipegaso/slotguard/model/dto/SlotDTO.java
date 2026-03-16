package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.configuration.SlotProperties;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.SlotAppuntamento;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SlotDTO {

    private Long id;
    private LocalDateTime inizio;
    private LocalDateTime fine;
    private int capacita;
    private int prenotati;
    private List<PrenotazioneDTORes> appuntamenti = Collections.emptyList();

    public static SlotDTO toDTO(SlotAppuntamento slot, SlotProperties slotProperties) {
        SlotDTO dto = new SlotDTO();
        dto.setId(slot.getId());
        dto.setInizio(slot.getInizio());
        dto.setFine(slot.getInizio().plusMinutes(slotProperties.getDurationMinutes()));
        dto.setCapacita(slot.getCapacita());
        dto.setPrenotati(slot.getPrenotati());
        return dto;
    }

    public static SlotDTO toDTO(SlotAppuntamento slot, SlotProperties slotProperties,
                                List<Prenotazione> prenotazioni) {
        SlotDTO dto = toDTO(slot, slotProperties);
        dto.setAppuntamenti(
                prenotazioni.stream()
                        .map(PrenotazioneDTORes::toDTO)
                        .toList()
        );
        return dto;
    }

    /** Overload senza SlotProperties: fine non calcolata */
    public static SlotDTO toDTO(SlotAppuntamento slot) {
        SlotDTO dto = new SlotDTO();
        dto.setId(slot.getId());
        dto.setInizio(slot.getInizio());
        dto.setCapacita(slot.getCapacita());
        dto.setPrenotati(slot.getPrenotati());
        return dto;
    }
}
