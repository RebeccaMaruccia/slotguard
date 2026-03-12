package unipegaso.slotguard.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class KpiPieChartDTO {

    // grafico 1, valori percentuali
    private int noShowEffettivi;
    private int noShowEvitatiStimati;

    // grafico 2,  valori percentuali
    private long riallocazioniAndateABuonFine;
    private long riallocazioniNonAndateABuonFine;
}
