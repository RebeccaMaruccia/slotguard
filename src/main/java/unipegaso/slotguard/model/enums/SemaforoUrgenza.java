package unipegaso.slotguard.model.enums;

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
}
