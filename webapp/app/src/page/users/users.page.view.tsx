import React, {useState} from "react";
import {Box, Button, CircularProgress, Container, InputAdornment, Stack, TextField, Typography,} from "@mui/material";
import {Add as AddIcon, Search as SearchIcon} from "@mui/icons-material";
import useUtentiHook from "./hook/useUtenti.hook";
import UtentiTable from "./components/UtentiTable";
import UtenteModal from "./components/UtenteModal";

const UsersPageView: React.FC = (): React.ReactElement => {
    const {
        utentiList,
        utentiLoading,
        showCreateModal,
        showEditModal,
        createLoading,
        updateLoading,
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleSubmitCreate,
        handleOpenEditModal,
        handleCloseEditModal,
        handleSubmitEdit,
        handleSearch,
        createFormHook,
        editFormHook,
    } = useUtentiHook();

    const [searchText, setSearchText] = useState("");

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        handleSearch(value);
    };

    return (
        <Container maxWidth="xl" sx={{py: 4}}>
            {/* Header */}
            <Stack
                direction={{xs: "column", md: "row"}}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{mb: 4}}
            >
                <Typography variant="h5" sx={{fontWeight: "bold"}}>
                    Gestione Utenti
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        placeholder="Cerca per codice fiscale..."
                        size="small"
                        value={searchText}
                        onChange={onSearchChange}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{minWidth: 300}}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon/>}
                        onClick={handleOpenCreateModal}
                    >
                        Nuovo Utente
                    </Button>
                </Stack>
            </Stack>

            {/* Loading */}
            {utentiLoading && (
                <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
                    <CircularProgress/>
                </Box>
            )}

            {/* Tabella */}
            {!utentiLoading && (
                <UtentiTable
                    utentiList={utentiList}
                    isLoading={utentiLoading}
                    onEdit={handleOpenEditModal}
                />
            )}

            {/* Modal Creazione */}
            <UtenteModal
                open={showCreateModal}
                title="Nuovo Utente"
                onClose={handleCloseCreateModal}
                onSubmit={handleSubmitCreate}
                isLoading={createLoading}
                formHook={createFormHook}
            />

            {/* Modal Modifica */}
            <UtenteModal
                open={showEditModal}
                title="Modifica Utente"
                onClose={handleCloseEditModal}
                onSubmit={handleSubmitEdit}
                isLoading={updateLoading}
                disableCf={true}
                formHook={editFormHook}
            />
        </Container>
    );
};

export default UsersPageView;
