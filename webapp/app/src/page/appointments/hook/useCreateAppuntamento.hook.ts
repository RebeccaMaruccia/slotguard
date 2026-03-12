import {SlotDto, slotGuardServiceApiBase} from "api-service";
import {useState} from "react";

export interface ICreateAppuntamentoFormData {
  nomeCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  servizio: string;
  note?: string;
  dataInizio: string;
  dataFine: string;
}

const useCreateAppuntamento = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // RTK Query
  const [createAppuntamento, { isLoading: createLoading, error: createError }] =
    slotGuardServiceApiBase.useCreatePrenotazioneMutation?.() ?? [
      null,
      { isLoading: false, error: null },
    ];

  const handleOpenCreateModal = (slot: SlotDto, date: Date) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setSelectedSlot(null);
    setSelectedDate(null);
  };

  const handleSubmitCreate = async (formData: ICreateAppuntamentoFormData) => {
    if (!selectedSlot) return;

    try {
      const token = localStorage.getItem("authToken") || "";

      const prenotazioneData = {
        dataAppuntamento: selectedSlot.inizio,
        statoPrenotazione: "BOOKED" as const,
        semaforoUrgenza: "VERDE" as const,
        cfUtente: formData.emailCliente,
        matricolaOperatore: undefined,
        idServizio: undefined,
      };

      if (createAppuntamento) {
        await createAppuntamento({
          authorization: `Bearer ${token}`,
          prenotazioneDtoReq: prenotazioneData,
        });
      }

      handleCloseCreateModal();
    } catch (error) {
      console.error("Errore nella creazione dell'appuntamento:", error);
      throw error;
    }
  };

  return {
    showCreateModal,
    selectedSlot,
    selectedDate,
    createLoading,
    createError,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleSubmitCreate,
  };
};

export default useCreateAppuntamento;

