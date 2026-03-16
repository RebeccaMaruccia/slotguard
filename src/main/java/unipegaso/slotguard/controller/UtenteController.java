package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import unipegaso.slotguard.model.dto.UtenteDTO;
import unipegaso.slotguard.service.UtenteService;

import java.util.List;

@RestController
@RequestMapping("/api/utente")
public class UtenteController {

    @Autowired
    private UtenteService utenteService;

    //Ricerca utenti con i filtri in input
    @PreAuthorize("hasRole( 'OPERATORE')")
    @PostMapping(value = "/ricerca")
    public ResponseEntity<List<UtenteDTO>> ricercaUtenti(@RequestBody UtenteDTO req) throws Exception {
        List<UtenteDTO> utenti = utenteService.ricercaUtente(req);
        return ResponseEntity.ok(utenti);
    }

    //Get per recuperare una singolo uente a partire dal suo codice fiscale (dettaglio utente)
    @PreAuthorize("hasRole( 'OPERATORE')")
    @GetMapping(value = "/get")
    public ResponseEntity<UtenteDTO> getUtente(@RequestParam String cf) throws Exception {
        UtenteDTO utenteDTO = utenteService.ricercaUtenteFromCF(cf);
        return ResponseEntity.ok(utenteDTO);
    }

    @PreAuthorize("hasRole( 'OPERATORE')")
    @PostMapping(value = "/new-utente")
    public ResponseEntity<UtenteDTO> createUtente(@RequestBody UtenteDTO req) throws Exception {
        UtenteDTO servizio = utenteService.creaUtente(req);
        return ResponseEntity.ok(servizio);
    }

    @PreAuthorize("hasRole( 'OPERATORE')")
    @PostMapping(value = "/update-utente")
    public ResponseEntity<UtenteDTO> updateUtente(@RequestBody UtenteDTO req) throws Exception {
        UtenteDTO servizio = utenteService.updateUtente(req);
        return ResponseEntity.ok(servizio);
    }

}
