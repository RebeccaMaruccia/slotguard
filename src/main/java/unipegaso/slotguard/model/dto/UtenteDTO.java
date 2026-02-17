package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unipegaso.slotguard.model.Utente;

@Getter
@Setter
@NoArgsConstructor
public class UtenteDTO {

    private String codiceFiscale;
    private String nome;
    private String cognome;
    private String numeroTelefono;
    private String email;

    public static UtenteDTO toDTO(Utente utente) {
        UtenteDTO dto = new UtenteDTO();
        dto.codiceFiscale = utente.getCodiceFiscale();
        dto.nome = utente.getNome();
        dto.cognome = utente.getCognome();
        dto.numeroTelefono = utente.getNumeroTelefono();
        dto.email = utente.getEmail();
        return dto;
    }
}
