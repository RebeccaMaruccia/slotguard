package unipegaso.slotguard.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.enums.StatoNotifica;
import unipegaso.slotguard.model.enums.TipoNotifica;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Notifiche")
public class Notifica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoNotifica tipoNotifica;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato", nullable = false)
    private StatoNotifica statoNotifica;

    @Column(unique = true)
    private String token;

    @Column(name = "ts_invio", nullable = false)
    private LocalDateTime tsInvio;

    @Column(name = "ts_scadenza")
    private LocalDateTime tsScadenza;

    @Column(name = "ts_risposta")
    private LocalDateTime tsRisposta;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_prenotazione", nullable = false)
    private Prenotazione prenotazione;

    public Notifica(LocalDateTime tsRisposta, LocalDateTime tsScadenza, LocalDateTime tsInvio, String token, StatoNotifica statoNotifica, TipoNotifica tipoNotifica, Prenotazione prenotazione) {
        this.tsRisposta = tsRisposta;
        this.tsScadenza = tsScadenza;
        this.tsInvio = tsInvio;
        this.token = token;
        this.statoNotifica = statoNotifica;
        this.tipoNotifica = tipoNotifica;
        this.prenotazione = prenotazione;
    }
}
