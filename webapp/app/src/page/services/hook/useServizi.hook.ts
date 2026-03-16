import {ServizioDto, slotGuardServiceApiBase} from "api-service";
import {useState} from "react";
import {number, object, string} from "yup";
import useFormCustomHook from "../../../hooks/form/formCustom.hook";

const useServiziHook = () => {
    //<editor-fold desc="Dichiarazione Costanti">
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedServizio, setSelectedServizio] = useState<ServizioDto | null>(null);
    //</editor-fold>

    //<editor-fold desc="RTK Calls">
    const {data: serviziList = [], isLoading: serviziLoading, refetch: refetchServizi} =
        slotGuardServiceApiBase.useGetServiziQuery();

    const [createServizio, {isLoading: createLoading}] =
        slotGuardServiceApiBase.useCreateServizioMutation();

    const [updateServizio, {isLoading: updateLoading}] =
        slotGuardServiceApiBase.useUpdateServizioMutation();

    const [deleteServizio, {isLoading: deleteLoading}] =
        slotGuardServiceApiBase.useDeleteServizioMutation();
    //</editor-fold>

    //<editor-fold desc="Schema di validazione">
    const servizioSchema = object({
        form: object<ServizioDto>({
            id: number().optional(),
            descrizione: string()
                .required("required")
                .min(3, "La descrizione deve contenere almeno 3 caratteri"),
            costoMedio: number()
                .required("required")
                .min(0, "Il costo deve essere positivo"),
        }).required(),
    });
    //</editor-fold>

    //<editor-fold desc="Istanza form manager - Creazione">
    const createInitialValues: ServizioDto = {
        id: undefined,
        descrizione: "",
        costoMedio: undefined,
    };

    const {
        control: createControl,
        errors: createErrors,
        watch: createWatch,
        trigger: createTrigger,
        reset: createReset,
        register: createRegister,
    } = useFormCustomHook<ServizioDto, "form">({
        defaultValue: {
            "form": createInitialValues,
        } as any,
        schema: servizioSchema as any,
    });

    const createFormData = createWatch("form");
    //</editor-fold>

    //<editor-fold desc="Istanza form manager - Modifica">
    const {
        control: editControl,
        errors: editErrors,
        watch: editWatch,
        trigger: editTrigger,
        reset: editReset,
        setValue: editSetValue,
        register: editRegister,
    } = useFormCustomHook<ServizioDto, "form">({
        defaultValue: {
            "form": createInitialValues,
        } as any,
        schema: servizioSchema as any,
    });

    const editFormData = editWatch("form");
    //</editor-fold>

    //<editor-fold desc="Handlers - Creazione">
    const handleOpenCreateModal = () => {
        createReset();
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        createReset();
    };

    const handleSubmitCreate = async () => {
        if (await createTrigger()) {
            await createServizio({servizioDto: createFormData});
            handleCloseCreateModal();
            refetchServizi();
        }
    };
    //</editor-fold>

    //<editor-fold desc="Handlers - Modifica">
    const handleOpenEditModal = (servizio: ServizioDto) => {
        setSelectedServizio(servizio);
        editSetValue("form.id" as any, servizio.id);
        editSetValue("form.descrizione" as any, servizio.descrizione || "");
        editSetValue("form.costoMedio" as any, servizio.costoMedio ?? 0);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedServizio(null);
        editReset();
    };

    const handleSubmitEdit = async () => {
        if (await editTrigger()) {
            await updateServizio({servizioDto: editFormData});
            handleCloseEditModal();
            refetchServizi();
        }
    };
    //</editor-fold>

    //<editor-fold desc="Handlers - Eliminazione">
    const handleDelete = async (servizio: ServizioDto) => {
        if (servizio.id !== undefined) {
            await deleteServizio({id: servizio.id});
            refetchServizi();
        }
    };
    //</editor-fold>

    //<editor-fold desc="Return delle proprietà esportate">
    return {
        // State
        showCreateModal,
        showEditModal,
        selectedServizio,

        // Dati
        serviziList,

        // Loading
        serviziLoading,
        createLoading,
        updateLoading,
        deleteLoading,

        // Handlers
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleSubmitCreate,
        handleOpenEditModal,
        handleCloseEditModal,
        handleSubmitEdit,
        handleDelete,

        // Form Creazione
        createFormHook: {
            control: createControl,
            errors: createErrors,
            register: createRegister,
            formData: createFormData,
        },

        // Form Modifica
        editFormHook: {
            control: editControl,
            errors: editErrors,
            register: editRegister,
            formData: editFormData,
        },
    };
    //</editor-fold>
};

export default useServiziHook;

