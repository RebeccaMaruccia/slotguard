import {createReducer} from "@reduxjs/toolkit";
import {slotsClear, slotsSet, slotsWeekRangeSet} from "./actions";
import {SlotsState} from "./types";

const initialState: SlotsState = {
    slots: [],
    weekStart: "",
    weekEnd: "",
};

export const slotsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(slotsSet, (state, action) => {
            state.slots = action.payload;
        })
        .addCase(slotsWeekRangeSet, (state, action) => {
            state.weekStart = action.payload.weekStart;
            state.weekEnd = action.payload.weekEnd;
        })
        .addCase(slotsClear, (state) => {
            state.slots = [];
            state.weekStart = "";
            state.weekEnd = "";
        });
});

