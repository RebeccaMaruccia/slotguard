package unipegaso.slotguard.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Notifica;
import unipegaso.slotguard.model.TentativoRiallocazione;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RiallocazioneRepository extends CrudRepository<TentativoRiallocazione, Long> {
    Optional<TentativoRiallocazione> findTentativoRiallocazioneByNotifica(Notifica notifica);

    long countByTsCreazioneGreaterThanEqualAndTsCreazioneLessThanAndEsito(LocalDateTime from,
                                                                          LocalDateTime to,
                                                                          Boolean esito);
    @Query("""
            SELECT COALESCE(SUM(t.servizio.costoMedio), 0)
            FROM TentativoRiallocazione t
            WHERE t.tsCreazione >= :from
              AND t.tsCreazione < :to
              AND t.esito = :esito
            """)
    BigDecimal sumCostoByTsCreazioneRangeAndEsito(@Param("from") LocalDateTime from,
                                                  @Param("to") LocalDateTime to,
                                                  @Param("esito") Boolean esito);
}
