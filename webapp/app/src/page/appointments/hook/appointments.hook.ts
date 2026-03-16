import {SlotDto, slotGuardServiceApiBase} from "api-service";
import {useState} from "react";
import {IWeekDay} from "./useAppointmentCalendar.hook";
import {IBookingFormData} from "../components/BookingModal";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../store/hook";
import {selectWeekEnd, selectWeekStart, slotsSet} from "../../../store/Slots";

const useAppointmentsHooks = () => {
  const dispatch = useDispatch();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [selectedDay, setSelectedDay] = useState<IWeekDay | null>(null);
  const weekStart = useAppSelector(selectWeekStart);
  const weekEnd = useAppSelector(selectWeekEnd);

  // RTK Query
  const [getSlots, { isLoading: slotsLoading }] =
    slotGuardServiceApiBase.useGetSlotsMutation();

  const [createPrenotazione, { isLoading: bookingLoading }] =
    slotGuardServiceApiBase.useCreatePrenotazioneMutation();

  // Handlers
  const handleSelectSlot = (slot: SlotDto, day: IWeekDay) => {
    setSelectedSlot(slot);
    setSelectedDay(day);
  };

  const handleBookAppointment = (slot: SlotDto, day: IWeekDay) => {
    setSelectedSlot(slot);
    setSelectedDay(day);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
    setSelectedDay(null);
  };

  // Submit del form
  const handleSubmitBooking = async (formData: IBookingFormData) => {
    if (!selectedSlot) return;

    const prenotazioneData = {
      dataAppuntamento: selectedSlot.inizio,
      statoPrenotazione: "BOOKED" as const,
      semaforoUrgenza: "VERDE" as const,
      cfUtente: formData.emailCliente, // Usa email come identificativo
      matricolaOperatore: undefined,
      idServizio: undefined, // Potrebbe essere estratto da formData.servizio
    };

    await createPrenotazione({
      prenotazioneDtoReq: prenotazioneData,
    });

    handleCloseModal();

    // Refresh degli slot su Redux
    if (weekStart && weekEnd) {
      const result: any = await getSlots({ inizio: weekStart, fine: weekEnd });
      if (result?.data) {
        dispatch(slotsSet(result.data));
      }
    }
  };

  return {
    slotsLoading,
    showBookingModal,
    selectedSlot,
    selectedDay,
    bookingLoading,
    handleSelectSlot,
    handleBookAppointment,
    handleSubmitBooking,
    handleCloseModal,
  };
};

export default useAppointmentsHooks;
