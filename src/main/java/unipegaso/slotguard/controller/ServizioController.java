package unipegaso.slotguard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unipegaso.slotguard.service.ServizioService;

@RestController
@RequestMapping("/api/servizi")
public class ServizioController {

    private ServizioService servizioService;

    public ServizioController(ServizioService servizioService) {
        this.servizioService = servizioService;
    }

}
