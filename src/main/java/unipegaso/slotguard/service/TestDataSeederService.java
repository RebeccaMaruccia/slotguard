package unipegaso.slotguard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unipegaso.slotguard.configuration.SlotProperties;
import unipegaso.slotguard.model.*;
import unipegaso.slotguard.model.enums.Ruolo;
import unipegaso.slotguard.model.enums.SemaforoUrgenza;
import unipegaso.slotguard.model.enums.StatoPrenotazione;
import unipegaso.slotguard.repository.*;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TestDataSeederService {

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private OperatoreRepository operatoreRepository;

    @Autowired
    private ServizioRepository servizioRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private PrenotazioneRepository prenotazioneRepository;

    @Autowired
    private SlotService slotService;

    @Autowired
    private SlotProperties slotProperties;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Map<String, Object> seedTestData(int giorni, int prenotazioniPerGiorno) {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("utentiCreati", 0);
        stats.put("operatoriCreati", 0);
        stats.put("serviziCreati", 0);
        stats.put("slotCreati", 0);
        stats.put("prenotazioniCreate", 0);
        stats.put("prenotazioniSaltate", 0);
        stats.put("prenotazioniStoricheCreate", 0);

        // Step 1: Crea utenti demo
        List<Utente> utenti = seedUtenti();
        stats.put("utentiCreati", utenti.size());

        // Step 2: Crea operatore demo
        Operatore operatore = seedOperatore();
        stats.put("operatoriCreati", operatore != null ? 1 : 0);

        // Step 3: Crea servizi demo
        List<Servizio> servizi = seedServizi();
        stats.put("serviziCreati", servizi.size());

        // Step 4: Genera slot per i prossimi giorni
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(giorni);
        slotService.ensureSlots(today, endDate);

        // Step 5: Crea prenotazioni demo
        int[] prenotazioniStats = seedPrenotazioni(utenti, operatore, servizi, giorni, prenotazioniPerGiorno);
        stats.put("prenotazioniCreate", prenotazioniStats[0]);
        stats.put("prenotazioniSaltate", prenotazioniStats[1]);

        // Step 6: Crea prenotazioni storiche (2 anni fa) per KPI
        int prenotazioniStoriche = seedPrenotazioniStoriche(utenti, operatore, servizi);
        stats.put("prenotazioniStoricheCreate", prenotazioniStoriche);

        return stats;
    }

    private List<Utente> seedUtenti() {
        List<Utente> created = new ArrayList<>();

        String[][] utentiData = {
                {"RSSMRA85A01F205X", "Mario", "Rossi", "3201234567", "mario.rossi@example.com"},
                {"VRDGNN90B15G702W", "Giovanni", "Verdi", "3209876543", "giovanni.verdi@example.com"},
                {"BLNFRC92C20H501Z", "Francesco", "Bianchi", "3215555555", "francesco.bianchi@example.com"}
        };

        for (String[] data : utentiData) {
            String cf = data[0];
            if (utenteRepository.getUtenteByCodiceFiscale(cf).isEmpty()) {
                Utente utente = new Utente(cf, data[1], data[2], data[3], data[4]);
                utenteRepository.save(utente);
                created.add(utente);
            }
        }

        // Ritorna sempre gli utenti per le prenotazioni
        created.clear();
        for (String[] data : utentiData) {
            utenteRepository.getUtenteByCodiceFiscale(data[0]).ifPresent(created::add);
        }
        return created;
    }

    private Operatore seedOperatore() {
        String matricola = "OP001";
        Optional<Operatore> existing = operatoreRepository.findByMatricola(matricola);
        if (existing.isPresent()) {
            return existing.get();
        }

        Operatore operatore = new Operatore(
                matricola,
                "Admin",
                "Test",
                passwordEncoder.encode("password123"),
                Ruolo.OPERATORE
        );
        return operatoreRepository.save(operatore);
    }

    private List<Servizio> seedServizi() {
        List<Servizio> created = new ArrayList<>();

        String[][] serviziData = {
                {"Visita Cardiologica", "150.00"},
                {"Ecografia", "120.00"},
                {"Esame del Sangue", "80.00"}
        };

        for (String[] data : serviziData) {
            String descrizione = data[0];
            Optional<Servizio> existing = servizioRepository.findByDescrizione(descrizione);
            if (existing.isEmpty()) {
                Servizio servizio = new Servizio(
                        new BigDecimal(data[1]),
                        descrizione
                );
                servizioRepository.save(servizio);
                created.add(servizio);
            } else {
                created.add(existing.get());
            }
        }

        return created;
    }

    private int[] seedPrenotazioni(List<Utente> utenti, Operatore operatore, List<Servizio> servizi,
                                    int giorni, int prenotazioniPerGiorno) {
        int created = 0;
        int skipped = 0;

        if (utenti.isEmpty() || operatore == null || servizi.isEmpty()) {
            return new int[]{0, 0};
        }

        Random random = new Random();
        LocalDate today = LocalDate.now();

        for (int d = 0; d < giorni; d++) {
            LocalDate day = today.plusDays(d);

            // Salta weekend
            DayOfWeek dow = day.getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                continue;
            }

            // Carica gli slot per quel giorno
            LocalDateTime dayStart = day.atTime(slotProperties.getWorkingHours().getStart());
            LocalDateTime dayEnd = day.atTime(slotProperties.getWorkingHours().getEnd());
            List<SlotAppuntamento> slotsOfDay = slotRepository
                    .findByInizioBetweenOrderByInizioAsc(dayStart, dayEnd);

            // Crea prenotazioni random su questi slot
            for (int p = 0; p < prenotazioniPerGiorno && !slotsOfDay.isEmpty(); p++) {
                SlotAppuntamento slot = slotsOfDay.get(random.nextInt(slotsOfDay.size()));
                Utente utente = utenti.get(random.nextInt(utenti.size()));
                Servizio servizio = servizi.get(random.nextInt(servizi.size()));
                SemaforoUrgenza urgenza = SemaforoUrgenza.values()[random.nextInt(SemaforoUrgenza.values().length)];

                try {
                    // Check capienza
                    if (slot.getPrenotati() >= slot.getCapacita()) {
                        skipped++;
                        continue;
                    }

                    // Check servizio già presente nello slot
                    List<StatoPrenotazione> statiAttivi = List.of(StatoPrenotazione.BOOKED, StatoPrenotazione.CONFIRMED);
                    boolean servizioPresente = prenotazioneRepository
                            .existsBySlotIdAndServizioIdAndStatoPrenotazioneIn(slot.getId(), servizio.getId(), statiAttivi);
                    if (servizioPresente) {
                        skipped++;
                        continue;
                    }

                    // Crea prenotazione
                    Prenotazione prenotazione = new Prenotazione(
                            slot.getInizio(),
                            null,
                            urgenza,
                            utente,
                            operatore,
                            servizio,
                            operatore,
                            slot
                    );
                    prenotazioneRepository.save(prenotazione);

                    // Incrementa contatore slot
                    slot.setPrenotati(slot.getPrenotati() + 1);
                    slotRepository.save(slot);

                    created++;
                } catch (Exception e) {
                    skipped++;
                }
            }
        }

        return new int[]{created, skipped};
    }

    /**
     * Crea prenotazioni storiche (2 anni fa) per testare KPI e analitiche.
     * Genera ~100-150 prenotazioni con stati variati:
     * - 60% COMPLETED (visita effettuata)
     * - 20% NO_SHOW (paziente non presentato)
     * - 15% CANCELLED_USER (cancellato dal paziente)
     * - 5% CANCELLED_AUTO (cancellato automaticamente)
     */
    private int seedPrenotazioniStoriche(List<Utente> utenti, Operatore operatore, List<Servizio> servizi) {
        if (utenti.isEmpty() || operatore == null || servizi.isEmpty()) {
            return 0;
        }

        int created = 0;
        Random random = new Random();
        LocalDate today = LocalDate.now();
        LocalDate startStorico = today.minusYears(2);
        LocalDate endStorico = today.minusDays(1); // fino a ieri

        // Percorri 2 anni di giorni lavorativi (dal più antico al più recente)
        for (LocalDate day = startStorico; !day.isAfter(endStorico); day = day.plusDays(1)) {
            DayOfWeek dow = day.getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                continue;
            }

            // Per ogni giorno lavorativo crea 1-3 prenotazioni storiche
            int prenotazioniDelGiorno = 1 + random.nextInt(3);

            for (int p = 0; p < prenotazioniDelGiorno; p++) {
                try {
                    // Crea uno slot storico se non esiste (con ora casuale nell'orario lavorativo)
                    int oraRandom = slotProperties.getWorkingHours().getStart().getHour() +
                            random.nextInt(
                                    slotProperties.getWorkingHours().getEnd().getHour() -
                                    slotProperties.getWorkingHours().getStart().getHour()
                            );
                    LocalDateTime slotTime = day.atTime(oraRandom, 0);

                    SlotAppuntamento slot = slotRepository.findByInizio(slotTime)
                            .orElseGet(() -> {
                                SlotAppuntamento newSlot = new SlotAppuntamento(slotTime, 0);
                                return slotRepository.save(newSlot);
                            });

                    // Dati casuali
                    Utente utente = utenti.get(random.nextInt(utenti.size()));
                    Servizio servizio = servizi.get(random.nextInt(servizi.size()));
                    SemaforoUrgenza urgenza = SemaforoUrgenza.values()[random.nextInt(SemaforoUrgenza.values().length)];

                    // Stato finale casuale (COMPLETED 60%, NO_SHOW 20%, CANCELLED 15%, CANCELLED_AUTO 5%)
                    int rand = random.nextInt(100);
                    StatoPrenotazione stato;
                    if (rand < 60) {
                        stato = StatoPrenotazione.COMPLETED;
                    } else if (rand < 80) {
                        stato = StatoPrenotazione.NO_SHOW;
                    } else if (rand < 95) {
                        stato = StatoPrenotazione.CANCELLED_USER;
                    } else {
                        stato = StatoPrenotazione.CANCELLED_AUTO;
                    }

                    // Crea prenotazione con stato storico
                    Prenotazione prenotazione = new Prenotazione(
                            slotTime,
                            null,
                            urgenza,
                            utente,
                            operatore,
                            servizio,
                            operatore,
                            slot
                    );
                    prenotazione.setStatoPrenotazione(stato);
                    prenotazione.setDataInserimento(slotTime.minusDays(random.nextInt(30))); // inserita alcuni giorni prima

                    prenotazioneRepository.save(prenotazione);

                    // Incrementa contatore slot solo se occupante (BOOKED o CONFIRMED)
                    if (StatoPrenotazione.isSlotOccupato(stato)) {
                        slot.setPrenotati(slot.getPrenotati() + 1);
                        slotRepository.save(slot);
                    }

                    created++;
                } catch (Exception e) {
                    // Salta in caso di errore (es. duplicato serv/slot)
                }
            }
        }

        return created;
    }
}
