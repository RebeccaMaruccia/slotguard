import React from "react";
import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack,} from "@mui/material";
import TextInputBase from "../../../components/Base/input/textInput.base.component";
import {UtenteDto} from "api-service";

interface IUtenteModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    isLoading?: boolean;
    disableCf?: boolean;
    formHook: {
        control: any;
        errors: any;
        register: any;
        formData: UtenteDto;
    };
}

const UtenteModal: React.FC<IUtenteModalProps> = ({
    open, title, onClose, onSubmit,
    isLoading = false, disableCf = false, formHook,
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
                            name="form.codiceFiscale"
                            label="Codice Fiscale"
                            placeholder="Inserisci il codice fiscale"
                            disabled={disableCf}
                            fullWidth
                            size="small"
                        />

                        <TextInputBase
                            register={register}
                            errors={errors}
                            name="form.nome"
                            label="Nome"
                            placeholder="Inserisci il nome"
                            fullWidth
                            size="small"
                        />

                        <TextInputBase
                            register={register}
                            errors={errors}
                            name="form.cognome"
                            label="Cognome"
                            placeholder="Inserisci il cognome"
                            fullWidth
                            size="small"
                        />

                        <TextInputBase
                            register={register}
                            errors={errors}
                            name="form.numeroTelefono"
                            label="Numero di Telefono"
                            placeholder="+39 3XX XXXXXXX"
                            fullWidth
                            size="small"
                        />

                        <TextInputBase
                            register={register}
                            errors={errors}
                            name="form.email"
                            label="Email"
                            type="email"
                            placeholder="nome@example.com"
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

export default UtenteModal;

