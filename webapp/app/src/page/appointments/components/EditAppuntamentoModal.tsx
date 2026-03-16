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
    Typography,
} from "@mui/material";
import TextInputBase from "../../../components/Base/input/textInput.base.component";
import {PrenotazioneDtoRes, UpdatePrenotazioneDtoReq} from "api-service";
import {LookUpOption} from "../../../shared/model/interfaces";

interface IEditAppuntamentoModalProps {
    open: boolean;
    appuntamento: PrenotazioneDtoRes | null;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    isLoading?: boolean;
    formHook: {
        control: any;
        errors: any;
        register: any;
        formData: UpdatePrenotazioneDtoReq;
    };
    serviziOptions: LookUpOption[];
    semaforoOptions: LookUpOption[];
}

const EditAppuntamentoModal: React.FC<IEditAppuntamentoModalProps> = ({
    open, appuntamento, onClose, onSubmit,
    isLoading = false, formHook, serviziOptions, semaforoOptions,
}) => {
    if (!appuntamento) return null;

    const {control, errors, formData} = formHook;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{zIndex: 1300}}>
            <DialogTitle sx={{fontWeight: "bold", fontSize: "1.25rem"}}>
                Modifica Appuntamento
            </DialogTitle>
            <DialogContent sx={{pt: 2}}>
                {/* Riepilogo appuntamento */}
                <Paper sx={{p: 2, mb: 3, backgroundColor: "info.lighter", border: "1px solid", borderColor: "info.main"}}>
                    <Stack spacing={1}>
                        <Box>
                            <Typography variant="caption" color="textSecondary">Cliente</Typography>
                            <Typography variant="body2" sx={{fontWeight: "bold"}}>
                                {appuntamento.utente?.nome ?? ""} {appuntamento.utente?.cognome ?? ""}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="textSecondary">Stato attuale</Typography>
                            <Typography variant="body2">{appuntamento.statoPrenotazione}</Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* Form */}
                <Box>
                    <Stack spacing={2}>
                        <TextInputBase
                            control={control}
                            errors={errors}
                            name="form.semaforoUrgenza"
                            label="Urgenza"
                            type="autocomplete"
                            value={formData.semaforoUrgenza}
                            options={semaforoOptions}
                            fullWidth
                            size="small"
                        />

                        <TextInputBase
                            control={control}
                            errors={errors}
                            name="form.idServizio"
                            label="Servizio"
                            type="autocomplete"
                            value={formData.idServizio}
                            options={serviziOptions}
                            fullWidth
                            size="small"
                        />
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{p: 2}}>
                <Button onClick={onClose} variant="outlined">Annulla</Button>
                <Button
                    onClick={() => onSubmit()}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{minWidth: "120px"}}
                >
                    {isLoading ? (
                        <><CircularProgress size={20} sx={{mr: 1}}/> Salvataggio...</>
                    ) : (
                        "Salva Modifiche"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAppuntamentoModal;

