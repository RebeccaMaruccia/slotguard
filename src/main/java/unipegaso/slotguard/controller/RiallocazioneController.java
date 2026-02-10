package unipegaso.slotguard.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import unipegaso.slotguard.service.RiallocazioneService;

@RestController
@RequestMapping("/api/riallocazione")
public class RiallocazioneController {

    private RiallocazioneService riallocazioneService;

    public RiallocazioneController(RiallocazioneService riallocazioneService) {
        this.riallocazioneService = riallocazioneService;
    }
}
