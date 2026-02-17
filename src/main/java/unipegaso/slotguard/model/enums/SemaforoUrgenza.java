package unipegaso.slotguard.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum SemaforoUrgenza {
    VERDE("Semaforo Verde (bassa urgenza)"),
    GIALLO("Semaforo Giallo (media urgenza)"),
    ROSSO("Semaforo Rosso (alta urgenza)");

    private String descrizione;
    SemaforoUrgenza(String descrizione) {
        this.descrizione = descrizione;
    }

    public String getDescrizione() {
        return descrizione;
    }

    @JsonCreator
    public static SemaforoUrgenza from(String value) {
        return value == null ? null : SemaforoUrgenza.valueOf(value.toUpperCase());
    }
}
