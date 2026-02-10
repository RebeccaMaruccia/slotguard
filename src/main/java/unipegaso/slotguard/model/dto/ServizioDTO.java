package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ServizioDTO {

    private Long id;
    private String descrizione;
    private BigDecimal costoMedio;
}
