package unipegaso.slotguard.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import unipegaso.slotguard.model.dto.KpiPieChartDTO;
import unipegaso.slotguard.model.dto.KpiSnapshotDTO;
import unipegaso.slotguard.service.KpiSnapshotService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/statistiche")
public class KpiSnapshotController {

    private KpiSnapshotService kpiSnapshotService;

    public KpiSnapshotController(KpiSnapshotService kpiSnapshotService) {
        this.kpiSnapshotService = kpiSnapshotService;
    }

    @GetMapping("/riepilogo")
    public KpiSnapshotDTO getRiepilogo(@RequestParam LocalDate inizio,
                                     @RequestParam LocalDate fine) {
        try {
            return kpiSnapshotService.getRiepilogo(inizio, fine);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @GetMapping("/grafico-a-torta")
    public KpiPieChartDTO getPieCharts(@RequestParam LocalDate inizio,
                                        @RequestParam LocalDate fine) {
        try {
            return kpiSnapshotService.getGraficoATorta(inizio, fine);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }


}
