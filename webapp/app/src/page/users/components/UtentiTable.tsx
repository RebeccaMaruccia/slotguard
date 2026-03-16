import React from "react";
import {
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {Edit as EditIcon} from "@mui/icons-material";
import {UtenteDto} from "api-service";

interface IUtentiTableProps {
    utentiList: UtenteDto[];
    isLoading: boolean;
    onEdit: (utente: UtenteDto) => void;
}

const UtentiTable: React.FC<IUtentiTableProps> = ({utentiList, isLoading, onEdit}) => {
    return (
        <TableContainer component={Paper} sx={{borderRadius: 2}}>
            <Table>
                <TableHead>
                    <TableRow sx={{backgroundColor: "primary.main"}}>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>Codice Fiscale</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>Nome</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>Cognome</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>Telefono</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>Email</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}} align="center">Azioni</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {utentiList.length === 0 && !isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <Typography variant="body2" color="textSecondary" sx={{py: 4}}>
                                    Nessun utente trovato
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        utentiList.map((utente, index) => (
                            <TableRow
                                key={utente.codiceFiscale || index}
                                sx={{"&:hover": {backgroundColor: "action.hover"}}}
                            >
                                <TableCell>
                                    <Chip label={utente.codiceFiscale} size="small" variant="outlined"/>
                                </TableCell>
                                <TableCell>{utente.nome}</TableCell>
                                <TableCell>{utente.cognome}</TableCell>
                                <TableCell>{utente.numeroTelefono}</TableCell>
                                <TableCell>{utente.email}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => onEdit(utente)}
                                    >
                                        <EditIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UtentiTable;

