package unipegaso.slotguard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unipegaso.slotguard.service.NotificaService;

@RestController
@RequestMapping("/api/notifica")
public class NotificaController {

    private NotificaService notificaService;

    public NotificaController(NotificaService notificaService) {
        this.notificaService = notificaService;
    }
}
