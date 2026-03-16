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
import {PrenotazioneDtoRes} from "api-service";
import {LookUpOption} from "../../../shared/model/interfaces";

interface IChangeStatusModalProps {
    open: boolean;
    appuntamento: PrenotazioneDtoRes | null;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    isLoading?: boolean;
    formHook: {
        control: any;
        errors: any;
        formData: { statoPrenotazione: string };
    };
    statoOptions: LookUpOption[];
}

const ChangeStatusModal: React.FC<IChangeStatusModalProps> = ({
    open, appuntamento, onClose, onSubmit,
    isLoading = false, formHook, statoOptions,
}) => {
    if (!appuntamento) return null;

    const {control, errors, formData} = formHook;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{zIndex: 1300}}>
            <DialogTitle sx={{fontWeight: "bold", fontSize: "1.25rem"}}>
                Cambia Stato Prenotazione
            </DialogTitle>
            <DialogContent sx={{pt: 2}}>
                {/* Riepilogo */}
                <Paper sx={{p: 2, mb: 3, backgroundColor: "warning.lighter", border: "1px solid", borderColor: "warning.main"}}>
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
                            name="form.statoPrenotazione"
                            label="Nuovo Stato"
                            type="autocomplete"
                            value={formData.statoPrenotazione}
                            options={statoOptions}
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
                    color="warning"
                    disabled={isLoading}
                    sx={{minWidth: "120px"}}
                >
                    {isLoading ? (
                        <><CircularProgress size={20} sx={{mr: 1}}/> Aggiornamento...</>
                    ) : (
                        "Aggiorna Stato"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeStatusModal;

