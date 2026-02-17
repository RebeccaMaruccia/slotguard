package unipegaso.slotguard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.model.SlotAppuntamento;
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
    public List<SlotAppuntamento> getSlots(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.plusDays(1).atStartOfDay();
            return slotRepository.findByInizioBetweenOrderByInizioAsc(start, end);
    }


}
