package unipegaso.slotguard.model.dto.jwt;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "La matricola è obbligatoria")
    private String matricola;

    @NotBlank(message = "Il nome è obbligatorio")
    private String nome;

    @NotBlank(message = "Il cognome è obbligatorio")
    private String cognome;

    @NotBlank(message = "La password è obbligatoria")
    private String password;

    @NotBlank(message = "La conferma password è obbligatoria")
    private String passwordConfirm;
}

