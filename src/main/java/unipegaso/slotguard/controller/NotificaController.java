package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import unipegaso.slotguard.service.NotificaService;

@RestController
@RequestMapping("/public/notifica")
public class NotificaController {

    @Autowired
    private NotificaService notificaService;

    @PostMapping("/rispondi")
    public ResponseEntity<String> rispondi(@RequestParam String token,
                                           @RequestParam boolean accetta) {
        notificaService.rispondiNotifica(token, accetta);
        return ResponseEntity.ok("Risposta registrata");
    }

}
