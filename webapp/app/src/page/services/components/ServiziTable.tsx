import React from "react";
import {
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {Delete as DeleteIcon, Edit as EditIcon} from "@mui/icons-material";
import {ServizioDto} from "api-service";

interface IServiziTableProps {
    serviziList: ServizioDto[];
    isLoading: boolean;
    onEdit: (servizio: ServizioDto) => void;
    onDelete: (servizio: ServizioDto) => void;
}

const ServiziTable: React.FC<IServiziTableProps> = ({serviziList, isLoading, onEdit, onDelete}) => {
    return (
        <TableContainer component={Paper} sx={{borderRadius: 2}}>
            <Table>
                <TableHead>
                    <TableRow sx={{backgroundColor: "primary.main"}}>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>ID</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>Descrizione</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}}>Costo Medio (€)</TableCell>
                        <TableCell sx={{color: "white", fontWeight: "bold"}} align="center">Azioni</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {serviziList.length === 0 && !isLoading ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <Typography variant="body2" color="textSecondary" sx={{py: 4}}>
                                    Nessun servizio trovato
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        serviziList.map((servizio, index) => (
                            <TableRow
                                key={servizio.id || index}
                                sx={{"&:hover": {backgroundColor: "action.hover"}}}
                            >
                                <TableCell>{servizio.id}</TableCell>
                                <TableCell>{servizio.descrizione}</TableCell>
                                <TableCell>
                                    {servizio.costoMedio !== undefined
                                        ? `€ ${servizio.costoMedio.toFixed(2)}`
                                        : "-"}
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => onEdit(servizio)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => onDelete(servizio)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ServiziTable;

