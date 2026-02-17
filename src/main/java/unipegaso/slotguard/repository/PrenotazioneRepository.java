package unipegaso.slotguard.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.dto.RicercaPrenotazioneDTO;

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

    Optional<Prenotazione> findBy(Long id);

    Prenotazione getPrenotazioneById(Long id);

    Long id(Long id);
}
