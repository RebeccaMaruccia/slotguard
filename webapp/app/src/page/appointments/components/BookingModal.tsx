import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useFormCustomHook from "../../../hooks/form/formCustom.hook";
import {useFormatUtilityHook} from "../../../shared/formatUtility";
import {IWeekDay} from "../hook/useAppointmentCalendar.hook";
import {SlotDto} from "api-service";
import * as yup from "yup";
import {format} from "date-fns";
import {it} from "date-fns/locale";

interface IBookingModalProps {
  open: boolean;
  slot: SlotDto | null;
  day: IWeekDay | null;
  onClose: () => void;
  onSubmit: (data: IBookingFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface IBookingFormData {
  nomeCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  servizio: string;
  note?: string;
}

const bookingSchema = yup.object().shape({
  nomeCliente: yup
    .string()
    .required("Il nome è obbligatorio")
    .min(3, "Il nome deve contenere almeno 3 caratteri"),
  emailCliente: yup
    .string()
    .required("L'email è obbligatoria")
    .email("Inserisci un'email valida"),
  telefonoCliente: yup
    .string()
    .required("Il telefono è obbligatorio")
    .min(10, "Il numero di telefono deve contenere almeno 10 caratteri"),
  servizio: yup
    .string()
    .required("Il servizio è obbligatorio"),
  note: yup.string().optional(),
});

const BookingModal: React.FC<IBookingModalProps> = ({
  open,
  slot,
  day,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
  } = useFormCustomHook<IBookingFormData, "form">({
    defaultValue: {
      form: {
        nomeCliente: "",
        emailCliente: "",
        telefonoCliente: "",
        servizio: "",
        note: "",
      },
    } as any,
    schema: bookingSchema as any,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data.form);
      reset();
      handleClose();
    } catch (error) {
      console.error("Errore nella prenotazione:", error);
    }
  };

  if (!slot || !day) return null;

  const { formatSlotTime } = useFormatUtilityHook();
  const slotTime = formatSlotTime(slot.inizio, slot.fine);
  const dayLabel = format(day.date, "EEEE d MMMM yyyy", { locale: it });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ zIndex: 1300 }}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
        Nuova Prenotazione
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Dettagli dello slot */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "info.lighter",
            border: "1px solid",
            borderColor: "info.main",
          }}
        >
          <Stack spacing={1}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Data
              </Typography>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {dayLabel}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Orario
              </Typography>
              <Typography variant="body2">{slotTime}</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <Stack spacing={2}>
            {/* Nome Cliente */}
            <TextField
              {...register("form.nomeCliente")}
              label="Nome Cliente"
              placeholder="Inserisci il nome"
              fullWidth
              required
              error={!!errors.form?.nomeCliente}
              helperText={errors.form?.nomeCliente?.message}
              size="small"
            />

            {/* Email Cliente */}
            <TextField
              {...register("form.emailCliente")}
              label="Email"
              type="email"
              placeholder="nome@example.com"
              fullWidth
              required
              error={!!errors.form?.emailCliente}
              helperText={errors.form?.emailCliente?.message}
              size="small"
            />

            {/* Telefono Cliente */}
            <TextField
              {...register("form.telefonoCliente")}
              label="Telefono"
              placeholder="+39 3XX XXXXXXX"
              fullWidth
              required
              error={!!errors.form?.telefonoCliente}
              helperText={errors.form?.telefonoCliente?.message}
              size="small"
            />

            {/* Servizio */}
            <TextField
              {...register("form.servizio")}
              label="Servizio"
              placeholder="Seleziona il servizio"
              fullWidth
              required
              error={!!errors.form?.servizio}
              helperText={errors.form?.servizio?.message}
              size="small"
            />

            {/* Note */}
            <TextField
              {...register("form.note")}
              label="Note"
              placeholder="Eventuali note sulla prenotazione"
              fullWidth
              multiline
              rows={3}
              size="small"
            />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Annulla
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          color="primary"
          disabled={isSubmitting || isLoading}
          sx={{ minWidth: "120px" }}
        >
          {isSubmitting || isLoading ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : (
            "Prenota"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;

