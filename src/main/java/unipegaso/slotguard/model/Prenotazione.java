package unipegaso.slotguard.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.enums.SemaforoUrgenza;
import unipegaso.slotguard.model.enums.StatoPrenotazione;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Prenotazioni")
public class Prenotazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "ts_inserimento", nullable = false)
    private LocalDateTime dataInserimento;

    @Column(name = "ts_update")
    private LocalDateTime dataUpdate;

    @Column(name = "ts_appuntamento", nullable = false)
    private LocalDateTime dataAppuntamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato_prenotazione",nullable = false)
    private StatoPrenotazione statoPrenotazione;

    @Enumerated(EnumType.STRING)
    @Column(name = "semaforo_urgenza",nullable = false)
    private SemaforoUrgenza semaforoUrgenza;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cf_utente", nullable = false)
    private Utente utente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "matricola_operatore", nullable = false)
    private Operatore operatore;

    @ManyToOne(optional = false)
    @JoinColumn(name = "matricola_operatore_update", nullable = false)
    private Operatore operatoreUpdate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_servizio", nullable = false)
    private Servizio servizio;

    @ManyToOne(optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private SlotAppuntamento slot;

    public Prenotazione(LocalDateTime dataAppuntamento, LocalDateTime dataUpdate, SemaforoUrgenza semaforoUrgenza, Utente utente, Operatore operatore, Servizio servizio, Operatore operatoreUpdate, SlotAppuntamento slot) {
        this.dataAppuntamento = dataAppuntamento;
        this.statoPrenotazione = StatoPrenotazione.BOOKED;
        this.semaforoUrgenza = semaforoUrgenza;
        this.utente = utente;
        this.operatore = operatore;
        this.servizio = servizio;
        this.dataInserimento = LocalDateTime.now();
        this.dataUpdate = LocalDateTime.now();
        this.operatoreUpdate = operatoreUpdate;
        this.slot = slot;
    }
}
