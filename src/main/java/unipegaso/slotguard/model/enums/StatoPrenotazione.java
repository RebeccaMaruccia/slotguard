package unipegaso.slotguard.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Map;
import java.util.Set;

public enum StatoPrenotazione {
    BOOKED,           // prenotata, in attesa di conferma
    CONFIRMED,        // confermata dal paziente
    CANCELLED_AUTO,   // cancellata automaticamente (no risposta)
    CANCELLED_USER,   // cancellata dal paziente
    COMPLETED,        // visita effettuata
    NO_SHOW;           // paziente non presentato

    //in inglese per convenzione e per evitare le ambiguità che sarebbero derivate dall'italiano

    @JsonCreator
    public static StatoPrenotazione from(String value) {
        return value == null ? null : StatoPrenotazione.valueOf(value.toUpperCase());
    }

    private static final Map<StatoPrenotazione, Set<StatoPrenotazione>> TRANSIZIONI_AMMESSE =
            Map.of(
                    StatoPrenotazione.BOOKED, Set.of(
                            StatoPrenotazione.CONFIRMED,
                            StatoPrenotazione.CANCELLED_USER,
                            StatoPrenotazione.CANCELLED_AUTO
                    ),
                    StatoPrenotazione.CONFIRMED, Set.of(
                            StatoPrenotazione.COMPLETED,
                            StatoPrenotazione.NO_SHOW,
                            StatoPrenotazione.CANCELLED_USER,
                            StatoPrenotazione.CANCELLED_AUTO
                    ),
                    StatoPrenotazione.CANCELLED_AUTO, Set.of(),
                    StatoPrenotazione.CANCELLED_USER, Set.of(),
                    StatoPrenotazione.COMPLETED, Set.of(),
                    StatoPrenotazione.NO_SHOW, Set.of()
            );

    public boolean canChangeTo(StatoPrenotazione nuovo) {
        if (nuovo == null || this == nuovo) return true;
        return TRANSIZIONI_AMMESSE.getOrDefault(this, Set.of()).contains(nuovo);
    }

    public static boolean isSlotOccupato(StatoPrenotazione s) {
        return s == StatoPrenotazione.BOOKED || s == StatoPrenotazione.CONFIRMED;
    }
}
