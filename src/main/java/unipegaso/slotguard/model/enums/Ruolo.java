package unipegaso.slotguard.model.enums;

public enum Ruolo {
    ADMIN,
    OPERATORE;

    public String asAuthority() {
        return "ROLE_" + name();
    }
}
