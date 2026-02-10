package unipegaso.slotguard.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Servizi")
public class Servizio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(nullable = false)
    private String descrizione;

    @Column(name = "costo_medio", nullable = false)
    private BigDecimal costoMedio;

    public Servizio(BigDecimal costoMedio, String descrizione) {
        this.costoMedio = costoMedio;
        this.descrizione = descrizione;
    }
}
