package unipegaso.slotguard.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KpiSnapshotDTO {
    private LocalDate inizio;
    private LocalDate fine;
    private int totAppuntamenti;
    private int totNoShow;
    private int totCancellazioni;
    private int totRiallocazioni;
    private BigDecimal fatturatoPotenziale;
    private BigDecimal fatturatoPerso;
    private BigDecimal tassoNoShow;
    private BigDecimal tassoRiallocazione;
}
