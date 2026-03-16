import {createAction} from "@reduxjs/toolkit";
import {SlotDto} from "api-service";

export const slotsSet = createAction<
    SlotDto[],
    "slots/slotsSet"
>("slots/slotsSet");

export const slotsWeekRangeSet = createAction<
    { weekStart: string; weekEnd: string },
    "slots/slotsWeekRangeSet"
>("slots/slotsWeekRangeSet");

export const slotsClear = createAction<
    void,
    "slots/slotsClear"
>("slots/slotsClear");

