package unipegaso.slotguard.model.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class KpiResponseDTO {
    private String granularity;
    private List<KpiSnapshotDTO> kpis;
}