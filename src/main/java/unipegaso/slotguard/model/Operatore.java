package unipegaso.slotguard.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import unipegaso.slotguard.model.enums.Ruolo;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "Operatori")
public class Operatore implements UserDetails {

    @Id
    @Column(nullable = false, unique = true)
    private String matricola;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String cognome;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Ruolo ruolo;

    public Operatore(String matricola, String nome, String cognome, String password,Ruolo ruolo) {
        this.matricola = matricola;
        this.nome = nome;
        this.cognome = cognome;
        this.password = password;
        this.ruolo = ruolo;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(ruolo.asAuthority()));
    }

    @Override
    public String getUsername() {
        return matricola;
    }
}
