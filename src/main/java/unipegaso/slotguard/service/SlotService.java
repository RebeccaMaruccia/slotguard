package unipegaso.slotguard.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.model.SlotAppuntamento;
import unipegaso.slotguard.model.dto.SlotDTO;
import unipegaso.slotguard.repository.SlotRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Transactional
    public void generaSlotProssimeSettimane(long settimane) {
        LocalDate oggi = LocalDate.now();
        LocalDate fine = oggi.plusWeeks(settimane);
        ensureSlots(oggi, fine.minusDays(1)); // include l'ultimo giorno utile
    }

    @Transactional
    public void ensureSlots(LocalDate from, LocalDate to) {
        for (LocalDate day = from; !day.isAfter(to); day = day.plusDays(1)) {

            DayOfWeek dow = day.getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) continue;

            LocalDateTime start = day.atTime(9, 0);
            LocalDateTime end = day.atTime(17, 0); // escluso -> ultimo slot 16:00

            for (LocalDateTime t = start; t.isBefore(end); t = t.plusHours(1)) {
                if (!slotRepository.existsByInizio(t)) {
                    slotRepository.save(new SlotAppuntamento(t, 0));
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<SlotDTO> getSlots(LocalDateTime inizio, LocalDateTime fine) {
        LocalDate startDate = (inizio == null ? LocalDate.now() : inizio.toLocalDate());
        LocalDate endDate = (fine == null ? LocalDate.now() : fine.toLocalDate()).plusDays(1);
        return slotRepository.findByInizioBetweenOrderByInizioAsc(startDate.atStartOfDay(), endDate.atStartOfDay())
                .stream()
                .map(SlotDTO::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SlotDTO> getSlots(LocalDate inizio, LocalDate fine) {
        LocalDate startDate = (inizio == null ? LocalDate.now() : inizio);
        LocalDate endDate = (fine == null ? LocalDate.now() : fine).plusDays(1);
        return slotRepository.findByInizioBetweenOrderByInizioAsc(startDate.atStartOfDay(), endDate.atStartOfDay())
                .stream()
                .map(SlotDTO::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public SlotDTO getSlot(Long id) {
        return SlotDTO.toDTO(slotRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new EntityNotFoundException(
                "Slot non trovato"
        )));
    }


}
