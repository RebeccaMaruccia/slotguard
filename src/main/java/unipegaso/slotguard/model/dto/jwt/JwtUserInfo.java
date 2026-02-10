package unipegaso.slotguard.model.dto.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Map;

/**
 * DTO per le informazioni dell'utente estratte dal JWT
 * Contiene tutte le info principali dell'utente presenti nei claim del token
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtUserInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    // Info principali dell'utente
    private Long idUtente;
    private String email;
    private String username;
    private String nome;
    private String cognome;

    // Tutti i claim grezzi per accesso a info aggiuntive
    private Map<String, Object> allClaims;

    // Metodo helper per accedere a claim specifici
    public Object getClaim(String claimName) {
        return allClaims != null ? allClaims.get(claimName) : null;
    }

    // Metodo helper per accedere a claim con tipo specifico
    @SuppressWarnings("unchecked")
    public <T> T getClaim(String claimName, Class<T> type) {
        Object value = getClaim(claimName);
        if (value == null) {
            return null;
        }
        return (T) value;
    }
}

