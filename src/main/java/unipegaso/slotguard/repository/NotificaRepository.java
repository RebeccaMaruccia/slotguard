package unipegaso.slotguard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Notifica;
import unipegaso.slotguard.model.enums.StatoNotifica;
import unipegaso.slotguard.model.enums.TipoNotifica;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificaRepository extends CrudRepository<Notifica, Long> {

    boolean existsByPrenotazioneIdAndTipoNotifica(Long prenotazioneId, TipoNotifica tipoNotifica);

    Optional<Notifica> findByToken(String token);

    List<Notifica> findByStatoNotificaAndTsScadenzaBefore(StatoNotifica statoNotifica, LocalDateTime now);

}
