import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    AttachMoney as AttachMoneyIcon,
    BarChart as BarChartIcon,
    CalendarToday as CalendarTodayIcon,
    DateRange as DateRangeIcon,
    EventAvailable as EventAvailableIcon,
    EventBusy as EventBusyIcon,
    MoneyOff as MoneyOffIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";
import {PieChart} from "@mui/x-charts/PieChart";
import {SparkLineChart} from "@mui/x-charts/SparkLineChart";
import {Gauge, gaugeClasses} from "@mui/x-charts/Gauge";
import useStatisticheHook from "./hook/useStatistiche.hook";

const StatisticsPageView: React.FC = (): React.ReactElement => {
    const {
        selectedYear, setSelectedYear,
        selectedMonth, setSelectedMonth,
        loading,
        trendData,
        yearTotals,
        yearPieData,
        yearOptions,
        monthOptions,
        selectedMonthData,
        selectedMonthPieData,
    } = useStatisticheHook();

    const sm = selectedMonthData?.riepilogo;

    return (
        <Container maxWidth="xl" sx={{py: 4}}>
            {/* ═══ HEADER + SELETTORI ═══ */}
            <Stack direction={{xs: "column", md: "row"}} spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 4}}>
                <Box>
                    <Typography variant="h4" sx={{fontWeight: "bold"}}>Statistiche</Typography>
                    <Typography variant="body1" color="text.secondary">Panoramica annuale e dettaglio mensile</Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField select size="small" label="Anno" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} sx={{minWidth: 110}}>
                        {yearOptions.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </TextField>
                    <TextField select size="small" label="Mese" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} sx={{minWidth: 150, textTransform: "capitalize"}}>
                        {monthOptions.map((m) => <MenuItem key={m.value} value={m.value} sx={{textTransform: "capitalize"}}>{m.label}</MenuItem>)}
                    </TextField>
                    {loading && <CircularProgress size={24}/>}
                </Stack>
            </Stack>

            {/* ═══ KPI ANNUALI CON SPARKLINE (stile MUI X) ═══ */}
            <Grid container spacing={2} sx={{mb: 4}}>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <SparkKpiCard title="Appuntamenti" value={yearTotals.totAppuntamenti} sparkData={trendData.appuntamenti} color="#1976d2" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <SparkKpiCard title="No Show" value={yearTotals.totNoShow} sparkData={trendData.noShow} color="#f44336" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <SparkKpiCard title="Cancellazioni" value={yearTotals.totCancellazioni} sparkData={trendData.cancellazioni} color="#ff9800" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <SparkKpiCard title="Fatturato" value={`€${yearTotals.fatturatoPotenziale.toFixed(0)}`} sparkData={trendData.fatturatoPotenziale} color="#4caf50" loading={loading}/>
                </Grid>
            </Grid>

            {/* ═══ LINE CHART - TREND ANNUALE ═══ */}
            <Card sx={{mb: 4}}>
                <CardHeader
                    title={<Stack direction="row" spacing={1} alignItems="center"><TrendingUpIcon color="primary"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Trend Annuale {selectedYear}</Typography></Stack>}
                    sx={{borderBottom: "1px solid", borderColor: "divider"}}
                />
                <CardContent>
                    <ChartLoader loading={loading} empty={trendData.labels.length === 0}>
                        <LineChart
                            xAxis={[{scaleType: "point", data: trendData.labels}]}
                            series={[
                                {data: trendData.appuntamenti, label: "Appuntamenti", color: "#1976d2", area: true, showMark: true},
                                {data: trendData.noShow, label: "No Show", color: "#f44336", area: true, showMark: true},
                                {data: trendData.cancellazioni, label: "Cancellazioni", color: "#ff9800", showMark: true},
                            ]}
                            height={350}
                            sx={{"& .MuiAreaElement-root": {opacity: 0.15}}}
                        />
                    </ChartLoader>
                </CardContent>
            </Card>

            {/* ═══ BAR CHART + PIE CHART ANNUALE ═══ */}
            <Grid container spacing={3} sx={{mb: 4}}>
                <Grid size={{xs: 12, md: 8}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader
                            title={<Stack direction="row" spacing={1} alignItems="center"><BarChartIcon color="primary"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Confronto Mensile</Typography></Stack>}
                            sx={{borderBottom: "1px solid", borderColor: "divider"}}
                        />
                        <CardContent>
                            <ChartLoader loading={loading} empty={trendData.labels.length === 0}>
                                <BarChart
                                    xAxis={[{scaleType: "band", data: trendData.labels}]}
                                    series={[
                                        {data: trendData.appuntamenti, label: "Appuntamenti", color: "#1976d2"},
                                        {data: trendData.noShow, label: "No Show", color: "#f44336"},
                                        {data: trendData.riallocazioni, label: "Riallocazioni", color: "#4caf50"},
                                    ]}
                                    height={320}
                                    borderRadius={6}
                                />
                            </ChartLoader>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, md: 4}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader title={<Typography variant="h6" sx={{fontWeight: "bold"}}>Distribuzione Annuale</Typography>} sx={{borderBottom: "1px solid", borderColor: "divider"}}/>
                        <CardContent>
                            <ChartLoader loading={loading} empty={yearPieData.length === 0}>
                                <PieChart
                                    series={[{data: yearPieData, innerRadius: 50, outerRadius: 90, paddingAngle: 2, cornerRadius: 5, highlightScope: {fade: "global", highlight: "item"}}]}
                                    height={300}
                                    slotProps={{legend: {direction: "row" as const, position: {vertical: "bottom" as const, horizontal: "center" as const}, padding: 0, labelStyle: {fontSize: 12}}}}
                                />
                            </ChartLoader>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ═══ FATTURATO LINE CHART ═══ */}
            <Card sx={{mb: 4}}>
                <CardHeader
                    title={<Stack direction="row" spacing={1} alignItems="center"><AttachMoneyIcon color="success"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Andamento Fatturato</Typography></Stack>}
                    sx={{borderBottom: "1px solid", borderColor: "divider"}}
                />
                <CardContent>
                    <ChartLoader loading={loading} empty={trendData.labels.length === 0}>
                        <LineChart
                            xAxis={[{scaleType: "point", data: trendData.labels}]}
                            series={[
                                {data: trendData.fatturatoPotenziale, label: "Fatturato Potenziale (€)", color: "#4caf50", area: true, showMark: true},
                                {data: trendData.fatturatoPerso, label: "Fatturato Perso (€)", color: "#f44336", area: true, showMark: true},
                            ]}
                            height={300}
                            sx={{"& .MuiAreaElement-root": {opacity: 0.12}}}
                        />
                    </ChartLoader>
                </CardContent>
            </Card>

            {/* ═══ GAUGES ANNUALI ═══ */}
            <Grid container spacing={3} sx={{mb: 4}}>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <GaugeCard title="Tasso No Show Medio" value={yearTotals.avgTassoNoShow} color="#f44336" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <GaugeCard title="Tasso Riallocazione" value={yearTotals.avgTassoRiallocazione} color="#4caf50" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <GaugeCard title="% No Show su Totale" value={yearTotals.totAppuntamenti > 0 ? (yearTotals.totNoShow / yearTotals.totAppuntamenti) * 100 : 0} color="#ff9800" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <GaugeCard title="% Cancellazioni" value={yearTotals.totAppuntamenti > 0 ? (yearTotals.totCancellazioni / yearTotals.totAppuntamenti) * 100 : 0} color="#9c27b0" loading={loading}/>
                </Grid>
            </Grid>

            {/* ═══ TASSI MENSILI BAR CHART ═══ */}
            <Card sx={{mb: 6}}>
                <CardHeader
                    title={<Stack direction="row" spacing={1} alignItems="center"><TrendingUpIcon color="primary"/><Typography variant="h6" sx={{fontWeight: "bold"}}>Tassi Mensili (%)</Typography></Stack>}
                    sx={{borderBottom: "1px solid", borderColor: "divider"}}
                />
                <CardContent>
                    <ChartLoader loading={loading} empty={trendData.labels.length === 0}>
                        <BarChart
                            xAxis={[{scaleType: "band", data: trendData.labels}]}
                            series={[
                                {data: trendData.tassoNoShow, label: "No Show (%)", color: "#f44336"},
                                {data: trendData.tassoRiallocazione, label: "Riallocazione (%)", color: "#4caf50"},
                            ]}
                            height={280}
                            borderRadius={4}
                        />
                    </ChartLoader>
                </CardContent>
            </Card>

            <Divider sx={{mb: 4}}/>

            {/* ═══════════════════════════════════════════════════
                DETTAGLIO MESE SELEZIONATO
               ═══════════════════════════════════════════════════ */}
            <Typography variant="h5" sx={{fontWeight: "bold", mb: 3, textTransform: "capitalize"}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <DateRangeIcon color="primary"/>
                    <span>Dettaglio: {monthOptions.find(m => m.value === selectedMonth)?.label ?? ""} {selectedYear}</span>
                </Stack>
            </Typography>

            {/* KPI Mese con SparkLine (confronto con mesi precedenti) */}
            <Grid container spacing={2} sx={{mb: 4}}>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <MiniKpiCard title="Appuntamenti" value={sm?.totAppuntamenti ?? 0} icon={<CalendarTodayIcon/>} color="#1976d2" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <MiniKpiCard title="No Show" value={sm?.totNoShow ?? 0} icon={<EventBusyIcon/>} color="#f44336" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <MiniKpiCard title="Cancellazioni" value={sm?.totCancellazioni ?? 0} icon={<EventAvailableIcon/>} color="#ff9800" loading={loading}/>
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <MiniKpiCard title="Riallocazioni" value={sm?.totRiallocazioni ?? 0} icon={<EventAvailableIcon/>} color="#4caf50" loading={loading}/>
                </Grid>
            </Grid>

            {/* Dettaglio mese: BarChart + PieChart + KPI */}
            <Grid container spacing={3} sx={{mb: 4}}>
                {/* Bar chart mese */}
                <Grid size={{xs: 12, md: 4}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader title={<Typography variant="h6" sx={{fontWeight: "bold"}}>Riepilogo Mese</Typography>} sx={{borderBottom: "1px solid", borderColor: "divider"}}/>
                        <CardContent>
                            <ChartLoader loading={loading} empty={!sm}>
                                <BarChart
                                    xAxis={[{scaleType: "band", data: ["Appuntam.", "No Show", "Cancell.", "Rialloc."]}]}
                                    series={[{data: [sm?.totAppuntamenti ?? 0, sm?.totNoShow ?? 0, sm?.totCancellazioni ?? 0, sm?.totRiallocazioni ?? 0], color: "#1976d2"}]}
                                    height={260}
                                    borderRadius={6}
                                    colors={["#1976d2", "#f44336", "#ff9800", "#4caf50"]}
                                />
                            </ChartLoader>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pie chart mese */}
                <Grid size={{xs: 12, md: 4}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader title={<Typography variant="h6" sx={{fontWeight: "bold"}}>Distribuzione Mese</Typography>} sx={{borderBottom: "1px solid", borderColor: "divider"}}/>
                        <CardContent>
                            <ChartLoader loading={loading} empty={selectedMonthPieData.length === 0}>
                                <PieChart
                                    series={[{data: selectedMonthPieData, innerRadius: 40, outerRadius: 80, paddingAngle: 2, cornerRadius: 4, highlightScope: {fade: "global", highlight: "item"}}]}
                                    height={260}
                                    slotProps={{legend: {direction: "row" as const, position: {vertical: "bottom" as const, horizontal: "center" as const}, padding: 0, labelStyle: {fontSize: 11}}}}
                                />
                            </ChartLoader>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gauges mese + Fatturato */}
                <Grid size={{xs: 12, md: 4}}>
                    <Stack spacing={2}>
                        <Card>
                            <CardContent sx={{textAlign: "center"}}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1, fontWeight: "bold"}}>Tasso No Show</Typography>
                                <ChartLoader loading={loading} empty={!sm}>
                                    <Box sx={{display: "flex", justifyContent: "center"}}>
                                        <Gauge
                                            value={Math.min(sm?.tassoNoShow ?? 0, 100)}
                                            startAngle={-110} endAngle={110}
                                            width={150} height={100}
                                            sx={{[`& .${gaugeClasses.valueText}`]: {fontSize: 18, fontWeight: "bold"}, [`& .${gaugeClasses.valueArc}`]: {fill: "#f44336"}}}
                                            text={`${(sm?.tassoNoShow ?? 0).toFixed(1)}%`}
                                        />
                                    </Box>
                                </ChartLoader>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <AttachMoneyIcon sx={{fontSize: 18, color: "#4caf50"}}/>
                                            <Typography variant="body2" color="text.secondary">Fatt. Potenziale</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{fontWeight: "bold"}}>€ {(sm?.fatturatoPotenziale ?? 0).toFixed(2)}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <MoneyOffIcon sx={{fontSize: 18, color: "#f44336"}}/>
                                            <Typography variant="body2" color="text.secondary">Fatt. Perso</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{fontWeight: "bold"}}>€ {(sm?.fatturatoPerso ?? 0).toFixed(2)}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <TrendingUpIcon sx={{fontSize: 18, color: "#4caf50"}}/>
                                            <Typography variant="body2" color="text.secondary">Tasso Riallocazione</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{fontWeight: "bold"}}>{(sm?.tassoRiallocazione ?? 0).toFixed(1)}%</Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

/* ══════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════ */

/** Wrapper per loading / empty state nei grafici */
const ChartLoader: React.FC<{ loading: boolean; empty: boolean; children: React.ReactNode }> = ({loading, empty, children}) => {
    if (loading) return <Box sx={{display: "flex", justifyContent: "center", py: 6}}><CircularProgress/></Box>;
    if (empty) return <Box sx={{py: 6, textAlign: "center"}}><Typography color="text.secondary">Nessun dato disponibile</Typography></Box>;
    return <>{children}</>;
};

/** KPI Card con SparkLine (stile MUI X Charts demo) */
interface ISparkKpiCardProps {
    title: string;
    value: number | string;
    sparkData: number[];
    color: string;
    loading?: boolean;
}

const SparkKpiCard: React.FC<ISparkKpiCardProps> = ({title, value, sparkData, color, loading}) => (
    <Card sx={{border: "1px solid", borderColor: "divider"}}>
        <CardContent sx={{py: 2, "&:last-child": {pb: 2}}}>
            <Typography variant="caption" color="text.secondary">{title}</Typography>
            <Stack direction="row" spacing={2} alignItems="flex-end" justifyContent="space-between">
                {loading ? <CircularProgress size={20}/> : <Typography variant="h4" sx={{fontWeight: "bold"}}>{value}</Typography>}
                <Box sx={{width: 100, height: 40}}>
                    {sparkData.length > 0 && (
                        <SparkLineChart
                            data={sparkData}
                            height={40}
                            showTooltip
                            showHighlight
                            colors={[color]}
                            area
                        />
                    )}
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

/** KPI mini card per dettaglio mese */
interface IMiniKpiCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    loading?: boolean;
}

const MiniKpiCard: React.FC<IMiniKpiCardProps> = ({title, value, icon, color, loading}) => (
    <Card sx={{borderLeft: `4px solid ${color}`}}>
        <CardContent sx={{py: 1.5, "&:last-child": {pb: 1.5}}}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography variant="caption" color="text.secondary">{title}</Typography>
                    {loading ? <CircularProgress size={18}/> : <Typography variant="h5" sx={{fontWeight: "bold"}}>{value}</Typography>}
                </Box>
                <Avatar sx={{bgcolor: `${color}20`, color, width: 40, height: 40}}>{icon}</Avatar>
            </Stack>
        </CardContent>
    </Card>
);

/** Gauge card */
interface IGaugeCardProps {
    title: string;
    value: number;
    color: string;
    loading?: boolean;
}

const GaugeCard: React.FC<IGaugeCardProps> = ({title, value, color, loading}) => (
    <Card sx={{height: "100%"}}>
        <CardContent sx={{textAlign: "center"}}>
            <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1, fontWeight: "bold"}}>{title}</Typography>
            {loading ? <CircularProgress size={40}/> : (
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Gauge
                        value={Math.min(value, 100)}
                        startAngle={-110} endAngle={110}
                        width={160} height={120}
                        sx={{
                            [`& .${gaugeClasses.valueText}`]: {fontSize: 20, fontWeight: "bold"},
                            [`& .${gaugeClasses.valueArc}`]: {fill: color},
                        }}
                        text={`${value.toFixed(1)}%`}
                    />
                </Box>
            )}
        </CardContent>
    </Card>
);

export default StatisticsPageView;

