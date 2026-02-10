package unipegaso.slotguard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Servizio;

import java.util.List;

@Repository
public interface ServizioRepository extends CrudRepository<Servizio, Long> {
    // il servizio non è Optinal perché sarà selezionato da una lista
    Servizio getServizioById(Long id);
    List<Servizio> getAll();
}
