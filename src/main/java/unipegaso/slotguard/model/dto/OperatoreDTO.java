package unipegaso.slotguard.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OperatoreDTO {

    private String matricola;
    private String nome;
    private String cognome;
    private String password;
    private String token;

}
