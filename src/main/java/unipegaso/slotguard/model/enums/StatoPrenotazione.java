package unipegaso.slotguard.model.enums;

public enum StatoPrenotazione {
    BOOKED,           // prenotata, in attesa di conferma
    CONFIRMED,        // confermata dal paziente
    CANCELLED_AUTO,   // cancellata automaticamente (no risposta)
    CANCELLED_USER,   // cancellata dal paziente
    COMPLETED,        // visita effettuata
    NO_SHOW           // paziente non presentato

    //in inglese per convenzione e per evitare le ambiguità che sarebbero derivate dall'italiano
}
