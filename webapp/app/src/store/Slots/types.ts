import {SlotDto} from "api-service";

export interface SlotsState {
    slots: SlotDto[];
    weekStart: string;
    weekEnd: string;
}

export interface SlotsReducerState {
    slotsState: SlotsState;
}

