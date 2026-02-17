package unipegaso.slotguard.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.model.Utente;
import unipegaso.slotguard.model.dto.UtenteDTO;
import unipegaso.slotguard.repository.UtenteRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UtenteService {

    @Autowired
    private UtenteRepository utenteRepository;

    @Transactional(readOnly = true)
    public List<UtenteDTO> ricercaUtente(UtenteDTO req) throws Exception {
        return utenteRepository.ricercaUtenti(req)
                .stream()
                .map(UtenteDTO::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public UtenteDTO ricercaUtenteFromCF(String cf) throws Exception {
        Utente utente = getUtenteByCodiceFiscale(cf);
        return UtenteDTO.toDTO(utente);
    }

    @Transactional
    public UtenteDTO creaUtente(UtenteDTO req) throws Exception {
        //Controllo se esiste già un utente con lo stesso codice fiscale
        Optional<Utente> utente = utenteRepository.getUtenteByCodiceFiscale(req.getCodiceFiscale());
        if (utente.isPresent()) {
            throw new EntityExistsException("Utente già presente");
        }

        Utente newUtente = new Utente(req.getCodiceFiscale(), req.getNome(), req.getCognome(), req.getNumeroTelefono(), req.getEmail());

        return UtenteDTO.toDTO(utenteRepository.save(newUtente));
    }

    @Transactional
    public UtenteDTO updateUtente(UtenteDTO req) throws Exception {
        Utente utente = getUtenteByCodiceFiscale(req.getCodiceFiscale());

        if(req.getNumeroTelefono() != null) utente.setNumeroTelefono(req.getNumeroTelefono());
        if(req.getNome() != null) utente.setNome(req.getNome());
        if(req.getCognome() != null) utente.setCognome(req.getCognome());
        if(req.getEmail() != null) utente.setEmail(req.getEmail());

        return UtenteDTO.toDTO(utenteRepository.save(utente));

    }

    private Utente getUtenteByCodiceFiscale(String codiceFiscale) throws Exception {
        return utenteRepository.getUtenteByCodiceFiscale(codiceFiscale)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Utente non trovato"
                ));
    }
}
