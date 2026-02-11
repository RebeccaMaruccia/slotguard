package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unipegaso.slotguard.model.dto.ServizioDTO;
import unipegaso.slotguard.service.ServizioService;

import java.util.List;

@RestController
@RequestMapping("/api/servizi")
public class ServizioController {

    @Autowired
    private ServizioService servizioService;

    @GetMapping(value = "/servizi")
    public ResponseEntity<List<ServizioDTO>> getServizi() throws Exception {
        List<ServizioDTO> servizi = servizioService.getServizi();
        return ResponseEntity.ok(servizi);
    }

    @GetMapping(value = "/servizio")
    public ResponseEntity<ServizioDTO> getServizio(@RequestParam Long id) throws Exception {
        ServizioDTO servizio = servizioService.getServizio(id);
        return ResponseEntity.ok(servizio);
    }

    @PostMapping(value = "/new-servizio")
    public ResponseEntity<ServizioDTO> createServizio(@RequestBody ServizioDTO req) throws Exception {
        ServizioDTO servizio = servizioService.creaServizio(req);
        return ResponseEntity.ok(servizio);
    }

    @PostMapping(value = "/delete-servizio")
    public ResponseEntity<ServizioDTO> deleteServizio(@RequestParam Long id) throws Exception {
        ServizioDTO servizio = servizioService.deleteServizio(id);
        return ResponseEntity.ok(servizio);
    }

    @PostMapping(value = "/update-servizio")
    public ResponseEntity<ServizioDTO> updateServizio(@RequestBody ServizioDTO req) throws Exception {
        ServizioDTO servizio = servizioService.updateServizio(req);
        return ResponseEntity.ok(servizio);
    }
}
