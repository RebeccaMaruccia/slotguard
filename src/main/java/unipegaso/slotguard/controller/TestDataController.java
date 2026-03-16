package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unipegaso.slotguard.model.dto.TestDataSeedRequest;
import unipegaso.slotguard.service.TestDataSeederService;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test-data")
public class TestDataController {

    @Autowired
    private TestDataSeederService testDataSeederService;

    /**
     * Endpoint per generare dati di test nel DB.
     * Protetto da ruolo OPERATORE.
     *
     * Body di esempio:
     * {
     *   "giorni": 7,
     *   "prenotazioniPerGiorno": 3
     * }
     *
     * Ritorna:
     * {
     *   "ok": true,
     *   "dettaglio": {
     *     "utentiCreati": 3,
     *     "operatoriCreati": 1,
     *     "serviziCreati": 3,
     *     "slotCreati": 0,
     *     "prenotazioniCreate": 8,
     *     "prenotazioniSaltate": 1
     *   }
     * }
     */
    @PreAuthorize("hasRole('OPERATORE')")
    @PostMapping("/seed")
    public ResponseEntity<Map<String, Object>> seedTestData(
            @RequestBody(required = false) TestDataSeedRequest request) {

        int giorni = request != null && request.getGiorni() != null && request.getGiorni() > 0
                ? request.getGiorni()
                : 5;

        int prenotazioniPerGiorno = request != null && request.getPrenotazioniPerGiorno() != null && request.getPrenotazioniPerGiorno() > 0
                ? request.getPrenotazioniPerGiorno()
                : 2;

        Map<String, Object> stats = testDataSeederService.seedTestData(giorni, prenotazioniPerGiorno);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", true);
        response.put("dettaglio", stats);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

