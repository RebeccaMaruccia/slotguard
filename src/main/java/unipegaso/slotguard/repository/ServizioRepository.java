package unipegaso.slotguard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Servizio;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServizioRepository extends CrudRepository<Servizio, Long> {
    //Passo fisso deleted = false per cancellazione logica. Recuperare tutti i servizi senza filtro servirà soltanto per lo storico
    Optional<Servizio> findServizioByIdAndDeletedFalse(Long id);

    List<Servizio> findAll();

    Optional<Servizio> findByCostoMedioAndDescrizione(BigDecimal costoMedio, String descrizione);

    Optional<Servizio> findByDescrizione(String descrizione);
}