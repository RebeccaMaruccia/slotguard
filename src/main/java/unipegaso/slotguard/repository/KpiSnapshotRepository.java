package unipegaso.slotguard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import unipegaso.slotguard.model.KpiSnapshot;

@Repository
public interface KpiSnapshotRepository extends CrudRepository<KpiSnapshot, Long> {
}
