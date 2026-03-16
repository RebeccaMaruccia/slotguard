package unipegaso.slotguard.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.configuration.SlotProperties;
import unipegaso.slotguard.model.Prenotazione;
import unipegaso.slotguard.model.SlotAppuntamento;
import unipegaso.slotguard.model.dto.SlotDTO;
import unipegaso.slotguard.repository.PrenotazioneRepository;
import unipegaso.slotguard.repository.SlotRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private SlotProperties slotProperties;

    @Autowired
    private PrenotazioneRepository prenotazioneRepository;

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

            LocalDateTime start = day.atTime(slotProperties.getWorkingHours().getStart());
            LocalDateTime end = day.atTime(slotProperties.getWorkingHours().getEnd());

            for (LocalDateTime t = start; t.isBefore(end); t = t.plusMinutes(slotProperties.getDurationMinutes())) {
                if (!slotRepository.existsByInizio(t)) {
                    slotRepository.save(new SlotAppuntamento(t, 0));
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<SlotDTO> getSlots(LocalDateTime inizio, LocalDateTime fine) {
        LocalDate startDate = inizio.toLocalDate();
        LocalDate endDate = (fine == null ? LocalDate.now() : fine.toLocalDate());

        List<SlotAppuntamento> slotEntities = new ArrayList<>();

        for (LocalDate day = startDate; !day.isAfter(endDate); day = day.plusDays(1)) {
            DayOfWeek dow = day.getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) continue;

            LocalTime workStart = slotProperties.getWorkingHours().getStart();
            LocalTime workEnd   = slotProperties.getWorkingHours().getEnd();
            int durationMinutes = slotProperties.getDurationMinutes();

            LocalDateTime slotStart = day.atTime(workStart);
            LocalDateTime slotEnd   = day.atTime(workEnd);

            for (LocalDateTime t = slotStart; t.isBefore(slotEnd); t = t.plusMinutes(durationMinutes)) {
                SlotAppuntamento slotEntity = slotRepository.findByInizio(t)
                        .orElse(new SlotAppuntamento(t, 0));
                slotEntities.add(slotEntity);
            }
        }

        // Carica tutte le prenotazioni degli slot esistenti nel DB in una sola query
        List<Long> slotIds = slotEntities.stream()
                .map(SlotAppuntamento::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        Map<Long, List<Prenotazione>> prenotazioniPerSlot = slotIds.isEmpty()
                ? Map.of()
                : prenotazioneRepository.findBySlotIdIn(slotIds)
                        .stream()
                        .collect(Collectors.groupingBy(p -> p.getSlot().getId()));

        return slotEntities.stream()
                .map(slot -> SlotDTO.toDTO(
                        slot,
                        slotProperties,
                        slot.getId() != null
                                ? prenotazioniPerSlot.getOrDefault(slot.getId(), List.of())
                                : List.of()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SlotDTO> getSlots(LocalDate inizio, LocalDate fine) {
        LocalDateTime startDateTime = inizio.atStartOfDay();
        LocalDateTime endDateTime = (fine != null ? fine : LocalDate.now()).atStartOfDay();
        return getSlots(startDateTime, endDateTime);
    }

    @Transactional(readOnly = true)
    public SlotDTO getSlot(Long id) {
        return SlotDTO.toDTO(slotRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new EntityNotFoundException(
                "Slot non trovato"
        )));
    }


}
