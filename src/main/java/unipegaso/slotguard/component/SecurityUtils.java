package unipegaso.slotguard.component;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import unipegaso.slotguard.model.dto.jwt.JwtUserInfo;
import unipegaso.slotguard.service.JwtService;

import java.util.Map;

@Component
public class SecurityUtils {

    private final JwtService jwtService;

    public SecurityUtils(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public Authentication getAuthentication() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new IllegalStateException("Utente non autenticato");
        }
        return auth;
    }

    public Object getPrincipal() {
        Object principal = getAuthentication().getPrincipal();
        if (principal == null) {
            throw new IllegalStateException("Principal non presente nel contesto di sicurezza");
        }
        return principal;
    }

    public String getJwtToken() {
        Authentication auth = getAuthentication();
        String token = extractToken(auth.getCredentials());
        if (token != null) {
            return token;
        }

        token = extractToken(auth.getDetails());
        if (token != null) {
            return token;
        }

        token = extractToken(auth.getPrincipal());
        if (token != null) {
            return token;
        }

        throw new IllegalStateException("JWT non presente nel SecurityContext");
    }

    public Claims getClaims() {
        Object principal = getPrincipal();
        if (principal instanceof Jwt jwt) {
            Claims claims = jwtService.extractAllClaims(jwt.getTokenValue());
            claims.putIfAbsent(Claims.SUBJECT, jwt.getSubject());
            return claims;
        }
        if (principal instanceof JwtUserInfo jwtUserInfo && jwtUserInfo.getAllClaims() != null) {
            return jwtService.extractAllClaims(getJwtToken());
        }
        if (principal instanceof Map<?, ?> || principal instanceof UserDetails || principal instanceof String) {
            return jwtService.extractAllClaims(getJwtToken());
        }

        Object details = getAuthentication().getDetails();
        if (details instanceof Jwt jwt) {
            return jwtService.extractAllClaims(jwt.getTokenValue());
        }

        return jwtService.extractAllClaims(getJwtToken());
    }

    public String getMatricola() {
        return getClaimAsString("matricola");
    }

    public String getNome() {
        return getClaimAsString("nome");
    }

    public String getCognome() {
        return getClaimAsString("cognome");
    }

    public String getRuolo() {
        return getClaimAsString("ruolo");
    }

    public String getUsername() {
        String username = getClaimAsString("username");
        if (username != null && !username.isBlank()) {
            return username;
        }

        Object principal = getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        if (principal instanceof Jwt jwt) {
            return jwt.getSubject();
        }

        String authenticationName = getAuthentication().getName();
        return authenticationName != null && !authenticationName.isBlank() ? authenticationName : null;
    }

    private String getClaimAsString(String claimName) {
        Claims claims = getClaims();
        Object value = claims.get(claimName);
        if (value == null && Claims.SUBJECT.equals(claimName)) {
            value = claims.getSubject();
        }
        return value != null ? String.valueOf(value) : null;
    }

    private String extractToken(Object source) {
        if (source == null) {
            return null;
        }
        if (source instanceof Jwt jwt) {
            return jwt.getTokenValue();
        }
        if (source instanceof String stringValue && stringValue.startsWith("eyJ")) {
            return stringValue;
        }
        if (source instanceof Map<?, ?> map) {
            Object token = map.get("token");
            if (token == null) {
                token = map.get("jwt");
            }
            return token != null ? token.toString() : null;
        }
        if (source instanceof JwtUserInfo jwtUserInfo) {
            Object token = jwtUserInfo.getClaim("token");
            return token != null ? token.toString() : null;
        }
        return null;
    }
}
