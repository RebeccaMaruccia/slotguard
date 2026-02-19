package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import unipegaso.slotguard.model.dto.SlotDTO;
import unipegaso.slotguard.service.SlotService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slot")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @PreAuthorize("hasRole( 'ADMIN')")
    @PostMapping(value = "/get-slots")
    public ResponseEntity<List<SlotDTO>> getSlots(@RequestParam LocalDate inizio,
                                                  @RequestParam LocalDate fine) throws Exception {
        List<SlotDTO> slots = slotService.getSlots(inizio, fine);
        return ResponseEntity.ok(slots);
    }

    @PreAuthorize("hasRole( 'ADMIN')")
    @GetMapping(value = "/get")
    public ResponseEntity<SlotDTO> getSlot(@RequestParam Long id) throws Exception {
        SlotDTO slot = slotService.getSlot(id);
        return ResponseEntity.ok(slot);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/genera-slots")
    public ResponseEntity<Void> generaSlots(@RequestParam long settimane) throws Exception {
        slotService.generaSlotProssimeSettimane(settimane);
        return ResponseEntity.noContent().build();
    }
}
