import {createSelector} from "reselect";
import {SlotsReducerState, SlotsState} from "./types";
import {SlotDto} from "api-service";

const slotsState = (state: SlotsReducerState): SlotsState =>
    state.slotsState;

export const selectSlots = createSelector(
    slotsState,
    (state: SlotsState): SlotDto[] => state.slots
);

export const selectWeekStart = createSelector(
    slotsState,
    (state: SlotsState): string => state.weekStart
);

export const selectWeekEnd = createSelector(
    slotsState,
    (state: SlotsState): string => state.weekEnd
);

