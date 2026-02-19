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

    @Column(name = "ts_creazione", nullable = false)
    private LocalDateTime tsCreazione;

    @Column
    private Boolean esito; //TRUE se la riallocazione è andata a buon fine, FALSE se no

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_slot", nullable = false)
    private SlotAppuntamento slotLibero;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_servizio", nullable = false)
    private Servizio servizio;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_prenotazione", nullable = false)
    private Prenotazione prenotazione; //l'id della prenotazione che è stata cancellata

    @OneToOne(optional = false)
    @JoinColumn(name = "id_notifica")
    private Notifica notifica; //con prenotazione che cerco di anticipare

    public TentativoRiallocazione(LocalDateTime tsCreazione, Notifica notifica, Prenotazione prenotazione, Servizio servizio, SlotAppuntamento slotLibero) {
        this.tsCreazione = tsCreazione;
        this.notifica = notifica;
        this.esito = null;
        this.prenotazione = prenotazione;
        this.servizio = servizio;
        this.slotLibero = slotLibero;
    }

    public TentativoRiallocazione(Notifica notifica, Prenotazione pCancellata){
        this.tsCreazione = LocalDateTime.now();
        this.notifica = notifica;
        this.prenotazione = pCancellata;
        this.servizio = pCancellata.getServizio();
        this.slotLibero = pCancellata.getSlot();
        this.esito = null;

    }
}
