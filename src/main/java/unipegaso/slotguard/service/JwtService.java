package unipegaso.slotguard.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;
import unipegaso.slotguard.model.dto.jwt.JwtUserInfo;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${security.jwt.secret-key}")
    private String secretKey;
    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;
    @Value("${security.jwt.expiration-time24}")
    private long jwtExpiration24;
    @Value("${security.jwt.expiration-time12}")
    private long jwtExpiration12;
    @Value("${security.jwt.refresh-expiration-time}")
    private long jwtRefreshExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration * 60 * 1000);
    }
    public String generateToken12h(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration12 * 60 * 1000);
    }
    public String generateToken24h(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration24 * 60 * 1000);
    }
    public String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtRefreshExpiration* 60 * 1000);
    }

    public long getExpirationTime() {
        return jwtExpiration * 60 * 1000;
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        Claims claims = extractAllClaims(token);
        if(claims.get("refreshToken") != null && claims.get("refreshToken").equals(true)) {
            return false;
        }
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Estrae le informazioni dell'utente dal JWT e verifica la validità del token
     * Questo metodo valida il token prima di estrarre le informazioni
     *
     * @param token il JWT token
     * @return JwtUtenteDTO con tutte le informazioni dell'utente dai claim
     */
    public JwtUserInfo getUserInfoFromToken(String token) throws Exception {
        try {
            // Verifica che il token non sia scaduto
            if (isTokenExpired(token)) {
                throw new Exception();
            }

            // Estrae i claim dal token
            Claims claims = extractAllClaims(token);

            // Crea l'oggetto JwtUtenteDTO dalle info nei claim
            JwtUserInfo userInfo = new JwtUserInfo();

            // Estrae le info principali (adatta i nomi ai tuoi claim)
            // Se usi il subject per l'email
            userInfo.setEmail(claims.getSubject());

            // Estrai da claims se presenti, altrimenti rimangono null
            if (claims.containsKey("idUtente")) {
                userInfo.setIdUtente(Long.parseLong(claims.get("idUtente").toString()));
            }
            if (claims.containsKey("username")) {
                userInfo.setUsername((String) claims.get("username"));
            }
            if (claims.containsKey("nome")) {
                userInfo.setNome((String) claims.get("nome"));
            }
            if (claims.containsKey("cognome")) {
                userInfo.setCognome((String) claims.get("cognome"));
            }

            // Salva tutti i claim per accesso generico
            userInfo.setAllClaims(claims);

            return userInfo;
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Estrae le informazioni dell'utente dal JWT SENZA validare il token
     * Usa questo metodo se il token è già stato validato altrove
     *
     * @param token il JWT token
     * @return JwtUtenteDTO con tutte le informazioni dell'utente dai claim
     */
    public JwtUserInfo getUserInfoFromTokenWithoutValidation(String token) throws Exception {
        try {
            // Estrae i claim dal token senza validazione
            Claims claims = extractAllClaims(token);

            // Crea l'oggetto JwtUtenteDTO dalle info nei claim
            JwtUserInfo userInfo = new JwtUserInfo();

            // Estrae le info principali
            userInfo.setEmail(claims.getSubject());

            if (claims.containsKey("idUtente")) {
                userInfo.setIdUtente(Long.parseLong(claims.get("idUtente").toString()));
            }
            if (claims.containsKey("username")) {
                userInfo.setUsername((String) claims.get("username"));
            }
            if (claims.containsKey("nome")) {
                userInfo.setNome((String) claims.get("nome"));
            }
            if (claims.containsKey("cognome")) {
                userInfo.setCognome((String) claims.get("cognome"));
            }

            // Salva tutti i claim per accesso generico
            userInfo.setAllClaims(claims);

            return userInfo;
        } catch (Exception e) {
            throw e;
        }
    }

    public boolean isTokenRefreshValid(String token, UserDetails userDetails) throws Exception {
        final String username = extractUsername(token);
        Claims claims = extractAllClaims(token);
        if(claims.get("refreshToken") != null && claims.get("refreshToken").equals(true)) {
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        }
        else {
            throw new Exception("Token refresh non valido per questo endpoint");
        }
    }
    @Bean
    public JwtDecoder jwtDecoder() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            SecretKey key = Keys.hmacShaKeyFor(keyBytes);
            return NimbusJwtDecoder.withSecretKey(key).build();
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Failed to initialize JwtDecoder: Invalid secret key format", e);
        }
    }
}
