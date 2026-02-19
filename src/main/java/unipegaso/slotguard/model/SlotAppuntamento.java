package unipegaso.slotguard.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Slot_Appuntamenti", uniqueConstraints = @UniqueConstraint(columnNames = {"inizio"}))
public class SlotAppuntamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime inizio;   // es: 11-02-2026 09:00

    @Column(nullable = false)
    private int capacita = 3;

    @Column(nullable = false)
    private int prenotati;

    public SlotAppuntamento(LocalDateTime inizio, int prenotati) {
        this.inizio = inizio;
        this.prenotati = prenotati;
    }
}
