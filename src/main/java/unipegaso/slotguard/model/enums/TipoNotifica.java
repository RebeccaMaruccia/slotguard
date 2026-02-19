package unipegaso.slotguard.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TipoNotifica {
    RICHIESTA_CONFERMA, // richiesta conferma 72h prima
    CANCELLAZIONE,   // notifica di cancellazione
    PROPOSTA_RIALLOCAZIONE;  // offerta slot da waiting list

    @JsonCreator
    public static TipoNotifica from(String value) {
        return value == null ? null : TipoNotifica.valueOf(value.toUpperCase());
    }
}
