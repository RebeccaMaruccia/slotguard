import React from "react";
import {
  Alert,
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
import {SlotDto} from "api-service";
import * as yup from "yup";
import {format} from "date-fns";
import {it} from "date-fns/locale";
import {ICreateAppuntamentoFormData} from "../hook/useCreateAppuntamento.hook";

interface ICreateAppuntamentoModalProps {
  open: boolean;
  slot: SlotDto | null;
  date: Date | null;
  onClose: () => void;
  onSubmit: (data: ICreateAppuntamentoFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const createAppuntamentoSchema = yup.object().shape({
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
  dataInizio: yup.string().optional(),
  dataFine: yup.string().optional(),
});

const CreateAppuntamentoModal: React.FC<ICreateAppuntamentoModalProps> = ({
  open,
  slot,
  date,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
  } = useFormCustomHook<ICreateAppuntamentoFormData, "form">({
    defaultValue: {
      form: {
        nomeCliente: "",
        emailCliente: "",
        telefonoCliente: "",
        servizio: "",
        note: "",
        dataInizio: slot?.inizio || "",
        dataFine: slot?.fine || "",
      },
    } as any,
    schema: createAppuntamentoSchema as any,
  });

  const { formatSlotTime } = useFormatUtilityHook();

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
      console.error("Errore nella creazione dell'appuntamento:", error);
    }
  };

  if (!slot || !date) return null;

  const slotTime = formatSlotTime(slot.inizio, slot.fine);
  const dayLabel = format(date, "EEEE d MMMM yyyy", { locale: it });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ zIndex: 1300 }}>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
        Crea Nuovo Appuntamento
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
              placeholder="Eventuali note sull'appuntamento"
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
            "Crea Appuntamento"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAppuntamentoModal;

