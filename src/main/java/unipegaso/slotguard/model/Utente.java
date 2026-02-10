package unipegaso.slotguard.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Utenti")
public class Utente {

    @Id
    @Column(name = "codice_fiscale", nullable = false, unique = true)
    private String codiceFiscale;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String cognome;

    @Column(name = "numero_telefono", nullable = false)
    private String numeroTelefono;

    @Column(name = "email", nullable = false)
    private String email;

    public Utente(String codiceFiscale, String nome, String cognome, String numeroTelefono, String email) {
        this.codiceFiscale = codiceFiscale;
        this.nome = nome;
        this.cognome = cognome;
        this.numeroTelefono = numeroTelefono;
        this.email = email;
    }
}
