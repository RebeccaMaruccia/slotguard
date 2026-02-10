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
public class AuthenticationRequest {
    @NotBlank(message = "La matricola è obbligatoria")
    private String matricola;

    @NotBlank(message = "La password è obbligatoria")
    private String password;
}

