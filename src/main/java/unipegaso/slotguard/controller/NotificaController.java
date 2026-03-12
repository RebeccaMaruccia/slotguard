package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/rispondi")
    public ResponseEntity<String> rispondiDaLink(@RequestParam String token,
                                                 @RequestParam boolean accetta) {
        notificaService.rispondiNotifica(token, accetta);
        return ResponseEntity.ok("Operazione completata. Puoi chiudere questa pagina.");
    }

}
