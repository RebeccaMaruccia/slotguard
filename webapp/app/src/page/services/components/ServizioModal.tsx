import React from "react";
import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack,} from "@mui/material";
import TextInputBase from "../../../components/Base/input/textInput.base.component";
import {ServizioDto} from "api-service";

interface IServizioModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    isLoading?: boolean;
    formHook: {
        control: any;
        errors: any;
        register: any;
        formData: ServizioDto;
    };
}

const ServizioModal: React.FC<IServizioModalProps> = ({
    open, title, onClose, onSubmit,
    isLoading = false, formHook,
}) => {
    const {errors, register} = formHook;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{zIndex: 1300}}>
            <DialogTitle sx={{fontWeight: "bold", fontSize: "1.25rem"}}>
                {title}
            </DialogTitle>
            <DialogContent sx={{pt: 2}}>
                <Box>
                    <Stack spacing={2} sx={{mt: 1}}>
                        <TextInputBase
                            register={register}
                            errors={errors}
                            name="form.descrizione"
                            label="Descrizione"
                            placeholder="Inserisci la descrizione del servizio"
                            fullWidth
                            size="small"
                        />

                        <TextInputBase
                            register={register}
                            errors={errors}
                            name="form.costoMedio"
                            label="Costo Medio (€)"
                            type="number"
                            placeholder="0.00"
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
                        "Salva"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ServizioModal;

