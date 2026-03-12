import {useCallback, useEffect, useState} from "react";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
  subWeeks,
} from "date-fns";
import {it} from "date-fns/locale";
import {SlotDto, slotGuardServiceApiBase} from "api-service";

export interface IWeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  slots: SlotDto[];
  isToday: boolean;
}

const useAppointmentCalendar = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [getSlots, { isLoading: slotsLoading, data: slotsData, error: slotsError }] =
    slotGuardServiceApiBase.useGetSlotsMutation();

  const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  // Estrai gli slot per un giorno specifico
  function getSlotsForDay(date: Date): SlotDto[] {
    if (!slotsData) return [];

    return slotsData.filter((slot: SlotDto) => {
      const slotDate = parseISO(slot.inizio || "");
      return isSameDay(slotDate, date);
    });
  }

  // Genera i giorni della settimana
  const weekDays: IWeekDay[] = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  }).map((date) => ({
    date,
    dayName: format(date, "EEEE", { locale: it }),
    dayNumber: date.getDate(),
    slots: getSlotsForDay(date),
    isToday: isToday(date),
  }));

  // Carica gli slot per la settimana corrente
  const loadWeekSlots = useCallback(() => {
    const inizio = format(weekStart, "yyyy-MM-dd");
    const fine = format(weekEnd, "yyyy-MM-dd");

    getSlots({
      inizio,
      fine,
    });
  }, [weekStart, weekEnd, getSlots]);

  // Carica al montaggio e quando cambia la settimana
  useEffect(() => {
    loadWeekSlots();
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
    setSelectedDate(null);
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
    setSelectedDate(null);
  }, []);

  const goToToday = useCallback(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setSelectedDate(new Date());
  }, []);

  const weekRangeLabel = `${format(weekStart, "d MMM", {
    locale: it,
  })} - ${format(weekEnd, "d MMM yyyy", { locale: it })}`;

  return {
    weekDays,
    currentWeekStart,
    weekStart,
    weekEnd,
    weekRangeLabel,
    selectedDate,
    setSelectedDate,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    loadWeekSlots,
    slotsLoading,
    slotsData,
    slotsError,
  };
};

export default useAppointmentCalendar;

