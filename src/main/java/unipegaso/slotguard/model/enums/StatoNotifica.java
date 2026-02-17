package unipegaso.slotguard.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum StatoNotifica {
    SENT,        // inviata, in attesa
    CONFIRMED,   // confermata dal paziente
    REJECTED,    // rifiutata/cancellata
    EXPIRED;      // scaduta senza risposta

    //in inglese per convenzione e per evitare le ambiguità che sarebbero derivate dall'italiano

    @JsonCreator
    public static StatoNotifica from(String value) {
        return value == null ? null : StatoNotifica.valueOf(value.toUpperCase());
    }
}
