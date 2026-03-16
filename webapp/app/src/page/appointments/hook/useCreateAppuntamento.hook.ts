import {PrenotazioneDtoReq, ServizioDto, SlotDto, slotGuardServiceApiBase, UtenteDto} from "api-service";
import {useMemo, useState} from "react";
import {number, object, string} from "yup";
import useFormCustomHook from "../../../hooks/form/formCustom.hook";
import {LookUpOption} from "../../../shared/model/interfaces";
import {useFormatUtilityHook} from "../../../shared/formatUtility";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../store/hook";
import {selectWeekEnd, selectWeekStart, slotsSet} from "../../../store/Slots";

const useCreateAppuntamento = () => {
    //<editor-fold desc="Dichiarazione Costanti">
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const {formatSlotTime} = useFormatUtilityHook();
    const weekStart = useAppSelector(selectWeekStart);
    const weekEnd = useAppSelector(selectWeekEnd);
    //</editor-fold>

    //<editor-fold desc="RTK Calls">
    const [createAppuntamento, {isLoading: createLoading, error: createError}] =
        slotGuardServiceApiBase.useCreatePrenotazioneMutation();

    const [ricercaUtenti, {data: utentiList = [], isLoading: utentiLoading}] =
        slotGuardServiceApiBase.useRicercaUtentiMutation();

    const [getSlots] = slotGuardServiceApiBase.useGetSlotsMutation();

    const {data: serviziList = [], isLoading: serviziLoading} =
        slotGuardServiceApiBase.useGetServiziQuery();
    //</editor-fold>

    //<editor-fold desc="Lookup servizi">
    const serviziOptions: LookUpOption[] = useMemo(() => {
        return (serviziList || []).map((servizio: ServizioDto) => ({
            label: `${servizio.descrizione ?? ""}${servizio.costoMedio !== undefined ? ` (€${servizio.costoMedio.toFixed(2)})` : ""}`,
            id: servizio.id ?? 0,
        }));
    }, [serviziList]);
    //</editor-fold>

    //<editor-fold desc="Schema di validazione">
    const createAppuntamentoSchema = object({
        form: object<PrenotazioneDtoReq>({
            cfUtente: string().required("required"),
            dataAppuntamento: string().optional(),
            statoPrenotazione: string().optional(),
            semaforoUrgenza: string().optional(),
            matricolaOperatore: string().optional(),
            idServizio: number().optional(),
        }).required(),
    });
    //</editor-fold>

    //<editor-fold desc="Istanza form manager">
    const initialValues: PrenotazioneDtoReq = {
        cfUtente: "",
        dataAppuntamento: selectedSlot?.inizio || "",
        statoPrenotazione: "BOOKED",
        semaforoUrgenza: "VERDE",
        matricolaOperatore: undefined,
        idServizio: undefined,
    };

    const {
        control,
        errors,
        watch,
        trigger,
        reset,
        setValue,
        register,
    } = useFormCustomHook<PrenotazioneDtoReq, "form">({
        defaultValue: {
            "form": initialValues,
        } as any,
        schema: createAppuntamentoSchema as any,
    });

    const formData = watch("form");
    //</editor-fold>

    //<editor-fold desc="Lookup utenti">
    const utentiOptions: LookUpOption[] = useMemo(() => {
        return (utentiList || []).map((utente: UtenteDto) => ({
            label: `${utente.nome ?? ""} ${utente.cognome ?? ""} (${utente.codiceFiscale})`,
            id: utente.codiceFiscale || "",
        }));
    }, [utentiList]);

    const onInputSearchUtente = async (event: React.SyntheticEvent, value: string, reason: string) => {
        if (reason === "input" && value.length > 2) {
            await ricercaUtenti({utenteDto: {codiceFiscale: value}});
        }
    };
    //</editor-fold>

    //<editor-fold desc="Handlers">
    const handleOpenCreateModal = (slot: SlotDto, date: Date) => {
        setSelectedSlot(slot);
        setSelectedDate(date);
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setSelectedSlot(null);
        setSelectedDate(null);
        reset();
    };
    //</editor-fold>

    //<editor-fold desc="Submit del form">
    const handleSubmitCreate = async () => {
        if (!selectedSlot) return;

        if (await trigger()) {
            const prenotazioneData: PrenotazioneDtoReq = {
                ...formData,
                dataAppuntamento: selectedSlot.inizio,
                statoPrenotazione: "BOOKED",
                semaforoUrgenza: "VERDE",
            };

            await createAppuntamento({
                prenotazioneDtoReq: prenotazioneData,
            });

            // Refresh degli slot su Redux
            if (weekStart && weekEnd) {
                const result: any = await getSlots({inizio: weekStart, fine: weekEnd});
                if (result?.data) {
                    dispatch(slotsSet(result.data));
                }
            }

            handleCloseCreateModal();
        }
    };
    //</editor-fold>

    //<editor-fold desc="Return delle proprietà esportate">
    return {
        showCreateModal,
        selectedSlot,
        selectedDate,
        createLoading,
        createError,
        utentiLoading,
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleSubmitCreate,
        formHook: {
            control,
            errors,
            watch,
            trigger,
            reset,
            setValue,
            register,
            formData,
        },
        utentiOptions,
        onInputSearchUtente,
        formatSlotTime,
        serviziOptions,
        serviziLoading,
    };
    //</editor-fold>
};

export default useCreateAppuntamento;

