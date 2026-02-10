package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UtenteDTO {

    private String codiceFiscale;
    private String nome;
    private String cognome;
    private String numeroTelefono;
}
