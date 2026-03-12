package unipegaso.slotguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import unipegaso.slotguard.model.dto.SlotDTO;
import unipegaso.slotguard.service.SlotService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/slot")
public class SlotController {

    @Autowired
    private SlotService slotService;

    @PreAuthorize("hasRole('OPERATORE')")
    @PostMapping(value = "/get-slots")
    public ResponseEntity<List<SlotDTO>> getSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inizio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fine
    ) {
        LocalDateTime startDateTime = inizio.atStartOfDay();
        LocalDateTime endDateTime = (fine != null ? fine : LocalDate.now()).atStartOfDay();
        List<SlotDTO> slots = slotService.getSlots(startDateTime, endDateTime);
        return ResponseEntity.ok(slots);
    }

    @PreAuthorize("hasRole('OPERATORE')")
    @GetMapping(value = "/get")
    public ResponseEntity<SlotDTO> getSlot(@RequestParam Long id) {
        SlotDTO slot = slotService.getSlot(id);
        return ResponseEntity.ok(slot);
    }

    @PreAuthorize("hasRole('OPERATORE')")
    @PostMapping(value = "/genera-slots")
    public ResponseEntity<Void> generaSlots(@RequestParam long settimane) {
        slotService.generaSlotProssimeSettimane(settimane);
        return ResponseEntity.noContent().build();
    }
}
