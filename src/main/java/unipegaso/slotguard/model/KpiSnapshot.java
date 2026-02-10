package unipegaso.slotguard.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Kpi_Snapshot")
public class KpiSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "inizio_settimana", nullable = false)
    private LocalDate inizioSettimana;

    @Column(name = "tot_appuntamenti", nullable = false)
    private int totAppuntamenti;

    @Column(name = "tot_no_show", nullable = false)
    private int totNoShow;

    @Column(name = "tot_cancellazioni", nullable = false)
    private int totCancellazioni;

    @Column(name = "tot_riallocazioni", nullable = false)
    private int totRiallocazioni;

    @Column(name = "fatturato_potenziale", nullable = false)
    private BigDecimal fatturatoPotenziale;

    @Column(name = "fatturato_perso", nullable = false)
    private BigDecimal fatturatoPerso;

    @Column(name = "fatturato_recuperato", nullable = false)
    private BigDecimal fatturatoRecuperato;

    public KpiSnapshot(LocalDate inizioSettimana, int totAppuntamenti, int totNoShow, int totCancellazioni, int totRiallocazioni, BigDecimal fatturatoPotenziale, BigDecimal fatturatoPerso, BigDecimal fatturatoRecuperato) {
        this.inizioSettimana = inizioSettimana;
        this.totAppuntamenti = totAppuntamenti;
        this.totNoShow = totNoShow;
        this.totCancellazioni = totCancellazioni;
        this.totRiallocazioni = totRiallocazioni;
        this.fatturatoPotenziale = fatturatoPotenziale;
        this.fatturatoPerso = fatturatoPerso;
        this.fatturatoRecuperato = fatturatoRecuperato;
    }
}
