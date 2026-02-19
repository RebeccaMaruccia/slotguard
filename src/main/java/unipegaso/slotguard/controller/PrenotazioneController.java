package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import unipegaso.slotguard.model.dto.PrenotazioneDTOReq;
import unipegaso.slotguard.model.dto.PrenotazioneDTORes;
import unipegaso.slotguard.model.dto.RicercaPrenotazioneDTO;
import unipegaso.slotguard.model.dto.UpdatePrenotazioneDTOReq;
import unipegaso.slotguard.model.enums.StatoPrenotazione;
import unipegaso.slotguard.service.JwtService;
import unipegaso.slotguard.service.PrenotazioneService;

import java.util.List;

@RestController
@RequestMapping("/api/prenotazione")
public class PrenotazioneController {

    @Autowired
    private PrenotazioneService prenotazioneService;
    @Autowired
    private JwtService jwtService;

    //Ricerca prenotazioni con i filtri in input
    @PreAuthorize("hasRole( 'ADMIN')")
    @PostMapping(value = "/ricerca")
    public ResponseEntity<List<PrenotazioneDTORes>> ricercaPrenotazioni(@RequestBody RicercaPrenotazioneDTO req) throws Exception {
        List<PrenotazioneDTORes> prenotazioni = prenotazioneService.ricercaPrenotazioni(req);
        return ResponseEntity.ok(prenotazioni);
    }

    //Get per recuperare una singola prenotazione a partire dal suo id (dettaglio prenotazione)
    @PreAuthorize("hasRole( 'ADMIN')")
    @GetMapping(value = "/get")
    public ResponseEntity<PrenotazioneDTORes> getPrenotazione(@RequestParam Long id) throws Exception {
        PrenotazioneDTORes prenotazione = prenotazioneService.getPrenotazione(id);
        return ResponseEntity.ok(prenotazione);
    }

    //Create nuova prenotazione
    @PreAuthorize("hasRole( 'ADMIN')")
    @PostMapping(value = "/new-prenotazione")
    public ResponseEntity<PrenotazioneDTORes> createPrenotazione
                        (@RequestBody PrenotazioneDTOReq req, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) throws Exception {
        final String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        req.setMatricolaOperatore(jwtService.extractUsername(jwt));
        PrenotazioneDTORes prenotazione = prenotazioneService.creaPrenotazione(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(prenotazione);
    }

    //Modifica prenotazione a seguito di una richiesta utente oppure per necessita Admin
    @PreAuthorize("hasRole( 'ADMIN')")
    @PostMapping(value = "/update-prenotazione")
    public ResponseEntity<PrenotazioneDTORes> modificaPrenotazione
                        (@RequestBody UpdatePrenotazioneDTOReq req, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) throws Exception {
        final String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        req.setMatricolaOperatore(jwtService.extractUsername(jwt));
        PrenotazioneDTORes prenotazione = prenotazioneService.updatePrenotazione(req);
        return ResponseEntity.ok(prenotazione);
    }

    /* Aggiorna lo stato di una prenotazione (COMPLETATA (da front da parte dell'operatore),
       NO_SHOW (da front da parte dell'operatore) per non essersi presentato, CONFERMATA (da untente tramite token),
       CANCELLATA (da utente tramite token oppure da sistema) poiché sarà solo una cancellazione logica e non fisica)
     */
    @PreAuthorize("hasRole( 'ADMIN')")
    @PostMapping(value = "/update-stato-prenotazione")
    public ResponseEntity<PrenotazioneDTORes> updateStatoPrenotazione(@RequestParam Long idPrenotazione, @RequestParam StatoPrenotazione stato) throws Exception {
        PrenotazioneDTORes prenotazione = prenotazioneService.updateStatoPrenotazione(idPrenotazione, stato);
        return ResponseEntity.ok(prenotazione);
    }
}
