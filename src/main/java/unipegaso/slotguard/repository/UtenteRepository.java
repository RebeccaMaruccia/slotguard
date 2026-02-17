package unipegaso.slotguard.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Utente;
import unipegaso.slotguard.model.dto.UtenteDTO;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtenteRepository extends CrudRepository<Utente, Long> {
    Optional<Utente> getUtenteByCodiceFiscale(String codiceFiscale);

    @Query("""
              SELECT u
              FROM Utente u
              WHERE (:#{#dto.codiceFiscale} IS NULL OR u.codiceFiscale ILIKE :#{#dto.codiceFiscale})
                AND (:#{#dto.cognome} IS NULL OR u.cognome ILIKE :#{#dto.cognome})
                AND (:#{#dto.nome} IS NULL OR u.nome ILIKE :#{#dto.nome})
                AND (:#{#dto.email} IS NULL OR u.email ILIKE :#{#dto.email})
                AND (:#{#dto.numeroTelefono} IS NULL OR u.numeroTelefono = :#{#dto.numeroTelefono})
            """)
    List<Utente> ricercaUtenti(@Param("dto") UtenteDTO dto);
}
