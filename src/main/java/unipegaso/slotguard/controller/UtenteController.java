package unipegaso.slotguard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unipegaso.slotguard.service.UtenteService;

@RestController
@RequestMapping("/api/utente")
public class UtenteController {

    private UtenteService utenteService;

    public UtenteController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }
}
