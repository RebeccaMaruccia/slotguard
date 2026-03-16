import {PrenotazioneDtoRes, SlotDto, slotGuardServiceApiBase} from "api-service";
import {useEffect, useMemo} from "react";
import {endOfMonth, format, startOfMonth} from "date-fns";
import {useAppSelector} from "../../../store/hook";
import {userTokens} from "lib-ts-bl/dist/reducers/auth";

const useDashboardHook = () => {
    //<editor-fold desc="Dichiarazione Costanti">
    const tokens = useAppSelector(userTokens);
    const today = format(new Date(), "yyyy-MM-dd");
    const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");
    //</editor-fold>

    //<editor-fold desc="RTK Calls">
    const [getSlots, {data: slotsData, isLoading: slotsLoading}] =
        slotGuardServiceApiBase.useGetSlotsMutation();

    const {data: operatore, isLoading: operatoreLoading} =
        slotGuardServiceApiBase.useGetOperatoreFromTokenQuery(
            {authorization: `Bearer ${tokens.accessToken}`},
            {skip: !tokens.accessToken}
        );

    const {data: riepilogo, isLoading: riepilogoLoading} =
        slotGuardServiceApiBase.useGetRiepilogoQuery({inizio: today, fine: today});

    const {data: pieChartData, isLoading: pieChartLoading} =
        slotGuardServiceApiBase.useGetPieChartsQuery({inizio: today, fine: today});

    const {data: riepilogoMensile, isLoading: riepilogoMensileLoading} =
        slotGuardServiceApiBase.useGetRiepilogoQuery({inizio: monthStart, fine: monthEnd});

    const {data: pieChartMensile, isLoading: pieChartMensileLoading} =
        slotGuardServiceApiBase.useGetPieChartsQuery({inizio: monthStart, fine: monthEnd});
    //</editor-fold>

    //<editor-fold desc="Caricamento slot di oggi">
    useEffect(() => {
        getSlots({inizio: today, fine: today});
    }, [today]);
    //</editor-fold>

    //<editor-fold desc="Appuntamenti di oggi (flat list)">
    const appuntamentiOggi: (PrenotazioneDtoRes & { slotInizio?: string; slotFine?: string })[] = useMemo(() => {
        if (!slotsData) return [];
        const result: (PrenotazioneDtoRes & { slotInizio?: string; slotFine?: string })[] = [];
        slotsData.forEach((slot: SlotDto) => {
            if (slot.appuntamenti) {
                slot.appuntamenti.forEach((app) => {
                    result.push({...app, slotInizio: slot.inizio, slotFine: slot.fine});
                });
            }
        });
        return result;
    }, [slotsData]);
    //</editor-fold>

    //<editor-fold desc="Dati per il grafico a torta">
    const pieData = useMemo(() => {
        if (!pieChartData) return [];
        return [
            {label: "No Show Effettivi", value: pieChartData.noShowEffettivi ?? 0, color: "#f44336"},
            {label: "No Show Evitati", value: pieChartData.noShowEvitatiStimati ?? 0, color: "#4caf50"},
            {label: "Riallocazioni OK", value: pieChartData.riallocazioniAndateABuonFine ?? 0, color: "#2196f3"},
            {label: "Riallocazioni KO", value: pieChartData.riallocazioniNonAndateABuonFine ?? 0, color: "#ff9800"},
        ].filter(d => d.value > 0);
    }, [pieChartData]);

    const pieTotal = useMemo(() => {
        return pieData.reduce((acc, d) => acc + d.value, 0);
    }, [pieData]);
    //</editor-fold>

    //<editor-fold desc="Dati per il grafico a torta mensile">
    const pieMensileData = useMemo(() => {
        if (!pieChartMensile) return [];
        return [
            {label: "No Show Effettivi", value: pieChartMensile.noShowEffettivi ?? 0, color: "#f44336"},
            {label: "No Show Evitati", value: pieChartMensile.noShowEvitatiStimati ?? 0, color: "#4caf50"},
            {label: "Riallocazioni OK", value: pieChartMensile.riallocazioniAndateABuonFine ?? 0, color: "#2196f3"},
            {label: "Riallocazioni KO", value: pieChartMensile.riallocazioniNonAndateABuonFine ?? 0, color: "#ff9800"},
        ].filter(d => d.value > 0);
    }, [pieChartMensile]);

    const pieMensileTotal = useMemo(() => {
        return pieMensileData.reduce((acc, d) => acc + d.value, 0);
    }, [pieMensileData]);
    //</editor-fold>

    //<editor-fold desc="Return delle proprietà esportate">
    return {
        // Operatore
        operatore,
        operatoreLoading,

        // Slot e appuntamenti di oggi
        slotsData: slotsData ?? [],
        slotsLoading,
        appuntamentiOggi,

        // KPI Riepilogo giornaliero
        riepilogo,
        riepilogoLoading,

        // Pie chart giornaliero
        pieData,
        pieTotal,
        pieChartLoading,

        // KPI Riepilogo mensile
        riepilogoMensile,
        riepilogoMensileLoading,

        // Pie chart mensile
        pieMensileData,
        pieMensileTotal,
        pieChartMensileLoading,

        // Date
        today,
        monthStart,
        monthEnd,
    };
    //</editor-fold>
};

export default useDashboardHook;

