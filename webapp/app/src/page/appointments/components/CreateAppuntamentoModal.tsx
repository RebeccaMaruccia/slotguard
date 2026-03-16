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
    Typography,
} from "@mui/material";
import TextInputBase from "../../../components/Base/input/textInput.base.component";
import {PrenotazioneDtoReq, SlotDto} from "api-service";
import {format} from "date-fns";
import {it} from "date-fns/locale";
import {LookUpOption} from "../../../shared/model/interfaces";

interface ICreateAppuntamentoModalProps {
    open: boolean;
    slot: SlotDto | null;
    date: Date | null;
    slotTime: string;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    isLoading?: boolean;
    utentiLoading?: boolean;
    error?: string | null;
    formHook: {
        control: any;
        errors: any;
        formData: PrenotazioneDtoReq;
    };
    utentiOptions: LookUpOption[];
    onInputSearchUtente: (event: React.SyntheticEvent, value: string, reason: string) => void;
    serviziOptions: LookUpOption[];
}

const CreateAppuntamentoModal: React.FC<ICreateAppuntamentoModalProps> = ({
    open, slot, date, slotTime, onClose, onSubmit,
    isLoading = false, utentiLoading = false, error = null,
    formHook, utentiOptions, onInputSearchUtente, serviziOptions,
}) => {
    if (!slot || !date) return null;

    const {control, errors, formData} = formHook;
    const dayLabel = format(date, "EEEE d MMMM yyyy", {locale: it});

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{zIndex: 1300}}>
            <DialogTitle sx={{fontWeight: "bold", fontSize: "1.25rem"}}>
                Crea Nuovo Appuntamento
            </DialogTitle>
            <DialogContent sx={{pt: 2}}>
                {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                {/* Dettagli dello slot */}
                <Paper sx={{p: 2, mb: 3, backgroundColor: "info.lighter", border: "1px solid", borderColor: "info.main"}}>
                    <Stack spacing={1}>
                        <Box>
                            <Typography variant="caption" color="textSecondary">Data</Typography>
                            <Typography variant="body2" sx={{textTransform: "capitalize"}}>{dayLabel}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="textSecondary">Orario</Typography>
                            <Typography variant="body2">{slotTime}</Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* Form */}
                <Box>
                    <Stack spacing={2}>
                        <TextInputBase
                            control={control}
                            errors={errors}
                            name="form.cfUtente"
                            label="Seleziona Cliente"
                            type="autocomplete"
                            value={formData.cfUtente}
                            options={utentiOptions}
                            loading={utentiLoading}
                            onInputChange={onInputSearchUtente}
                            fullWidth
                            size="small"
                        />

                        <TextInputBase
                            control={control}
                            errors={errors}
                            name="form.idServizio"
                            label="Seleziona Servizio"
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
                        <><CircularProgress size={20} sx={{mr: 1}}/> Creazione...</>
                    ) : (
                        "Crea Appuntamento"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAppuntamentoModal;
