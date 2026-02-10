package unipegaso.slotguard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.TentativoRiallocazione;

@Repository
public interface RiallocazioneRepository extends CrudRepository<TentativoRiallocazione, Long> {
}
