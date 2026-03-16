import {PrenotazioneDtoRes, ServizioDto, slotGuardServiceApiBase, UpdatePrenotazioneDtoReq} from "api-service";
import {useMemo, useState} from "react";
import {number, object, string} from "yup";
import useFormCustomHook from "../../../hooks/form/formCustom.hook";
import {LookUpOption} from "../../../shared/model/interfaces";
import {useFormatUtilityHook} from "../../../shared/formatUtility";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../store/hook";
import {selectWeekEnd, selectWeekStart, slotsSet} from "../../../store/Slots";

const useManageAppuntamento = () => {
    //<editor-fold desc="Dichiarazione Costanti">
    const dispatch = useDispatch();
    const {formatSlotTime} = useFormatUtilityHook();
    const weekStart = useAppSelector(selectWeekStart);
    const weekEnd = useAppSelector(selectWeekEnd);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedAppuntamento, setSelectedAppuntamento] = useState<PrenotazioneDtoRes | null>(null);
    //</editor-fold>

    //<editor-fold desc="RTK Calls">
    const [modificaPrenotazione, {isLoading: editLoading}] =
        slotGuardServiceApiBase.useModificaPrenotazioneMutation();

    const [updateStatoPrenotazione, {isLoading: statusLoading}] =
        slotGuardServiceApiBase.useUpdateStatoPrenotazioneMutation();

    const [getSlots] = slotGuardServiceApiBase.useGetSlotsMutation();

    const {data: serviziList = []} =
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

    //<editor-fold desc="Opzioni stato">
    const statoOptions: LookUpOption[] = [
        {id: "BOOKED", label: "Prenotato"},
        {id: "CONFIRMED", label: "Confermato"},
        {id: "COMPLETED", label: "Completato"},
        {id: "CANCELLED_USER", label: "Annullato Utente"},
        {id: "CANCELLED_AUTO", label: "Annullato Auto"},
        {id: "NO_SHOW", label: "No Show"},
    ];

    const semaforoOptions: LookUpOption[] = [
        {id: "VERDE", label: "Verde"},
        {id: "GIALLO", label: "Giallo"},
        {id: "ROSSO", label: "Rosso"},
    ];
    //</editor-fold>

    //<editor-fold desc="Schema di validazione - Modifica">
    const editSchema = object({
        form: object<UpdatePrenotazioneDtoReq>({
            prenotazioneId: number().optional(),
            dataAppuntamento: string().optional(),
            statoPrenotazione: string().optional(),
            semaforoUrgenza: string().optional(),
            matricolaOperatore: string().optional(),
            idServizio: number().optional(),
        }).required(),
    });
    //</editor-fold>

    //<editor-fold desc="Schema di validazione - Stato">
    const statusSchema = object({
        form: object({
            statoPrenotazione: string().required("required"),
        }).required(),
    });
    //</editor-fold>

    //<editor-fold desc="Form manager - Modifica">
    const {
        control: editControl,
        errors: editErrors,
        watch: editWatch,
        trigger: editTrigger,
        reset: editReset,
        setValue: editSetValue,
        register: editRegister,
    } = useFormCustomHook<UpdatePrenotazioneDtoReq, "form">({
        defaultValue: {
            "form": {
                prenotazioneId: undefined,
                dataAppuntamento: "",
                statoPrenotazione: undefined,
                semaforoUrgenza: undefined,
                matricolaOperatore: undefined,
                idServizio: undefined,
            },
        } as any,
        schema: editSchema as any,
    });

    const editFormData = editWatch("form");
    //</editor-fold>

    //<editor-fold desc="Form manager - Stato">
    const {
        control: statusControl,
        errors: statusErrors,
        watch: statusWatch,
        trigger: statusTrigger,
        reset: statusReset,
        setValue: statusSetValue,
    } = useFormCustomHook<{ statoPrenotazione: string }, "form">({
        defaultValue: {
            "form": {
                statoPrenotazione: "",
            },
        } as any,
        schema: statusSchema as any,
    });

    const statusFormData = statusWatch("form");
    //</editor-fold>

    //<editor-fold desc="Refresh slot">
    const refreshSlots = async () => {
        if (weekStart && weekEnd) {
            const result: any = await getSlots({inizio: weekStart, fine: weekEnd});
            if (result?.data) {
                dispatch(slotsSet(result.data));
            }
        }
    };
    //</editor-fold>

    //<editor-fold desc="Handlers - Modifica">
    const handleOpenEditModal = (appuntamento: PrenotazioneDtoRes) => {
        setSelectedAppuntamento(appuntamento);
        editSetValue("form.prenotazioneId" as any, appuntamento.id);
        editSetValue("form.semaforoUrgenza" as any, appuntamento.semaforoUrgenza || "VERDE");
        editSetValue("form.idServizio" as any, appuntamento.servizio?.id);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedAppuntamento(null);
        editReset();
    };

    const handleSubmitEdit = async () => {
        if (!selectedAppuntamento?.id) return;

        if (await editTrigger()) {
            const updateData: UpdatePrenotazioneDtoReq = {
                prenotazioneId: selectedAppuntamento?.id,
                semaforoUrgenza: editFormData.semaforoUrgenza as any,
                idServizio: editFormData.idServizio ? Number(editFormData.idServizio) : undefined,
            };

            await modificaPrenotazione({updatePrenotazioneDtoReq: updateData});
            handleCloseEditModal();
            await refreshSlots();
        }
    };
    //</editor-fold>

    //<editor-fold desc="Handlers - Cambio stato">
    const handleOpenStatusModal = (appuntamento: PrenotazioneDtoRes) => {
        setSelectedAppuntamento(appuntamento);
        statusSetValue("form.statoPrenotazione" as any, appuntamento.statoPrenotazione || "");
        setShowStatusModal(true);
    };

    const handleCloseStatusModal = () => {
        setShowStatusModal(false);
        setSelectedAppuntamento(null);
        statusReset();
    };

    const handleSubmitStatus = async () => {
        if (!selectedAppuntamento?.id) return;

        if (await statusTrigger()) {
            await updateStatoPrenotazione({
                idPrenotazione: selectedAppuntamento.id,
                stato: statusFormData.statoPrenotazione as any,
            });
            handleCloseStatusModal();
            await refreshSlots();
        }
    };
    //</editor-fold>

    //<editor-fold desc="Handlers - Eliminazione (cancellazione)">
    const handleDeleteAppuntamento = async (appuntamento: PrenotazioneDtoRes) => {
        if (!appuntamento.id) return;

        await updateStatoPrenotazione({
            idPrenotazione: appuntamento.id,
            stato: "CANCELLED_USER",
        });
        await refreshSlots();
    };
    //</editor-fold>

    //<editor-fold desc="Return delle proprietà esportate">
    return {
        // State
        showEditModal,
        showStatusModal,
        selectedAppuntamento,

        // Loading
        editLoading,
        statusLoading,

        // Handlers
        handleOpenEditModal,
        handleCloseEditModal,
        handleSubmitEdit,
        handleOpenStatusModal,
        handleCloseStatusModal,
        handleSubmitStatus,
        handleDeleteAppuntamento,

        // Options
        serviziOptions,
        statoOptions,
        semaforoOptions,

        // Form modifica
        editFormHook: {
            control: editControl,
            errors: editErrors,
            register: editRegister,
            formData: editFormData,
        },

        // Form stato
        statusFormHook: {
            control: statusControl,
            errors: statusErrors,
            formData: statusFormData,
        },

        formatSlotTime,
    };
    //</editor-fold>
};

export default useManageAppuntamento;

