import React, {useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Container,
    Fab,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Today as TodayIcon,
} from "@mui/icons-material";
import {useFormatUtilityHook} from "../../../shared/formatUtility";
import useAppointmentCalendar, {IWeekDay} from "../hook/useAppointmentCalendar.hook";
import {SlotDto} from "api-service";

interface ICalendarWeekViewProps {
  onSelectSlot?: (slot: SlotDto, day: IWeekDay) => void;
  onBookAppointment?: (slot: SlotDto, day: IWeekDay) => void;
  onCreateAppointment?: (slot: SlotDto, date: Date) => void;
}

const CalendarWeekView: React.FC<ICalendarWeekViewProps> = ({
  onSelectSlot,
  onBookAppointment,
  onCreateAppointment,
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
      <Grid container spacing={2}>
        {weekDays.map((day: IWeekDay, index: number) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3.5, lg: 1.7 }}>
            <DayCard
              day={day}
              isSelected={
                selectedDate !== null && day.date.toDateString() === selectedDate.toDateString()
              }
              onSelectSlot={onSelectSlot}
              onBookAppointment={onBookAppointment}
              onCreateAppointment={onCreateAppointment}
            />
          </Grid>
        ))}
      </Grid>

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
                              onCreateAppointment(slot, day.date);
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
    </Container>
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
}

const DayCard: React.FC<IDayCardProps> = ({
  day,
  isSelected,
  onSelectSlot,
  onBookAppointment,
  onCreateAppointment,
}) => {
  return (
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
  );
};

interface ISlotChipProps {
  slot: SlotDto;
  day: IWeekDay;
  onSelectSlot?: (slot: SlotDto, day: IWeekDay) => void;
  onBookAppointment?: (slot: SlotDto, day: IWeekDay) => void;
  onCreateAppointment?: (slot: SlotDto, date: Date) => void;
}

const SlotChip: React.FC<ISlotChipProps> = ({
  slot,
  day,
  onSelectSlot,
  onBookAppointment,
  onCreateAppointment,
}) => {
  const { formatSlotTime } = useFormatUtilityHook();
  const slotTime = formatSlotTime(slot.inizio, slot.fine);
  const isBooked = slot.prenotati !== undefined && slot.prenotati > 0;

  return (
    <Card
      variant="outlined"
      sx={{
        p: 1.5,
        backgroundColor: !isBooked ? "success.lighter" : "error.lighter",
        borderColor: !isBooked ? "success.main" : "error.main",
        borderLeft: "4px solid",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 2,
          backgroundColor: !isBooked ? "success.light" : "error.light",
        },
      }}
      onClick={() => onSelectSlot?.(slot, day)}
    >
      <Stack spacing={0.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {slotTime}
          </Typography>
          <Chip
            label={!isBooked ? "Disponibile" : "Prenotato"}
            color={!isBooked ? "success" : "error"}
            size="small"
          />
        </Stack>

        {isBooked && onBookAppointment && (
          <Button
            variant="contained"
            color="success"
            size="small"
            fullWidth
            sx={{ mt: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              onBookAppointment(slot, day);
            }}
          >
            Prenota
          </Button>
        )}

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

