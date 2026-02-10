package unipegaso.slotguard.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Tentativi_Riallocazioni")
public class TentativoRiallocazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "slot_libero", nullable = false)
    private LocalDateTime slotLibero;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_servizio", nullable = false)
    private Servizio servizio;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_prenotazione", nullable = false)
    private Prenotazione prenotazione; //l'id della prenotazione che cerco di anticipare

    @OneToOne(optional = false)
    @JoinColumn(name = "id_notifica", nullable = false)
    private Notifica notifica;

    @Column(name = "ts_creazione", nullable = false)
    private LocalDateTime tsCreazione;

    public TentativoRiallocazione(LocalDateTime tsCreazione, Notifica notifica, Prenotazione prenotazione, Servizio servizio, LocalDateTime slotLibero, Long id) {
        this.tsCreazione = tsCreazione;
        this.notifica = notifica;
        this.prenotazione = prenotazione;
        this.servizio = servizio;
        this.slotLibero = slotLibero;
        this.id = id;
    }
}
