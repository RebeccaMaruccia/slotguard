import {slotGuardServiceApiBase, UtenteDto} from "api-service";
import {useEffect, useState} from "react";
import {object, string} from "yup";
import useFormCustomHook from "../../../hooks/form/formCustom.hook";

const useUtentiHook = () => {
    //<editor-fold desc="Dichiarazione Costanti">
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUtente, setSelectedUtente] = useState<UtenteDto | null>(null);
    //</editor-fold>

    //<editor-fold desc="RTK Calls">
    const [ricercaUtenti, {data: utentiList = [], isLoading: utentiLoading}] =
        slotGuardServiceApiBase.useRicercaUtentiMutation();

    const [createUtente, {isLoading: createLoading, error: createError}] =
        slotGuardServiceApiBase.useCreateUtenteMutation();

    const [updateUtente, {isLoading: updateLoading, error: updateError}] =
        slotGuardServiceApiBase.useUpdateUtenteMutation();
    //</editor-fold>

    //<editor-fold desc="Schema di validazione">
    const utenteSchema = object({
        form: object<UtenteDto>({
            codiceFiscale: string()
                .required("required")
                .min(16, "Il codice fiscale deve essere di 16 caratteri")
                .max(16, "Il codice fiscale deve essere di 16 caratteri"),
            nome: string().required("required"),
            cognome: string().required("required"),
            numeroTelefono: string()
                .required("required")
                .min(10, "Il numero deve contenere almeno 10 caratteri"),
            email: string()
                .required("required")
                .email("Inserisci un'email valida"),
        }).required(),
    });
    //</editor-fold>

    //<editor-fold desc="Istanza form manager - Creazione">
    const createInitialValues: UtenteDto = {
        codiceFiscale: "",
        nome: "",
        cognome: "",
        numeroTelefono: "",
        email: "",
    };

    const {
        control: createControl,
        errors: createErrors,
        watch: createWatch,
        trigger: createTrigger,
        reset: createReset,
        setValue: createSetValue,
        register: createRegister,
    } = useFormCustomHook<UtenteDto, "form">({
        defaultValue: {
            "form": createInitialValues,
        } as any,
        schema: utenteSchema as any,
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
    } = useFormCustomHook<UtenteDto, "form">({
        defaultValue: {
            "form": createInitialValues,
        } as any,
        schema: utenteSchema as any,
    });

    const editFormData = editWatch("form");
    //</editor-fold>

    //<editor-fold desc="Caricamento iniziale">
    useEffect(() => {
        ricercaUtenti({utenteDto: {}});
    }, []);
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
            await createUtente({utenteDto: createFormData});
            handleCloseCreateModal();
            ricercaUtenti({utenteDto: {}});
        }
    };
    //</editor-fold>

    //<editor-fold desc="Handlers - Modifica">
    const handleOpenEditModal = (utente: UtenteDto) => {
        setSelectedUtente(utente);
        editSetValue("form.codiceFiscale" as any, utente.codiceFiscale || "");
        editSetValue("form.nome" as any, utente.nome || "");
        editSetValue("form.cognome" as any, utente.cognome || "");
        editSetValue("form.numeroTelefono" as any, utente.numeroTelefono || "");
        editSetValue("form.email" as any, utente.email || "");
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedUtente(null);
        editReset();
    };

    const handleSubmitEdit = async () => {
        if (await editTrigger()) {
            await updateUtente({utenteDto: editFormData});
            handleCloseEditModal();
            ricercaUtenti({utenteDto: {}});
        }
    };
    //</editor-fold>

    //<editor-fold desc="Handlers - Ricerca">
    const handleSearch = async (searchText: string) => {
        if (searchText.length > 0) {
            await ricercaUtenti({utenteDto: {codiceFiscale: searchText}});
        } else {
            await ricercaUtenti({utenteDto: {}});
        }
    };
    //</editor-fold>

    //<editor-fold desc="Return delle proprietà esportate">
    return {
        // State
        showCreateModal,
        showEditModal,
        selectedUtente,

        // Dati
        utentiList,

        // Loading e Errors
        utentiLoading,
        createLoading,
        updateLoading,
        createError,
        updateError,

        // Handlers
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleSubmitCreate,
        handleOpenEditModal,
        handleCloseEditModal,
        handleSubmitEdit,
        handleSearch,

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

export default useUtentiHook;

