import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Container,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    AttachMoney as AttachMoneyIcon,
    CalendarToday as CalendarTodayIcon,
    Circle as CircleIcon,
    DateRange as DateRangeIcon,
    EventAvailable as EventAvailableIcon,
    EventBusy as EventBusyIcon,
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {PieChart} from "@mui/x-charts/PieChart";
import {BarChart} from "@mui/x-charts/BarChart";
import {SparkLineChart} from "@mui/x-charts/SparkLineChart";
import {format} from "date-fns";
import {it} from "date-fns/locale";
import {useFormatUtilityHook} from "../../shared/formatUtility";
import useDashboardHook from "./hooks/dashboard.hooks";

const DashboardPageView: React.FC = (): React.ReactElement => {
    const {
        operatore,
        operatoreLoading,
        slotsLoading,
        appuntamentiOggi,
        riepilogo,
        riepilogoLoading,
        pieData,
        pieTotal,
        pieChartLoading,
        riepilogoMensile,
        riepilogoMensileLoading,
        pieMensileData,
        pieMensileTotal,
        pieChartMensileLoading,
    } = useDashboardHook();

    const {formatSlotTime} = useFormatUtilityHook();
    const todayLabel = format(new Date(), "EEEE d MMMM yyyy", {locale: it});
    const monthLabel = format(new Date(), "MMMM yyyy", {locale: it});
    const isLoading = slotsLoading || riepilogoLoading || pieChartLoading || operatoreLoading;

    return (
        <Container maxWidth="xl" sx={{py: 4}}>
            {/* ── HEADER ── */}
            <Stack direction={{xs: "column", md: "row"}} spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 4}}>
                <Box>
                    <Typography variant="h4" sx={{fontWeight: "bold"}}>Dashboard</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{textTransform: "capitalize"}}>
                        {todayLabel}
                    </Typography>
                </Box>
                {isLoading && <CircularProgress size={28}/>}
            </Stack>

            {/* ── CARD OPERATORE ── */}
            <Card sx={{mb: 4, border: "1px solid", borderColor: "primary.main"}}>
                <CardContent>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Avatar sx={{bgcolor: "primary.main", width: 56, height: 56}}>
                            <PersonIcon fontSize="large"/>
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{fontWeight: "bold"}}>
                                {operatoreLoading ? "Caricamento..." : `${operatore?.nome ?? ""} ${operatore?.cognome ?? ""}`}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    Matricola: {operatore?.matricola ?? "-"}
                                </Typography>
                                {operatore?.ruolo && (
                                    <Chip label={operatore.ruolo} size="small" color="primary" variant="outlined"/>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* ── KPI GIORNALIERI ── */}
            <Grid container spacing={2} sx={{mb: 4}}>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <KpiCard title="Appuntamenti Oggi" value={riepilogo?.totAppuntamenti ?? appuntamentiOggi.length} icon={<CalendarTodayIcon/>} color="primary" loading={riepilogoLoading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <KpiCard title="No Show" value={riepilogo?.totNoShow ?? 0} icon={<EventBusyIcon/>} color="error" loading={riepilogoLoading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <KpiCard title="Cancellazioni" value={riepilogo?.totCancellazioni ?? 0} icon={<EventAvailableIcon/>} color="warning" loading={riepilogoLoading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <KpiCard title="Fatturato Potenziale" value={`€ ${(riepilogo?.fatturatoPotenziale ?? 0).toFixed(2)}`} icon={<AttachMoneyIcon/>} color="success" loading={riepilogoLoading}/>
                </Grid>
            </Grid>

            {/* ── TABELLA OGGI + PIE CHART OGGI ── */}
            <Grid container spacing={3} sx={{mb: 4}}>
                {/* Tabella appuntamenti di oggi */}
                <Grid size={{xs: 12, md: 8}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader
                            title={<Stack direction="row" spacing={1} alignItems="center"><CalendarTodayIcon color="primary"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Appuntamenti di Oggi ({appuntamentiOggi.length})</Typography></Stack>}
                            sx={{borderBottom: "1px solid", borderColor: "divider"}}
                        />
                        <CardContent sx={{p: 0}}>
                            {slotsLoading ? (
                                <Box sx={{display: "flex", justifyContent: "center", py: 4}}><CircularProgress/></Box>
                            ) : appuntamentiOggi.length === 0 ? (
                                <Box sx={{py: 6, textAlign: "center"}}><Typography variant="body1" color="text.secondary">Nessun appuntamento per oggi</Typography></Box>
                            ) : (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{backgroundColor: "action.hover"}}>
                                                <TableCell sx={{fontWeight: "bold"}}>Orario</TableCell>
                                                <TableCell sx={{fontWeight: "bold"}}>Cliente</TableCell>
                                                <TableCell sx={{fontWeight: "bold"}}>Servizio</TableCell>
                                                <TableCell sx={{fontWeight: "bold"}}>Stato</TableCell>
                                                <TableCell sx={{fontWeight: "bold"}} align="center">Urgenza</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {appuntamentiOggi.map((app, index) => (
                                                <TableRow key={index} sx={{"&:hover": {backgroundColor: "action.hover"}}}>
                                                    <TableCell><Typography variant="body2" sx={{fontWeight: "bold"}}>{formatSlotTime(app.slotInizio, app.slotFine)}</Typography></TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <PersonIcon sx={{fontSize: 16, color: "text.secondary"}}/>
                                                            <Typography variant="body2">{app.utente?.nome ?? ""} {app.utente?.cognome ?? ""}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell><Typography variant="body2" color="text.secondary">{app.servizio?.descrizione ?? "-"}</Typography></TableCell>
                                                    <TableCell><Chip label={statoLabel(app.statoPrenotazione)} color={statoColor(app.statoPrenotazione)} size="small"/></TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title={app.semaforoUrgenza ?? ""}>
                                                            <CircleIcon sx={{fontSize: 14, color: app.semaforoUrgenza === "VERDE" ? "success.main" : app.semaforoUrgenza === "GIALLO" ? "warning.main" : app.semaforoUrgenza === "ROSSO" ? "error.main" : "grey.400"}}/>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pie Chart Oggi - MUI X */}
                <Grid size={{xs: 12, md: 4}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader
                            title={<Stack direction="row" spacing={1} alignItems="center"><TrendingUpIcon color="primary"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Riepilogo Oggi</Typography></Stack>}
                            sx={{borderBottom: "1px solid", borderColor: "divider"}}
                        />
                        <CardContent>
                            {pieChartLoading ? (
                                <Box sx={{display: "flex", justifyContent: "center", py: 4}}><CircularProgress/></Box>
                            ) : pieTotal === 0 ? (
                                <Box sx={{py: 6, textAlign: "center"}}><Typography variant="body1" color="text.secondary">Nessun dato disponibile</Typography></Box>
                            ) : (
                                <Box>
                                    <PieChart
                                        series={[{
                                            data: pieData.map((d, i) => ({id: i, value: d.value, label: d.label, color: d.color})),
                                            innerRadius: 50,
                                            outerRadius: 90,
                                            paddingAngle: 2,
                                            cornerRadius: 4,
                                            highlightScope: {fade: "global", highlight: "item"},
                                        }]}
                                        width={350}
                                        height={250}
                                        slotProps={{legend: {direction: "row" as const, position: {vertical: "bottom" as const, horizontal: "center" as const}, padding: 0, labelStyle: {fontSize: 11}}}}
                                    />
                                    {riepilogo && (
                                        <Box sx={{mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider"}}>
                                            <Stack spacing={1}>
                                                <KpiRow label="Tasso No Show" value={`${(riepilogo.tassoNoShow ?? 0).toFixed(1)}%`}/>
                                                <KpiRow label="Tasso Riallocazione" value={`${(riepilogo.tassoRiallocazione ?? 0).toFixed(1)}%`}/>
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ═══════════ RIEPILOGO MENSILE ═══════════ */}
            <Typography variant="h5" sx={{fontWeight: "bold", mt: 3, mb: 3, textTransform: "capitalize"}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <DateRangeIcon color="primary"/>
                    <span>Riepilogo Mensile — {monthLabel}</span>
                </Stack>
            </Typography>

            {/* KPI Mensili */}
            <Grid container spacing={2} sx={{mb: 4}}>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <KpiCard title="Appuntamenti Mese" value={riepilogoMensile?.totAppuntamenti ?? 0} icon={<CalendarTodayIcon/>} color="primary" loading={riepilogoMensileLoading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <KpiCard title="No Show Mese" value={riepilogoMensile?.totNoShow ?? 0} icon={<EventBusyIcon/>} color="error" loading={riepilogoMensileLoading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <KpiCard title="Cancellazioni Mese" value={riepilogoMensile?.totCancellazioni ?? 0} icon={<EventAvailableIcon/>} color="warning" loading={riepilogoMensileLoading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <KpiCard title="Fatturato Mese" value={`€ ${(riepilogoMensile?.fatturatoPotenziale ?? 0).toFixed(2)}`} icon={<AttachMoneyIcon/>} color="success" loading={riepilogoMensileLoading}/>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Pie Chart Mensile - MUI X */}
                <Grid size={{xs: 12, md: 4}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader
                            title={<Stack direction="row" spacing={1} alignItems="center"><TrendingUpIcon color="primary"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Distribuzione Mensile</Typography></Stack>}
                            sx={{borderBottom: "1px solid", borderColor: "divider"}}
                        />
                        <CardContent>
                            {pieChartMensileLoading ? (
                                <Box sx={{display: "flex", justifyContent: "center", py: 4}}><CircularProgress/></Box>
                            ) : pieMensileTotal === 0 ? (
                                <Box sx={{py: 6, textAlign: "center"}}><Typography variant="body1" color="text.secondary">Nessun dato disponibile</Typography></Box>
                            ) : (
                                <PieChart
                                    series={[{
                                        data: pieMensileData.map((d, i) => ({id: i, value: d.value, label: d.label, color: d.color})),
                                        innerRadius: 50,
                                        outerRadius: 90,
                                        paddingAngle: 2,
                                        cornerRadius: 4,
                                        highlightScope: {fade: "global", highlight: "item"},
                                    }]}
                                    width={350}
                                    height={280}
                                    slotProps={{legend: {direction: "row" as const, position: {vertical: "bottom" as const, horizontal: "center" as const}, padding: 0, labelStyle: {fontSize: 11}}}}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Bar Chart Mensile + Dettaglio KPI - MUI X */}
                <Grid size={{xs: 12, md: 8}}>
                    <Stack spacing={3}>
                        {/* Bar chart confronto */}
                        <Card>
                            <CardHeader
                                title={<Stack direction="row" spacing={1} alignItems="center"><DateRangeIcon color="primary"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Confronto Mensile</Typography></Stack>}
                                sx={{borderBottom: "1px solid", borderColor: "divider"}}
                            />
                            <CardContent>
                                {riepilogoMensileLoading ? (
                                    <Box sx={{display: "flex", justifyContent: "center", py: 4}}><CircularProgress/></Box>
                                ) : !riepilogoMensile ? (
                                    <Box sx={{py: 6, textAlign: "center"}}><Typography variant="body1" color="text.secondary">Nessun dato disponibile</Typography></Box>
                                ) : (
                                    <BarChart
                                        xAxis={[{
                                            scaleType: "band",
                                            data: ["Appuntamenti", "No Show", "Cancellazioni", "Riallocazioni"],
                                        }]}
                                        series={[{
                                            data: [
                                                riepilogoMensile.totAppuntamenti ?? 0,
                                                riepilogoMensile.totNoShow ?? 0,
                                                riepilogoMensile.totCancellazioni ?? 0,
                                                riepilogoMensile.totRiallocazioni ?? 0,
                                            ],
                                            label: "Mese corrente",
                                            color: "#1976d2",
                                        }]}
                                        width={undefined}
                                        height={280}
                                        borderRadius={6}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        {/* Dettaglio tassi */}
                        <Card>
                            <CardHeader
                                title={<Stack direction="row" spacing={1} alignItems="center"><TrendingUpIcon color="primary"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Dettaglio Mensile</Typography></Stack>}
                                sx={{borderBottom: "1px solid", borderColor: "divider"}}
                            />
                            <CardContent>
                                {riepilogoMensileLoading ? (
                                    <Box sx={{display: "flex", justifyContent: "center", py: 4}}><CircularProgress/></Box>
                                ) : !riepilogoMensile ? (
                                    <Box sx={{py: 6, textAlign: "center"}}><Typography variant="body1" color="text.secondary">Nessun dato disponibile</Typography></Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <Stack spacing={2}>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{fontWeight: "bold"}}>Performance</Typography>
                                                <KpiRow label="Tasso No Show" value={`${(riepilogoMensile.tassoNoShow ?? 0).toFixed(1)}%`}/>
                                                <KpiRow label="Tasso Riallocazione" value={`${(riepilogoMensile.tassoRiallocazione ?? 0).toFixed(1)}%`}/>
                                                <KpiRow label="Riallocazioni" value={`${riepilogoMensile.totRiallocazioni ?? 0}`}/>
                                            </Stack>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <Stack spacing={2}>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{fontWeight: "bold"}}>Economico</Typography>
                                                <KpiRow label="Fatturato Potenziale" value={`€ ${(riepilogoMensile.fatturatoPotenziale ?? 0).toFixed(2)}`}/>
                                                <KpiRow label="Fatturato Perso" value={`€ ${(riepilogoMensile.fatturatoPerso ?? 0).toFixed(2)}`}/>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

/* ──────────────────────────── Sub-components ──────────────────────────── */

const statoLabel = (stato?: string) => {
    switch (stato) {
        case "BOOKED": return "Prenotato";
        case "CONFIRMED": return "Confermato";
        case "CANCELLED_AUTO": return "Ann. Auto";
        case "CANCELLED_USER": return "Ann. Utente";
        case "COMPLETED": return "Completato";
        case "NO_SHOW": return "No Show";
        default: return stato ?? "-";
    }
};

const statoColor = (stato?: string): "default" | "primary" | "success" | "error" | "warning" | "info" => {
    switch (stato) {
        case "BOOKED": return "info";
        case "CONFIRMED": return "success";
        case "COMPLETED": return "success";
        case "CANCELLED_AUTO":
        case "CANCELLED_USER": return "warning";
        case "NO_SHOW": return "error";
        default: return "default";
    }
};

interface IKpiCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: "primary" | "success" | "error" | "warning" | "info";
    loading?: boolean;
    sparkData?: number[];
    sparkColor?: string;
}

const KpiCard: React.FC<IKpiCardProps> = ({title, value, icon, color, loading, sparkData, sparkColor}) => (
    <Card sx={{border: "1px solid", borderColor: `${color}.main`}}>
        <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box sx={{flex: 1}}>
                    <Typography variant="caption" color="text.secondary">{title}</Typography>
                    {loading ? (
                        <CircularProgress size={20}/>
                    ) : (
                        <Typography variant="h5" sx={{fontWeight: "bold"}}>{value}</Typography>
                    )}
                </Box>
                {sparkData && sparkData.length > 1 ? (
                    <Box sx={{width: 80, height: 40}}>
                        <SparkLineChart
                            data={sparkData}
                            height={40}
                            colors={[sparkColor || "#1976d2"]}
                            area
                            showTooltip
                            showHighlight
                        />
                    </Box>
                ) : (
                    <Avatar sx={{bgcolor: `${color}.lighter`, color: `${color}.main`, width: 48, height: 48}}>
                        {icon}
                    </Avatar>
                )}
            </Stack>
        </CardContent>
    </Card>
);

const KpiRow: React.FC<{ label: string; value: string }> = ({label, value}) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" sx={{fontWeight: "bold"}}>{value}</Typography>
    </Stack>
);

export default DashboardPageView;

