package unipegaso.slotguard.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TipoNotifica {
    RICHIESTA_CONFERMA("Conferma il tuo appuntamento"), // richiesta conferma 72h prima
    CANCELLAZIONE("La tua prenotazione è stata cancellata"),   // notifica di cancellazione
    PROPOSTA_RIALLOCAZIONE("Proposta di anticipo appuntamento");  // offerta slot da waiting list

    private String oggetto;
    TipoNotifica(String oggetto) {
        this.oggetto = oggetto;
    }

    public String getOggetto() {
        return oggetto;
    }
    @JsonCreator
    public static TipoNotifica from(String value) {
        return value == null ? null : TipoNotifica.valueOf(value.toUpperCase());
    }
}
