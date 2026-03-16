import React from "react";
import {Box} from "@mui/material";
import CalendarWeekView from "./components/CalendarWeekView";
import BookingModal from "./components/BookingModal";
import CreateAppuntamentoModal from "./components/CreateAppuntamentoModal";
import EditAppuntamentoModal from "./components/EditAppuntamentoModal";
import ChangeStatusModal from "./components/ChangeStatusModal";
import useAppointmentsHooks from "./hook/appointments.hook";
import useCreateAppuntamento from "./hook/useCreateAppuntamento.hook";
import useManageAppuntamento from "./hook/useManageAppuntamento.hook";

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
    utentiLoading,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleSubmitCreate,
    formHook,
    utentiOptions,
    onInputSearchUtente,
    formatSlotTime,
    serviziOptions,
  } = useCreateAppuntamento();

  const {
    showEditModal,
    showStatusModal,
    selectedAppuntamento,
    editLoading,
    statusLoading,
    handleOpenEditModal,
    handleCloseEditModal,
    handleSubmitEdit,
    handleOpenStatusModal,
    handleCloseStatusModal,
    handleSubmitStatus,
    handleDeleteAppuntamento,
    serviziOptions: manageServiziOptions,
    statoOptions,
    semaforoOptions,
    editFormHook,
    statusFormHook,
  } = useManageAppuntamento();

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}>
      <CalendarWeekView
        onSelectSlot={handleSelectSlot}
        onBookAppointment={handleBookAppointment}
        onCreateAppointment={handleOpenCreateModal}
        onEditAppuntamento={handleOpenEditModal}
        onChangeStatus={handleOpenStatusModal}
        onDeleteAppuntamento={handleDeleteAppuntamento}
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
        slotTime={formatSlotTime(createSelectedSlot?.inizio, createSelectedSlot?.fine)}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitCreate}
        isLoading={createLoading}
        utentiLoading={utentiLoading}
        error={createError ? "Errore nella creazione dell'appuntamento" : null}
        formHook={formHook}
        utentiOptions={utentiOptions}
        onInputSearchUtente={onInputSearchUtente}
        serviziOptions={serviziOptions}
      />

      <EditAppuntamentoModal
        open={showEditModal}
        appuntamento={selectedAppuntamento}
        onClose={handleCloseEditModal}
        onSubmit={handleSubmitEdit}
        isLoading={editLoading}
        formHook={editFormHook}
        serviziOptions={manageServiziOptions}
        semaforoOptions={semaforoOptions}
      />

      <ChangeStatusModal
        open={showStatusModal}
        appuntamento={selectedAppuntamento}
        onClose={handleCloseStatusModal}
        onSubmit={handleSubmitStatus}
        isLoading={statusLoading}
        formHook={statusFormHook}
        statoOptions={statoOptions}
      />
    </Box>
  );
};

export default AppointmentsPageView;
