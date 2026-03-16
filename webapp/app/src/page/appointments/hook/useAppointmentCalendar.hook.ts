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
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../store/hook";
import {selectSlots, slotsSet, slotsWeekRangeSet} from "../../../store/Slots";

export interface IWeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  slots: SlotDto[];
  isToday: boolean;
}

const useAppointmentCalendar = () => {
  const dispatch = useDispatch();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  //<editor-fold desc="RTK Calls">
  const [getSlots, { isLoading: slotsLoading, error: slotsError }] =
    slotGuardServiceApiBase.useGetSlotsMutation();
  //</editor-fold>

  //<editor-fold desc="Redux selectors">
  const slotsData = useAppSelector(selectSlots);
  //</editor-fold>

  const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  // Estrai gli slot per un giorno specifico
  function getSlotsForDay(date: Date): SlotDto[] {
    if (!slotsData || slotsData.length === 0) return [];

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

  //<editor-fold desc="Caricamento slot e dispatch su Redux">
  const loadWeekSlots = useCallback(() => {
    const inizio = format(weekStart, "yyyy-MM-dd");
    const fine = format(weekEnd, "yyyy-MM-dd");

    dispatch(slotsWeekRangeSet({ weekStart: inizio, weekEnd: fine }));

    getSlots({ inizio, fine }).then((result: any) => {
      if (result?.data) {
        dispatch(slotsSet(result.data));
      }
    });
  }, [weekStart.toISOString(), weekEnd.toISOString()]);

  useEffect(() => {
    loadWeekSlots();
  }, [loadWeekSlots]);
  //</editor-fold>

  //<editor-fold desc="Navigazione settimane">
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
  //</editor-fold>

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

