import {KpiPieChartDto, KpiSnapshotDto, slotGuardServiceApiBase} from "api-service";
import {useEffect, useMemo, useState} from "react";
import {endOfMonth, format, setMonth, startOfMonth} from "date-fns";
import {it} from "date-fns/locale";

export interface MonthData {
    month: number;
    monthLabel: string;
    riepilogo: KpiSnapshotDto | null;
    pieChart: KpiPieChartDto | null;
}

const useStatisticheHook = () => {
    //<editor-fold desc="Dichiarazione Costanti">
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [monthsData, setMonthsData] = useState<MonthData[]>([]);
    const [loading, setLoading] = useState(false);
    //</editor-fold>

    //<editor-fold desc="RTK Calls">
    const [fetchRiepilogo] = slotGuardServiceApiBase.useLazyGetRiepilogoQuery();
    const [fetchPieChart] = slotGuardServiceApiBase.useLazyGetPieChartsQuery();
    //</editor-fold>

    //<editor-fold desc="Mesi disponibili">
    const monthOptions = useMemo(() => {
        const maxMonth = selectedYear === currentYear ? currentMonth : 11;
        const options: { value: number; label: string }[] = [];
        for (let m = 0; m <= maxMonth; m++) {
            const dateRef = setMonth(new Date(selectedYear, 0, 1), m);
            options.push({value: m, label: format(dateRef, "MMMM", {locale: it})});
        }
        return options;
    }, [selectedYear, currentYear, currentMonth]);
    //</editor-fold>

    //<editor-fold desc="Caricamento dati per tutti i mesi dell'anno">
    useEffect(() => {
        const loadAllMonths = async () => {
            setLoading(true);
            const maxMonth = selectedYear === currentYear ? currentMonth : 11;
            const promises: Promise<MonthData>[] = [];

            for (let m = 0; m <= maxMonth; m++) {
                const dateRef = setMonth(new Date(selectedYear, 0, 1), m);
                const inizio = format(startOfMonth(dateRef), "yyyy-MM-dd");
                const fine = format(endOfMonth(dateRef), "yyyy-MM-dd");
                const monthLabel = format(dateRef, "MMMM", {locale: it});

                promises.push(
                    Promise.all([
                        fetchRiepilogo({inizio, fine}),
                        fetchPieChart({inizio, fine}),
                    ]).then(([riepilogoResult, pieResult]) => ({
                        month: m,
                        monthLabel,
                        riepilogo: riepilogoResult.data ?? null,
                        pieChart: pieResult.data ?? null,
                    })).catch(() => ({
                        month: m,
                        monthLabel,
                        riepilogo: null,
                        pieChart: null,
                    }))
                );
            }

            const results = await Promise.all(promises);
            setMonthsData(results.sort((a, b) => a.month - b.month));
            setLoading(false);
        };

        loadAllMonths();
    }, [selectedYear]);

    // Reset mese se fuori range
    useEffect(() => {
        const maxMonth = selectedYear === currentYear ? currentMonth : 11;
        if (selectedMonth > maxMonth) setSelectedMonth(maxMonth);
    }, [selectedYear]);
    //</editor-fold>

    //<editor-fold desc="Dati trend annuali (per i grafici line/bar)">
    const trendData = useMemo(() => ({
        labels: monthsData.map(m => m.monthLabel),
        appuntamenti: monthsData.map(m => m.riepilogo?.totAppuntamenti ?? 0),
        noShow: monthsData.map(m => m.riepilogo?.totNoShow ?? 0),
        cancellazioni: monthsData.map(m => m.riepilogo?.totCancellazioni ?? 0),
        riallocazioni: monthsData.map(m => m.riepilogo?.totRiallocazioni ?? 0),
        fatturatoPotenziale: monthsData.map(m => m.riepilogo?.fatturatoPotenziale ?? 0),
        fatturatoPerso: monthsData.map(m => m.riepilogo?.fatturatoPerso ?? 0),
        tassoNoShow: monthsData.map(m => m.riepilogo?.tassoNoShow ?? 0),
        tassoRiallocazione: monthsData.map(m => m.riepilogo?.tassoRiallocazione ?? 0),
    }), [monthsData]);
    //</editor-fold>

    //<editor-fold desc="Totali e medie annuali">
    const yearTotals = useMemo(() => {
        const len = monthsData.length || 1;
        return {
            totAppuntamenti: monthsData.reduce((a, m) => a + (m.riepilogo?.totAppuntamenti ?? 0), 0),
            totNoShow: monthsData.reduce((a, m) => a + (m.riepilogo?.totNoShow ?? 0), 0),
            totCancellazioni: monthsData.reduce((a, m) => a + (m.riepilogo?.totCancellazioni ?? 0), 0),
            totRiallocazioni: monthsData.reduce((a, m) => a + (m.riepilogo?.totRiallocazioni ?? 0), 0),
            fatturatoPotenziale: monthsData.reduce((a, m) => a + (m.riepilogo?.fatturatoPotenziale ?? 0), 0),
            fatturatoPerso: monthsData.reduce((a, m) => a + (m.riepilogo?.fatturatoPerso ?? 0), 0),
            avgTassoNoShow: monthsData.reduce((a, m) => a + (m.riepilogo?.tassoNoShow ?? 0), 0) / len,
            avgTassoRiallocazione: monthsData.reduce((a, m) => a + (m.riepilogo?.tassoRiallocazione ?? 0), 0) / len,
        };
    }, [monthsData]);
    //</editor-fold>

    //<editor-fold desc="Pie annuale aggregato">
    const yearPieData = useMemo(() => {
        const t = {
            noShowEffettivi: monthsData.reduce((a, m) => a + (m.pieChart?.noShowEffettivi ?? 0), 0),
            noShowEvitati: monthsData.reduce((a, m) => a + (m.pieChart?.noShowEvitatiStimati ?? 0), 0),
            riallocazioniOK: monthsData.reduce((a, m) => a + (m.pieChart?.riallocazioniAndateABuonFine ?? 0), 0),
            riallocazioniKO: monthsData.reduce((a, m) => a + (m.pieChart?.riallocazioniNonAndateABuonFine ?? 0), 0),
        };
        return [
            {id: 0, value: t.noShowEffettivi, label: "No Show Effettivi", color: "#f44336"},
            {id: 1, value: t.noShowEvitati, label: "No Show Evitati", color: "#4caf50"},
            {id: 2, value: t.riallocazioniOK, label: "Riallocazioni OK", color: "#2196f3"},
            {id: 3, value: t.riallocazioniKO, label: "Riallocazioni KO", color: "#ff9800"},
        ].filter(d => d.value > 0);
    }, [monthsData]);
    //</editor-fold>

    //<editor-fold desc="Dati mese selezionato">
    const selectedMonthData = useMemo(() => {
        return monthsData.find(m => m.month === selectedMonth) ?? null;
    }, [monthsData, selectedMonth]);

    const selectedMonthPieData = useMemo(() => {
        const pc = selectedMonthData?.pieChart;
        if (!pc) return [];
        return [
            {id: 0, value: pc.noShowEffettivi ?? 0, label: "No Show Effettivi", color: "#f44336"},
            {id: 1, value: pc.noShowEvitatiStimati ?? 0, label: "No Show Evitati", color: "#4caf50"},
            {id: 2, value: pc.riallocazioniAndateABuonFine ?? 0, label: "Riallocazioni OK", color: "#2196f3"},
            {id: 3, value: pc.riallocazioniNonAndateABuonFine ?? 0, label: "Riallocazioni KO", color: "#ff9800"},
        ].filter(d => d.value > 0);
    }, [selectedMonthData]);
    //</editor-fold>

    //<editor-fold desc="Anno options">
    const yearOptions = useMemo(() => {
        const years: number[] = [];
        for (let y = currentYear; y >= currentYear - 5; y--) years.push(y);
        return years;
    }, [currentYear]);
    //</editor-fold>

    //<editor-fold desc="Return">
    return {
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        monthsData,
        monthOptions,
        loading,
        trendData,
        yearTotals,
        yearPieData,
        yearOptions,
        selectedMonthData,
        selectedMonthPieData,
    };
    //</editor-fold>
};

export default useStatisticheHook;

