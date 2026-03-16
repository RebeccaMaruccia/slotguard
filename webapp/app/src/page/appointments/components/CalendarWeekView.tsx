import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Divider,
    Fab,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Circle as CircleIcon,
    Person as PersonIcon,
    Today as TodayIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import {useFormatUtilityHook} from "../../../shared/formatUtility";
import useAppointmentCalendar, {IWeekDay} from "../hook/useAppointmentCalendar.hook";
import {PrenotazioneDtoRes, SlotDto} from "api-service";
import React, {useState} from "react";

interface ICalendarWeekViewProps {
  onSelectSlot?: (slot: SlotDto, day: IWeekDay) => void;
  onBookAppointment?: (slot: SlotDto, day: IWeekDay) => void;
  onCreateAppointment?: (slot: SlotDto, date: Date) => void;
  onEditAppuntamento?: (appuntamento: PrenotazioneDtoRes) => void;
  onChangeStatus?: (appuntamento: PrenotazioneDtoRes) => void;
  onDeleteAppuntamento?: (appuntamento: PrenotazioneDtoRes) => void;
}

const CalendarWeekView: React.FC<ICalendarWeekViewProps> = ({
  onSelectSlot,
  onBookAppointment,
  onCreateAppointment,
  onEditAppuntamento,
  onChangeStatus,
  onDeleteAppuntamento,
}) => {
  const [showSlotSelector, setShowSlotSelector] = useState(false);

  const {
    weekDays,
    weekRangeLabel,
    selectedDate,
    setSelectedDate,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    slotsLoading,
    slotsError,
  } = useAppointmentCalendar();


  return (
    <Grid  sx={{ py: 0 }}>
      {/* Header con navigazione */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={goToPreviousWeek}
            disabled={slotsLoading}
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={goToToday}
            disabled={slotsLoading}
            color="info"
            size="small"
          >
            <TodayIcon />
          </IconButton>
          <IconButton
            onClick={goToNextWeek}
            disabled={slotsLoading}
            size="small"
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>

        <Typography variant="h5" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
          {weekRangeLabel}
        </Typography>

        {slotsLoading && <CircularProgress size={24} />}
      </Stack>

      {/* Errori */}
      {slotsError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Errore nel caricamento degli slot. Riprova più tardi.
        </Alert>
      )}

      {/* Giorni della settimana */}
      <Stack  justifyContent={"center"} spacing={2} direction={{ sm: 'column', md: 'row' }}   sx={{ flexWrap: 'wrap' }}>
        {weekDays.map((day: IWeekDay, index: number) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg:2}}>
            <DayCard
              day={day} 
              isSelected={
                selectedDate !== null && day.date.toDateString() === selectedDate.toDateString()
              }
              onSelectSlot={onSelectSlot}
              onBookAppointment={onBookAppointment}
              onCreateAppointment={onCreateAppointment}
              onEditAppuntamento={onEditAppuntamento}
              onChangeStatus={onChangeStatus}
              onDeleteAppuntamento={onDeleteAppuntamento}
            />
          </Grid>
        ))}
      </Stack>

      {/* FAB per creare nuovo appuntamento */}
      {onCreateAppointment && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={() => setShowSlotSelector(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Modal semplice per scegliere lo slot */}
      {showSlotSelector && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
          }}
          onClick={() => setShowSlotSelector(false)}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              zIndex: 1201,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader
              title="Seleziona uno slot"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "& .MuiCardHeader-title": { color: "white" },
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                {weekDays.map((day, dayIndex) =>
                  day.slots.length > 0 ? (
                    <div key={dayIndex}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                        {day.dayName} {day.dayNumber}
                      </Typography>
                      <Stack spacing={1} sx={{ ml: 2 }}>
                        {day.slots.map((slot, slotIndex) => (
                          <Button
                            key={slotIndex}
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                if (onCreateAppointment) {
                                    onCreateAppointment(slot, day.date);
                                }
                              setShowSlotSelector(false);
                            }}
                            sx={{ justifyContent: "flex-start" }}
                          >
                            {formatSlotTime(slot.inizio, slot.fine)}
                          </Button>
                        ))}
                      </Stack>
                    </div>
                  ) : null
                )}
              </Stack>
            </CardContent>
          </Card>
        </div>
      )}
    </Grid>
  );
};

const formatSlotTime = (inizio?: string | null, fine?: string | null): string => {
  if (!inizio || !fine) return '';
  try {
    const { formatSlotTime: fmt } = useFormatUtilityHook();
    return fmt(inizio, fine);
  } catch {
    return '';
  }
};

interface IDayCardProps {
  day: IWeekDay;
  isSelected: boolean;
  onSelectSlot?: (slot: SlotDto, day: IWeekDay) => void;
  onBookAppointment?: (slot: SlotDto, day: IWeekDay) => void;
  onCreateAppointment?: (slot: SlotDto, date: Date) => void;
  onEditAppuntamento?: (appuntamento: PrenotazioneDtoRes) => void;
  onChangeStatus?: (appuntamento: PrenotazioneDtoRes) => void;
  onDeleteAppuntamento?: (appuntamento: PrenotazioneDtoRes) => void;
}

const DayCard: React.FC<IDayCardProps> = ({
  day,
  isSelected,
  onSelectSlot,
  onBookAppointment,
  onCreateAppointment,
  onEditAppuntamento,
  onChangeStatus,
  onDeleteAppuntamento,
}) => {
  return (
      <div style={{marginBottom:20}}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: isSelected ? "2px solid" : "1px solid",
        borderColor: isSelected
          ? "primary.main"
          : day.isToday
            ? "success.main"
            : "divider",
        backgroundColor: isSelected
          ? "action.hover"
          : day.isToday
            ? "success.lighter"
            : "background.paper",
        boxShadow: isSelected ? "0 4px 12px rgba(0, 0, 0, 0.15)" : 1,
        "&:hover": {
          boxShadow: 3,
          borderColor: "primary.main",
        },
      }}
      onClick={() => onSelectSlot?.(day.slots[0] || {} as SlotDto, day)}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ textTransform: "capitalize", mb: 0.5 }}>
            {day.dayName}
          </Typography>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {day.dayNumber}
            </Typography>
            {day.isToday && <Chip label="Oggi" color="success" size="small" />}
          </Stack>
        }
        sx={{
          backgroundColor: day.isToday ? "success.main" : "primary.main",
          color: "white",
          "& .MuiCardHeader-title": { color: "white" },
          "& .MuiCardHeader-subheader": { color: "rgba(255,255,255,0.9)" },
        }}
      />
      <CardContent sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
        {day.slots.length > 0 ? (
          <Stack spacing={1}>
            {day.slots.map((slot: SlotDto, slotIndex: number) => (
              <SlotChip
                key={slotIndex}
                slot={slot}
                day={day}
                onSelectSlot={onSelectSlot}
                onBookAppointment={onBookAppointment}
                onCreateAppointment={onCreateAppointment}
                onEditAppuntamento={onEditAppuntamento}
                onChangeStatus={onChangeStatus}
                onDeleteAppuntamento={onDeleteAppuntamento}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Nessuno slot disponibile
          </Typography>
        )}
      </CardContent>
    </Card>
      </div>
  );
};

interface ISlotChipProps {
  slot: SlotDto;
  day: IWeekDay;
  onSelectSlot?: (slot: SlotDto, day: IWeekDay) => void;
  onBookAppointment?: (slot: SlotDto, day: IWeekDay) => void;
  onCreateAppointment?: (slot: SlotDto, date: Date) => void;
  onEditAppuntamento?: (appuntamento: PrenotazioneDtoRes) => void;
  onChangeStatus?: (appuntamento: PrenotazioneDtoRes) => void;
  onDeleteAppuntamento?: (appuntamento: PrenotazioneDtoRes) => void;
}

const SlotChip: React.FC<ISlotChipProps> = ({
  slot,
  day,
  onSelectSlot,
  onBookAppointment,
  onCreateAppointment,
  onEditAppuntamento,
  onChangeStatus,
  onDeleteAppuntamento,
}) => {
  const { formatSlotTime } = useFormatUtilityHook();
  const slotTime = formatSlotTime(slot.inizio, slot.fine);
  const hasAppuntamenti = slot?.appuntamenti && slot.appuntamenti.length > 0;
  const isBooked = slot.prenotati !== undefined && slot.prenotati > 0;

  const semaforoColor = (semaforo?: string) => {
    switch (semaforo) {
      case "VERDE": return "success";
      case "GIALLO": return "warning";
      case "ROSSO": return "error";
      default: return "default";
    }
  };

  const statoLabel = (stato?: string) => {
    switch (stato) {
      case "BOOKED": return "Prenotato";
      case "CONFIRMED": return "Confermato";
      case "CANCELLED_AUTO": return "Ann. Auto";
      case "CANCELLED_USER": return "Ann. Utente";
      case "COMPLETED": return "Completato";
      case "NO_SHOW": return "No Show";
      default: return stato ?? "-";
    }
  };

  const statoColor = (stato?: string): "default" | "primary" | "success" | "error" | "warning" | "info" => {
    switch (stato) {
      case "BOOKED": return "info";
      case "CONFIRMED": return "success";
      case "COMPLETED": return "success";
      case "CANCELLED_AUTO":
      case "CANCELLED_USER": return "warning";
      case "NO_SHOW": return "error";
      default: return "default";
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: 1.5,
        backgroundColor: !isBooked ? "success.lighter" : "background.paper",
        borderColor: !isBooked ? "success.main" : "primary.main",
        borderLeft: "4px solid",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 2,
        },
      }}
      onClick={() => onSelectSlot?.(slot, day)}
    >
      <Stack spacing={0.5}>
        {/* Header slot */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {slotTime}
          </Typography>
          <Chip
            label={`${slot.prenotati ?? 0}/${slot.capacita ?? "-"}`}
            color={!isBooked ? "success" : "primary"}
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* Lista prenotazioni */}
        {hasAppuntamenti && (
          <Box sx={{ mt: 1 }}>
            <Divider sx={{ mb: 0.5 }} />
            <Stack spacing={0.5}>
              {slot.appuntamenti!.map((app: PrenotazioneDtoRes, i: number) => (
                <Box
                  key={i}
                  sx={{
                    p: 0.75,
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PersonIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" sx={{ fontWeight: "bold", flex: 1 }} noWrap>
                      {app.utente?.nome ?? ""} {app.utente?.cognome ?? ""}
                    </Typography>
                    <Tooltip title={app.semaforoUrgenza ?? ""}>
                      <CircleIcon
                        sx={{
                          fontSize: 10,
                          color: app.semaforoUrgenza === "VERDE"
                            ? "success.main"
                            : app.semaforoUrgenza === "GIALLO"
                              ? "warning.main"
                              : app.semaforoUrgenza === "ROSSO"
                                ? "error.main"
                                : "grey.400",
                        }}
                      />
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                    <Chip
                      label={statoLabel(app.statoPrenotazione)}
                      color={statoColor(app.statoPrenotazione)}
                      size="small"
                      sx={{ height: 18, fontSize: "0.65rem" }}
                    />
                    {app.servizio?.descrizione && (
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: "0.65rem" }}>
                        {app.servizio.descrizione}
                      </Typography>
                    )}
                  </Stack>
                  {/* Azioni prenotazione */}
                  <Stack direction="row" spacing={0} justifyContent="flex-end" sx={{ mt: 0.5 }}>
                    {onEditAppuntamento && (
                      <Tooltip title="Modifica">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => { e.stopPropagation(); onEditAppuntamento(app); }}
                          sx={{ p: 0.25 }}
                        >
                          <EditIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onChangeStatus && (
                      <Tooltip title="Cambia stato">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={(e) => { e.stopPropagation(); onChangeStatus(app); }}
                          sx={{ p: 0.25 }}
                        >
                          <SwapHorizIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDeleteAppuntamento && (
                      <Tooltip title="Annulla prenotazione">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => { e.stopPropagation(); onDeleteAppuntamento(app); }}
                          sx={{ p: 0.25 }}
                        >
                          <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Azioni */}
        {onCreateAppointment && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            fullWidth
            sx={{ mt: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              onCreateAppointment(slot, day.date);
            }}
          >
            Crea Appuntamento
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default CalendarWeekView;

