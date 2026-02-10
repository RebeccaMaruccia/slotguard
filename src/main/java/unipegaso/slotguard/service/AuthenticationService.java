package unipegaso.slotguard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import unipegaso.slotguard.exception.UserAlreadyExistsException;
import unipegaso.slotguard.model.Operatore;
import unipegaso.slotguard.model.dto.jwt.AuthenticationRequest;
import unipegaso.slotguard.model.dto.jwt.AuthenticationResponse;
import unipegaso.slotguard.model.dto.jwt.RegisterRequest;
import unipegaso.slotguard.model.dto.jwt.RegisterResponse;
import unipegaso.slotguard.model.enums.Ruolo;
import unipegaso.slotguard.repository.OperatoreRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final OperatoreRepository operatoreRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthenticationService(
            OperatoreRepository operatoreRepository,
            JwtService jwtService,
            BCryptPasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.operatoreRepository = operatoreRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registra un nuovo operatore
     * @param registerRequest dati di registrazione
     * @return RegisterResponse con i dati dell'operatore registrato
     * @throws IllegalArgumentException se le password non coincidono o la password è troppo corta
     */
    public RegisterResponse register(RegisterRequest registerRequest) {
        // Verifica se la matricola esiste già
        Optional<Operatore> existingUser = operatoreRepository.findByMatricola(registerRequest.getMatricola());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("La matricola " + registerRequest.getMatricola() + " è già registrata");
        }

        // Verifica che le password coincidano
        if (!registerRequest.getPassword().equals(registerRequest.getPasswordConfirm())) {
            throw new IllegalArgumentException("Le password non coincidono");
        }

        // Verifica della lunghezza minima della password
        if (registerRequest.getPassword().length() < 6) {
            throw new IllegalArgumentException("La password deve avere almeno 6 caratteri");
        }

        // Crea il nuovo operatore
        Operatore operatore = Operatore.builder()
                .matricola(registerRequest.getMatricola())
                .nome(registerRequest.getNome())
                .cognome(registerRequest.getCognome())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .ruolo(Ruolo.OPERATORE)
                .build();

        // Salva l'operatore
        Operatore savedOperatore = operatoreRepository.save(operatore);

        return RegisterResponse.builder()
                .matricola(savedOperatore.getMatricola())
                .nome(savedOperatore.getNome())
                .cognome(savedOperatore.getCognome())
                .message("Operatore registrato con successo")
                .build();
    }

    /**
     * Autentica un operatore
     * @param authenticationRequest dati di autenticazione
     * @return AuthenticationResponse con token JWT
     */
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        // Autentica l'utente tramite AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getMatricola(),
                        authenticationRequest.getPassword()
                )
        );

        // Estrae l'operatore autenticato
        Operatore operatore = (Operatore) authentication.getPrincipal();

        // Genera i token JWT
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("matricola", operatore.getMatricola());
        extraClaims.put("nome", operatore.getNome());
        extraClaims.put("cognome", operatore.getCognome());
        extraClaims.put("ruolo", operatore.getRuolo());

        String accessToken = jwtService.generateToken(extraClaims, operatore);
        String refreshToken = jwtService.generateRefreshToken(extraClaims, operatore);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtService.getExpirationTime())
                .type("Bearer")
                .build();
    }
}

