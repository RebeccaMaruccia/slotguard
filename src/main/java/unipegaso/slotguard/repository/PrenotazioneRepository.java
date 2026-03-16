package unipegaso.slotguard.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.dto.RicercaPrenotazioneDTO;
import unipegaso.slotguard.model.enums.StatoPrenotazione;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrenotazioneRepository extends CrudRepository<Prenotazione, Long> {

    @Query("""
                SELECT p
                FROM Prenotazione p
                WHERE (:#{#dto.dataInizio} IS NULL OR p.dataAppuntamento >= :#{#dto.dataInizio})
                  AND (:#{#dto.dataFine} IS NULL OR p.dataAppuntamento <= :#{#dto.dataFine})
                  AND (:#{#dto.statoPrenotazione} IS NULL OR p.statoPrenotazione = :#{#dto.statoPrenotazione})
                  AND (:#{#dto.semaforoUrgenza} IS NULL OR p.semaforoUrgenza = :#{#dto.semaforoUrgenza})
                  AND (:#{#dto.cfUtente} IS NULL OR p.utente.codiceFiscale = :#{#dto.cfUtente})
                  AND (:#{#dto.matricolaOperatore} IS NULL OR p.operatore.matricola = :#{#dto.matricolaOperatore})
                  AND (:#{#dto.idServizio} IS NULL OR p.servizio.id = :#{#dto.idServizio})
                ORDER BY p.dataAppuntamento ASC
            """)
    List<Prenotazione> ricercaPrenotazioni(@Param("dto") RicercaPrenotazioneDTO dto);

    Optional<Prenotazione> findPrenotazioneById(Long id);

    boolean existsBySlotIdAndServizioIdAndStatoPrenotazioneIn(
            Long slotId, Long servizioId, List<StatoPrenotazione> stati);

    List<Prenotazione> findBySlotIdIn(List<Long> slotIds);

    @Query("""
            SELECT p FROM Prenotazione p
            WHERE p.dataAppuntamento >= :start
              AND p.dataAppuntamento < :end
              AND p.statoPrenotazione = :stato
            """)
    List<Prenotazione> findByDataAppuntamentoRangeAndStati(@Param("start") LocalDateTime start,
                                                           @Param("end") LocalDateTime end,
                                                           @Param("stato") StatoPrenotazione stato);

    @Query("""
            SELECT p FROM Prenotazione p
            WHERE p.servizio.id = :idServizio
              AND p.statoPrenotazione = unipegaso.slotguard.model.enums.StatoPrenotazione.BOOKED
              AND p.dataAppuntamento > :dataMinima              
              AND p.id NOT IN (
                    SELECT n.prenotazione.id
                    FROM Notifica n
                    WHERE n.tipoNotifica = unipegaso.slotguard.model.enums.TipoNotifica.PROPOSTA_RIALLOCAZIONE
              )
            ORDER BY
                CASE p.semaforoUrgenza
                    WHEN unipegaso.slotguard.model.enums.SemaforoUrgenza.ROSSO THEN 0
                    WHEN unipegaso.slotguard.model.enums.SemaforoUrgenza.GIALLO THEN 1
                    ELSE 2
                END,
                p.dataAppuntamento DESC
            """)
    List<Prenotazione> findCandidatiRiallocazione(@Param("idServizio") Long idServizio,
                                                  @Param("dataMinima") LocalDateTime dataMinima);

    long countByDataAppuntamentoGreaterThanEqualAndDataAppuntamentoLessThan(LocalDateTime from,
                                                                            LocalDateTime to);

    long countByDataAppuntamentoGreaterThanEqualAndDataAppuntamentoLessThanAndStatoPrenotazione(LocalDateTime from,
                                                                                                LocalDateTime to,
                                                                                                StatoPrenotazione statoPrenotazione);

    long countByDataAppuntamentoGreaterThanEqualAndDataAppuntamentoLessThanAndStatoPrenotazioneIn(LocalDateTime from,
                                                                                                  LocalDateTime to,
                                                                                                  List<StatoPrenotazione> statiPrenotazione);

    @Query("""
            SELECT COALESCE(SUM(p.servizio.costoMedio), 0)
            FROM Prenotazione p
            WHERE p.dataAppuntamento >= :from
              AND p.dataAppuntamento < :to
            """)
    java.math.BigDecimal sumCostoByDataAppuntamentoRange(@Param("from") LocalDateTime from,
                                                         @Param("to") LocalDateTime to);

    @Query("""
            SELECT COALESCE(SUM(p.servizio.costoMedio), 0)
            FROM Prenotazione p
            WHERE p.dataAppuntamento >= :from
              AND p.dataAppuntamento < :to
              AND p.statoPrenotazione = :stato
            """)
    java.math.BigDecimal sumCostoByDataAppuntamentoRangeAndStato(@Param("from") LocalDateTime from,
                                                                 @Param("to") LocalDateTime to,
                                                                 @Param("stato") StatoPrenotazione stato);

}
