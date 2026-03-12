import React from "react";
import {Box} from "@mui/material";
import CalendarWeekView from "./components/CalendarWeekView";
import BookingModal from "./components/BookingModal";
import CreateAppuntamentoModal from "./components/CreateAppuntamentoModal";
import useAppointmentsHooks from "./hook/appointments.hook";
import useCreateAppuntamento from "./hook/useCreateAppuntamento.hook";

const AppointmentsPageView: React.FC = (): React.ReactElement => {
  const {
    showBookingModal,
    selectedSlot,
    selectedDay,
    bookingLoading,
    handleSelectSlot,
    handleBookAppointment,
    handleSubmitBooking,
    handleCloseModal,
  } = useAppointmentsHooks();

  const {
    showCreateModal,
    selectedSlot: createSelectedSlot,
    selectedDate: createSelectedDate,
    createLoading,
    createError,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleSubmitCreate,
  } = useCreateAppuntamento();

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}>
      <CalendarWeekView
        onSelectSlot={handleSelectSlot}
        onBookAppointment={handleBookAppointment}
        onCreateAppointment={handleOpenCreateModal}
      />

      <BookingModal
        open={showBookingModal}
        slot={selectedSlot}
        day={selectedDay}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBooking}
        isLoading={bookingLoading}
      />

      <CreateAppuntamentoModal
        open={showCreateModal}
        slot={createSelectedSlot}
        date={createSelectedDate}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitCreate}
        isLoading={createLoading}
        error={createError ? "Errore nella creazione dell'appuntamento" : null}
      />
    </Box>
  );
};

export default AppointmentsPageView;
