package unipegaso.slotguard.model.enums;

public enum StatoNotifica {
    SENT,        // inviata, in attesa
    CONFIRMED,   // confermata dal paziente
    REJECTED,    // rifiutata/cancellata
    EXPIRED      // scaduta senza risposta

    //in inglese per convenzione e per evitare le ambiguità che sarebbero derivate dall'italiano
}
