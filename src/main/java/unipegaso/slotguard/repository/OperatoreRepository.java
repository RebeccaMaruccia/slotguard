package unipegaso.slotguard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.Operatore;

import java.util.List;
import java.util.Optional;

@Repository
public interface OperatoreRepository extends JpaRepository<Operatore, String> {

    List<Operatore> findAll();
    Optional<Operatore> findByMatricola(String matricola);
}


