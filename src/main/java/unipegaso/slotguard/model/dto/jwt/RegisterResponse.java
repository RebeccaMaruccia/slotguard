package unipegaso.slotguard.model.dto.jwt;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private String matricola;
    private String nome;
    private String cognome;
    private String message;
}

