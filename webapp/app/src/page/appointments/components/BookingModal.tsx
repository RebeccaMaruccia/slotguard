import React from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Typography,} from "@mui/material";
import useFormCustomHook from "../../../hooks/form/formCustom.hook";
import TextInputBase from "../../../components/Base/input/textInput.base.component";
import {useFormatUtilityHook} from "../../../shared/formatUtility";
import {IWeekDay} from "../hook/useAppointmentCalendar.hook";
import {SlotDto} from "api-service";
import {object, string} from "yup";
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

const bookingSchema = object({
  form: object<IBookingFormData>({
    nomeCliente: string()
      .required("Il nome è obbligatorio")
      .min(3, "Il nome deve contenere almeno 3 caratteri"),
    emailCliente: string()
      .required("L'email è obbligatoria")
      .email("Inserisci un'email valida"),
    telefonoCliente: string()
      .required("Il telefono è obbligatorio")
      .min(10, "Il numero di telefono deve contenere almeno 10 caratteri"),
    servizio: string()
      .required("Il servizio è obbligatorio"),
    note: string().optional(),
  }).required(),
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
    control,
    errors,
    watch,
    trigger,
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

  const { formatSlotTime } = useFormatUtilityHook();
  const formData = watch("form");

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      await onSubmit(formData);
      reset();
      handleClose();
    }
  };

  if (!slot || !day) return null;

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
        <Box>
          <Stack spacing={2}>
            {/* Nome Cliente */}
            <TextInputBase
              control={control}
              errors={errors}
              name="form.nomeCliente"
              label="Nome Cliente"
              placeholder="Inserisci il nome"
              fullWidth
              size="small"
            />

            {/* Email Cliente */}
            <TextInputBase
              control={control}
              errors={errors}
              name="form.emailCliente"
              label="Email"
              type="email"
              placeholder="nome@example.com"
              fullWidth
              size="small"
            />

            {/* Telefono Cliente */}
            <TextInputBase
              control={control}
              errors={errors}
              name="form.telefonoCliente"
              label="Telefono"
              placeholder="+39 3XX XXXXXXX"
              fullWidth
              size="small"
            />

            {/* Servizio */}
            <TextInputBase
              control={control}
              errors={errors}
              name="form.servizio"
              label="Servizio"
              placeholder="Seleziona il servizio"
              fullWidth
              size="small"
            />

            {/* Note */}
            <TextInputBase
              control={control}
              errors={errors}
              name="form.note"
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
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ minWidth: "120px" }}
        >
          Prenota
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;

