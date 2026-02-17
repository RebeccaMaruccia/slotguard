package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unipegaso.slotguard.service.NotificaService;

@RestController
@RequestMapping("/api/notifica")
public class NotificaController {

    @Autowired
    private NotificaService notificaService;



}
