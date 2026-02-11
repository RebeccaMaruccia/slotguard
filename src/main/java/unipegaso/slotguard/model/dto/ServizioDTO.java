package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.Servizio;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ServizioDTO {

    private Long id;
    private String descrizione;
    private BigDecimal costoMedio;

    public static ServizioDTO toDTO(Servizio servizio) {
        ServizioDTO servizioDTO = new ServizioDTO();
        servizioDTO.setId(servizio.getId());
        servizioDTO.setDescrizione(servizio.getDescrizione());
        servizioDTO.setCostoMedio(servizio.getCostoMedio());
        return servizioDTO;
    }
}
