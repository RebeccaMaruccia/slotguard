package unipegaso.slotguard.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.model.Servizio;
import unipegaso.slotguard.model.dto.ServizioDTO;
import unipegaso.slotguard.repository.ServizioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ServizioService {

    @Autowired
    private ServizioRepository servizioRepository;

    @Transactional(readOnly = true)
    public List<ServizioDTO> getServizi() throws Exception {
        return servizioRepository.findAll()
                .stream()
                .map(ServizioDTO::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServizioDTO getServizio(Long id) throws Exception {
        Servizio servizio = getServizioById(id);
        return ServizioDTO.toDTO(servizio);
    }

    @Transactional
    public ServizioDTO creaServizio(ServizioDTO req) throws Exception {
        //Controllo se esiste già un servizio con lo stesso nome e lo stesso prezzo, per evitare l'inserimento di dati inconsistenti
        Optional<Servizio> servizio = servizioRepository.findByCostoMedioAndDescrizione(req.getCostoMedio(), req.getDescrizione());
        if (servizio.isPresent()) {
            throw new EntityExistsException("Servizio già presente");
        }

        Servizio newServizio = new Servizio(req.getCostoMedio(), req.getDescrizione());

        return ServizioDTO.toDTO(servizioRepository.save(newServizio));
    }

    @Transactional
    public ServizioDTO deleteServizio(Long id) throws Exception {
        Servizio servizio = servizioRepository.findServizioByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Servizio non trovato"
                ));

        servizio.setDeleted(true);
        return ServizioDTO.toDTO(servizioRepository.save(servizio));
    }

    @Transactional
    public ServizioDTO updateServizio(ServizioDTO req) throws Exception {
        Servizio servizio = getServizioById(req.getId());

        if(req.getDescrizione() != null) servizio.setDescrizione(req.getDescrizione());
        if(req.getCostoMedio() != null) servizio.setCostoMedio(req.getCostoMedio());

        return ServizioDTO.toDTO(servizioRepository.save(servizio));
    }

    private Servizio getServizioById(Long id){
        return servizioRepository.findServizioByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Servizio non trovato"
                ));
    }
}
