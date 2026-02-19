package unipegaso.slotguard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Notifica;
import unipegaso.slotguard.model.TentativoRiallocazione;

import java.util.Optional;

@Repository
public interface RiallocazioneRepository extends CrudRepository<TentativoRiallocazione, Long> {
    Optional<TentativoRiallocazione> findTentativoRiallocazioneByNotifica(Notifica notifica);
}
