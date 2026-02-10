package unipegaso.slotguard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Utente;

import java.util.Optional;

@Repository
public interface UtenteRepository extends CrudRepository<Utente, Long> {
    Optional<Utente> getUtenteByCodiceFiscale(String codiceFiscale);
}
