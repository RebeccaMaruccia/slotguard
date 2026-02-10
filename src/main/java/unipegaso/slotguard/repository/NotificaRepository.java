package unipegaso.slotguard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Notifica;

@Repository
public interface NotificaRepository extends CrudRepository<Notifica, Long> {
}
