package unipegaso.slotguard.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
@ConfigurationProperties(prefix = "slot")
@Getter
@Setter
public class SlotProperties {

    private WorkingHours workingHours = new WorkingHours();
    private int durationMinutes = 60;

    @Getter
    @Setter
    public static class WorkingHours {
        private LocalTime start = LocalTime.of(9, 0);
        private LocalTime end = LocalTime.of(17, 0);
    }

    public int getSlotsPerDay() {
        long minutesBetween = java.time.temporal.ChronoUnit.MINUTES.between(
                workingHours.getStart(),
                workingHours.getEnd()
        );
        return (int) (minutesBetween / durationMinutes);
    }
}

