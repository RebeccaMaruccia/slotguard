package unipegaso.slotguard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.model.dto.KpiPieChartDTO;
import unipegaso.slotguard.model.dto.KpiSnapshotDTO;
import unipegaso.slotguard.model.enums.StatoPrenotazione;
import unipegaso.slotguard.repository.PrenotazioneRepository;
import unipegaso.slotguard.repository.RiallocazioneRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class KpiSnapshotService {

    @Autowired
    private PrenotazioneRepository prenotazioneRepository;

    @Autowired
    private RiallocazioneRepository riallocazioneRepository;

    @Transactional(readOnly = true)
    public KpiSnapshotDTO getRiepilogo(LocalDate inizio, LocalDate fine) {
        validateRange(inizio, fine);
        return calcolaKpi(inizio, fine);
    }

    @Transactional(readOnly = true)
    public KpiPieChartDTO getGraficoATorta(LocalDate inizio, LocalDate fine) {
        validateRange(inizio, fine);

        LocalDateTime from = inizio.atStartOfDay();
        LocalDateTime to = fine.plusDays(1).atStartOfDay();

        int noShowEffettivi = Math.toIntExact(
                prenotazioneRepository.countByDataAppuntamentoGreaterThanEqualAndDataAppuntamentoLessThanAndStatoPrenotazione(
                        from, to, StatoPrenotazione.NO_SHOW
                )
        );

        int noShowEvitatiStimati = Math.toIntExact(
                riallocazioneRepository.countByTsCreazioneGreaterThanEqualAndTsCreazioneLessThanAndEsito(from, to, true)
        );

        long riallocazioniAndateABuonFine = riallocazioneRepository
                .countByTsCreazioneGreaterThanEqualAndTsCreazioneLessThanAndEsito(from, to, true);

        long riallocazioniNonAndateABuonFine = riallocazioneRepository
                .countByTsCreazioneGreaterThanEqualAndTsCreazioneLessThanAndEsito(from, to, false);

        return new KpiPieChartDTO(
                noShowEffettivi,
                noShowEvitatiStimati,
                riallocazioniAndateABuonFine,
                riallocazioniNonAndateABuonFine
        );
    }

    private KpiSnapshotDTO calcolaKpi(LocalDate inizio, LocalDate fine) {
        LocalDateTime from = inizio.atStartOfDay();
        LocalDateTime to = fine.plusDays(1).atStartOfDay();

        int totAppuntamenti = Math.toIntExact(
                prenotazioneRepository.countByDataAppuntamentoGreaterThanEqualAndDataAppuntamentoLessThan(from, to)
        );

        int totNoShow = Math.toIntExact(
                prenotazioneRepository.countByDataAppuntamentoGreaterThanEqualAndDataAppuntamentoLessThanAndStatoPrenotazione(
                        from, to, StatoPrenotazione.NO_SHOW
                )
        );

        int totCancellazioni = Math.toIntExact(
                prenotazioneRepository.countByDataAppuntamentoGreaterThanEqualAndDataAppuntamentoLessThanAndStatoPrenotazioneIn(
                        from,
                        to,
                        List.of(StatoPrenotazione.CANCELLED_AUTO, StatoPrenotazione.CANCELLED_USER)
                )
        );

        int totRiallocazioni = Math.toIntExact(
                riallocazioneRepository.countByTsCreazioneGreaterThanEqualAndTsCreazioneLessThanAndEsito(from, to, true)
        );

        BigDecimal fatturatoPotenziale = prenotazioneRepository.sumCostoByDataAppuntamentoRange(from, to);
        BigDecimal fatturatoPerso = prenotazioneRepository
                .sumCostoByDataAppuntamentoRangeAndStato(from, to, StatoPrenotazione.NO_SHOW);

        return new KpiSnapshotDTO(inizio, fine, totAppuntamenti, totNoShow, totCancellazioni, totRiallocazioni, fatturatoPotenziale,
                fatturatoPerso, calcoloPercentuale(totNoShow, totAppuntamenti), calcoloPercentuale(totRiallocazioni, totNoShow));
    }

    private void validateRange(LocalDate inizio, LocalDate fine) {
        if (inizio == null || fine == null) {
            throw new IllegalArgumentException("Le date inizio e fine sono obbligatorie");
        }
        if (inizio.isAfter(fine)) {
            throw new IllegalArgumentException("La data di inizio non può essere successiva alla data di fine");
        }
    }

    private BigDecimal calcoloPercentuale(int numerator, int denominator) {
        if (denominator <= 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(numerator)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(denominator), 2, RoundingMode.HALF_UP);
    }
}