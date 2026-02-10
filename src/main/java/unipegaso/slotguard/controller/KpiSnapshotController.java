package unipegaso.slotguard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unipegaso.slotguard.service.KpiSnapshotService;

@RestController
@RequestMapping("/api/statistiche")
public class KpiSnapshotController {

    private KpiSnapshotService kpiSnapshotService;

    public KpiSnapshotController(KpiSnapshotService kpiSnapshotService) {
        this.kpiSnapshotService = kpiSnapshotService;
    }
}
