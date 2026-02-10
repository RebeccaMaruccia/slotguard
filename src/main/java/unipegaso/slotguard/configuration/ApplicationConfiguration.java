package unipegaso.slotguard.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import unipegaso.slotguard.model.Operatore;
import unipegaso.slotguard.repository.OperatoreRepository;

import java.util.Optional;
@Configuration
public class ApplicationConfiguration {
    private final OperatoreRepository operatoreRepository;

    public ApplicationConfiguration(OperatoreRepository operatoreRepository) {
        this.operatoreRepository = operatoreRepository;
    }

    @Bean
    UserDetailsService userDetailsService() {
        return username -> {
            Optional<Operatore> operatore = operatoreRepository.findByMatricola(username);
            if (operatore.isPresent()) {
                return (UserDetails) operatore.get();
            }
            if(operatore.isEmpty()) {
                throw new UsernameNotFoundException("email.not_found");
            }
            return null;
        };
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }
}