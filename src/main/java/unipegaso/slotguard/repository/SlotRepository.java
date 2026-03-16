package unipegaso.slotguard.repository;


import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.SlotAppuntamento;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlotRepository extends CrudRepository<SlotAppuntamento, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SlotAppuntamento s WHERE s.inizio = :inizio")
    Optional<SlotAppuntamento> findByInizioForUpdate(@Param("inizio") LocalDateTime inizio);

    @Query("SELECT s FROM SlotAppuntamento s WHERE s.inizio = :inizio")
    Optional<SlotAppuntamento> findByInizio(@Param("inizio") LocalDateTime inizio);

    Boolean existsByInizio(LocalDateTime inizio);

    List<SlotAppuntamento> findByInizioBetweenOrderByInizioAsc(LocalDateTime from, LocalDateTime to);

    /**
     * Trova lo slot il cui inizio è <= del timestamp richiesto ed è il più recente prima di esso.
     * Usato per trovare slot storici con durata diversa dalla configurazione attuale.
     */
    @Query("""
            SELECT s FROM SlotAppuntamento s
            WHERE s.inizio <= :t
            ORDER BY s.inizio DESC
            LIMIT 1
            """)
    Optional<SlotAppuntamento> findSlotContaining(@Param("t") LocalDateTime t);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT s FROM SlotAppuntamento s
            WHERE s.inizio <= :t
            ORDER BY s.inizio DESC
            LIMIT 1
            """)
    Optional<SlotAppuntamento> findSlotContainingForUpdate(@Param("t") LocalDateTime t);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SlotAppuntamento s WHERE s.id = :id")
    Optional<SlotAppuntamento> findByIdForUpdate(@Param("id") Long id);



}
