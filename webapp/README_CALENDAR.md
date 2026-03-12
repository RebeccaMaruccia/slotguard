# Calendario Settimanale per Prenotazioni - Material-UI

## 📋 Overview
Sistema completo di gestione prenotazioni con calendario settimanale in Material-UI, senza CSS esterni.

## 📦 Componenti Creati

### 1. **useAppointmentCalendar.hook.ts** 
Hook per gestire la logica del calendario:
- Navigazione tra settimane (precedente, successiva, oggi)
- Calcolo automatico dei giorni della settimana
- Integrazione con RTK Query per il caricamento degli slot
- Tipizzazione completa di `ISlot` e `IWeekDay`

**Principali funzioni:**
- `loadWeekSlots()` - Carica gli slot della settimana corrente
- `goToNextWeek()` - Naviga alla settimana successiva
- `goToPreviousWeek()` - Naviga alla settimana precedente
- `goToToday()` - Torna alla settimana odierna

---

### 2. **CalendarWeekView.tsx**
Componente principale che visualizza il calendario con:
- **Griglia responsive** - Adatta a desktop, tablet e mobile
- **7 colonne per i giorni della settimana**
- **Cards per ogni giorno** con:
  - Nome e numero del giorno
  - Badge "Oggi" per il giorno attuale
  - Lista degli slot disponibili e prenotati
  - Pulsante "Prenota" per gli slot disponibili

**Features:**
- Visualizzazione orari slot (HH:mm - HH:mm)
- Codifica colori: verde disponibile, rosso prenotato
- Indicazione del cliente per slot prenotati
- Pulsanti di navigazione con icone Material-UI

---

### 3. **BookingModal.tsx**
Dialog modale per creare una nuova prenotazione con:
- **Visualizzazione slot selezionato** (data e orario)
- **Form validato** con Yup:
  - Nome cliente (min 3 caratteri)
  - Email valida
  - Telefono (min 10 caratteri)
  - Servizio
  - Note opzionali

**Integrazione:**
- Utilizza `useFormCustomHook` per gestione form
- Validazione in tempo reale
- Messaggi d'errore inline
- Loading state durante la prenotazione

---

### 4. **appointments.hook.ts** (Aggiornato)
Hook per gestire lo stato della prenotazione:
- State per modal di prenotazione
- State per slot e giorno selezionato
- Integrazione RTK Query:
  - `useGetSlotsMutation()` per caricare gli slot
  - `useCreatePrenotazioneMutation()` per creare prenotazioni
- Funzioni callback per gestire i click

---

### 5. **appointments.page.view.tsx** (Aggiornato)
Pagina principale che integra tutti i componenti:
- Calendario
- Modal di prenotazione
- Gestione dello stato globale

---

## 🎨 Design Material-UI
Nessun CSS personalizzato, tutto con Material-UI:
- **Colori:**
  - Verde: slot disponibili e giorno oggi
  - Rosso: slot prenotati
  - Blu: selezioni e interazioni
  - Grigio: background
  
- **Componenti usati:**
  - `Card` - Per le cards dei giorni e degli slot
  - `Dialog` - Per il modal di prenotazione
  - `TextField` - Per i form input
  - `Button` - Per azioni
  - `Chip` - Per badge e stati
  - `Stack` - Per layout
  - `Grid` - Per griglia responsiva
  - `IconButton` - Per navigazione

---

## 📱 Responsive Design
- **Desktop (lg)**: 7 colonne per settimana
- **Tablet (md)**: 4 colonne
- **Mobile (xs/sm)**: 6 colonne, poi stack verticale

---

## 🚀 Come Usare

```typescript
// La pagina è già integrata in appointments.page.view.tsx
// Basta navigare alla rotta /appointments

// Per personalizzare:
// 1. Modificare i servizi disponibili in BookingModal
// 2. Aggiungere logica per filtri avanzati
// 3. Estendere con azioni aggiuntive su slot/prenotazioni
```

---

## 🔧 Dipendenze Utilizzate
- `@mui/material` - UI components
- `@mui/icons-material` - Icons
- `date-fns` - Data manipulation
- `react-hook-form` - Form handling
- `yup` - Schema validation
- `@reduxjs/toolkit` - State management

---

## ✅ Funzionalità Completate
- [x] Calendario settimanale con navigazione
- [x] Caricamento dinamico slot da API
- [x] Modal di prenotazione
- [x] Validazione form
- [x] Design Material-UI completo
- [x] Responsive design
- [x] TypeScript typizzazione completa
- [x] Senza CSS personalizzato

---

## 📝 Prossimi Step Suggeriti
1. Implementare feedback toast (già disponibile: `react-hot-toast`)
2. Aggiungere filtri per servizi e operatori
3. Implementare vista mese/giorno
4. Aggiungere esportazione prenotazioni
5. Sincronizzazione calendario in tempo reale

