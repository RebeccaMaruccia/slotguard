package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class KpiSnapshotDTO {

    private String password;
    private LocalDate inizioSettimana;
    private int totAppuntamenti;
    private int totNoShow;
    private int totCancellazioni;
    private int totRiallocazioni;
    private BigDecimal fatturatoPotenziale;
    private BigDecimal fatturatoPerso;
    private BigDecimal fatturatoRecuperato;

}
