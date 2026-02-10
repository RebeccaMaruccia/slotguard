package unipegaso.slotguard.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import unipegaso.slotguard.model.Operatore;
import unipegaso.slotguard.model.dto.jwt.AuthenticationRequest;
import unipegaso.slotguard.model.dto.jwt.AuthenticationResponse;
import unipegaso.slotguard.model.dto.jwt.RegisterRequest;
import unipegaso.slotguard.model.dto.jwt.RegisterResponse;
import unipegaso.slotguard.repository.OperatoreRepository;
import unipegaso.slotguard.service.AuthenticationService;
import unipegaso.slotguard.service.JwtService;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthenticationController {


    private final AuthenticationService authenticationService;
    private final OperatoreRepository operatoreRepository;
    private final JwtService jwtService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService, OperatoreRepository operatoreRepository, JwtService jwtService) {
        this.authenticationService = authenticationService;
        this.operatoreRepository = operatoreRepository;
        this.jwtService = jwtService;
    }

    /**
     * Registra un nuovo operatore
     *
     * @param registerRequest dati di registrazione
     * @return RegisterResponse con i dati dell'utente registrato
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        RegisterResponse response = authenticationService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Autentica un operatore tramite matricola e password
     *
     * @param authenticationRequest dati di autenticazione
     * @return AuthenticationResponse con i token JWT
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest authenticationRequest) {
        AuthenticationResponse response = authenticationService.authenticate(authenticationRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Verifica se la matricola è disponibile
     *
     * @param matricola matricola da verificare
     * @return true se disponibile, false altrimenti
     */
    @GetMapping("/check-matricola/{matricola}")
    public ResponseEntity<Boolean> checkMatricola(@PathVariable String matricola) {
        try {
            Optional<Operatore> utente = operatoreRepository.findByMatricola(matricola);
            return ResponseEntity.ok(utente.isPresent());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    /**
     * Recupera i dati dell'operatore autenticato dal token JWT
     *
     * @param token header Authorization contenente il Bearer token
     * @return Operatore associato alla matricola presente nel token
     */
    @GetMapping("/operatore")
    public ResponseEntity<Operatore> getOperatoreFromToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            final String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
            final String matricola = jwtService.extractUsername(jwt);

            Optional<Operatore> operatore = operatoreRepository.findByMatricola(matricola);
            if (operatore.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Operatore operatoreResponse = Operatore.builder()
                    .matricola(operatore.get().getMatricola())
                    .nome(operatore.get().getNome())
                    .cognome(operatore.get().getCognome())
                    .ruolo(operatore.get().getRuolo())
                    .password(null)
                    .build();

            return ResponseEntity.ok(operatoreResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}

