# slotguard
Applicazione full-stack API-based per un’organizzazione del settore sanitario

## Indice
- [Panoramica](#panoramica)
- [Stack tecnologico](#stack-tecnologico)
- [Prerequisiti](#prerequisiti)
- [Configurazione ambiente](#configurazione-ambiente)
- [Avvio rapido (locale)](#avvio-rapido-locale)
- [Build e test](#build-e-test)
- [API e autenticazione](#api-e-autenticazione)
- [Troubleshooting](#troubleshooting)

---

## Panoramica
SlotGuard espone endpoint REST per:
- gestione autenticazione/authorizatione utenti,
- gestione domini applicativi (es. risorse, configurazioni, operazioni business),
- persistenza dati su database relazionale,
- validazione input e gestione errori API.

> Aggiorna questa sezione con i casi d’uso reali del progetto (es. prenotazioni, gestione slot, notifiche, reportistica).

---

## Stack tecnologico
- **Java 17+**
- **Spring Boot**
- **Spring Web**
- **Spring Data JPA**
- **Spring Security + JWT**
- **Maven**
- **PostgreSQL**

---

## Prerequisiti
Prima di avviare il progetto, assicurati di avere:

1. **JDK 21 o superiore**
2. **Maven 3.9+** 
3. Variabili ambiente / file di configurazione pronti (vedi sezione seguente)

Verifica veloce:

```bash
java -version
mvn -version
docker --version
```

---

## Configurazione ambiente
La configurazione tipica in Spring Boot vive in:
- `src/main/resources/application.yml`
- oppure `application.properties`
- eventualmente file per profilo: `application-dev.yml`, `application-prod.yml`
---

## Avvio rapido (locale)

### 1) Clona il repository
```bash
git clone <https://github.com/RebeccaMaruccia/slotguard>
cd slotguard
```

### 2) Configura database e variabili
- Crea il DB locale.
- Imposta variabili ambiente o `application-dev.yml`.

### 3) Avvia l’app
Con Maven:

```bash
mvn spring-boot:run
```

Oppure build + run jar:

```bash
mvn clean package
```

### 4) Verifica avvio
Se tutto è ok, l’app sarà disponibile su:

- `http://localhost:8080`
- endpoint health (se actuator attivo): `http://localhost:8080/actuator/health`

---

## API e autenticazione

### Autenticazione JWT
Flusso tipico:
1. Login su endpoint auth (`/auth/login` o simile)
2. Ricezione token JWT
3. Invio token nelle chiamate protette:

```http
Authorization: Bearer <token>
```

### Documentazione API
Se presente Swagger/OpenAPI:
- `http://localhost:8080/slotGuard/swagger-ui/index.html`
- `http://localhost:8080/slotGuard/v3/api-docs`

---

## Troubleshooting

### Porta già occupata
Errore: `Port 8080 is already in use`
- cambia porta via `SERVER_PORT` o `server.port`
- termina il processo che usa la porta

### Errore connessione DB
- verifica host/porta/credenziali
- controlla che il DB sia avviato
- verifica firewall/rete se DB remoto

### JWT non valido / 401
- verifica `JWT_SECRET`
- controlla scadenza token
- controlla header `Authorization`
---