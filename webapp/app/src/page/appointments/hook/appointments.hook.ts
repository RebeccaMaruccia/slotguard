import {SlotDto, slotGuardServiceApiBase} from "api-service";
import {useState} from "react";
import {addDays} from "date-fns";
import {IWeekDay} from "./useAppointmentCalendar.hook";
import {IBookingFormData} from "../components/BookingModal";
import {useFormatUtilityHook} from "../../../shared/formatUtility";

const useAppointmentsHooks = () => {
  const { formatToLocalDate } = useFormatUtilityHook();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [selectedDay, setSelectedDay] = useState<IWeekDay | null>(null);

  // RTK Query
  const [getSlots, { isLoading: slotsLoading, data: slotsData }] =
    slotGuardServiceApiBase.useGetSlotsMutation();

  const [createPrenotazione, { isLoading: bookingLoading }] =
    slotGuardServiceApiBase.useCreatePrenotazioneMutation?.() ?? [null, { isLoading: false }];

  const handleSelectSlot = (slot: SlotDto, day: IWeekDay) => {
    setSelectedSlot(slot);
    setSelectedDay(day);
  };

  const handleBookAppointment = (slot: SlotDto, day: IWeekDay) => {
    setSelectedSlot(slot);
    setSelectedDay(day);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async (formData: IBookingFormData) => {
    if (!selectedSlot) return;

    try {
      // Ottieni il token dal localStorage (o da Redux se lo stai conservando lì)
      const token = localStorage.getItem("authToken") || "";

      const prenotazioneData = {
        dataAppuntamento: selectedSlot.inizio,
        statoPrenotazione: "BOOKED" as const,
        semaforoUrgenza: "VERDE" as const,
        cfUtente: formData.emailCliente, // Usa email come identificativo
        matricolaOperatore: undefined,
        idServizio: undefined, // Potrebbe essere estratto da formData.servizio
      };

      if (createPrenotazione) {
        await createPrenotazione({
          authorization: `Bearer ${token}`,
          prenotazioneDtoReq: prenotazioneData,
        });
      }

      setShowBookingModal(false);
      setSelectedSlot(null);
      setSelectedDay(null);

      // Refresh slots
      const today = new Date();
      const nextWeek = addDays(today, 7);
      getSlots({
        inizio: formatToLocalDate(today.toISOString()),
        fine: formatToLocalDate(nextWeek.toISOString()),
      });
    } catch (error) {
      console.error("Errore durante la prenotazione:", error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
    setSelectedDay(null);
  };

  return {
    getSlots,
    slotsLoading,
    slotsData,
    showBookingModal,
    selectedSlot,
    selectedDay,
    bookingLoading,
    handleSelectSlot,
    handleBookAppointment,
    handleSubmitBooking,
    handleCloseModal,
    setShowBookingModal,
  };
};

export default useAppointmentsHooks;
