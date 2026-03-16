import React from "react";
import {Box, Button, CircularProgress, Container, Stack, Typography,} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import useServiziHook from "./hook/useServizi.hook";
import ServiziTable from "./components/ServiziTable";
import ServizioModal from "./components/ServizioModal";

const ServicesPageView: React.FC = (): React.ReactElement => {
    const {
        serviziList,
        serviziLoading,
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
        handleDelete,
        createFormHook,
        editFormHook,
    } = useServiziHook();

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
                    Gestione Servizi
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon/>}
                    onClick={handleOpenCreateModal}
                >
                    Nuovo Servizio
                </Button>
            </Stack>

            {/* Loading */}
            {serviziLoading && (
                <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
                    <CircularProgress/>
                </Box>
            )}

            {/* Tabella */}
            {!serviziLoading && (
                <ServiziTable
                    serviziList={serviziList}
                    isLoading={serviziLoading}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDelete}
                />
            )}

            {/* Modal Creazione */}
            <ServizioModal
                open={showCreateModal}
                title="Nuovo Servizio"
                onClose={handleCloseCreateModal}
                onSubmit={handleSubmitCreate}
                isLoading={createLoading}
                formHook={createFormHook}
            />

            {/* Modal Modifica */}
            <ServizioModal
                open={showEditModal}
                title="Modifica Servizio"
                onClose={handleCloseEditModal}
                onSubmit={handleSubmitEdit}
                isLoading={updateLoading}
                formHook={editFormHook}
            />
        </Container>
    );
};

export default ServicesPageView;

