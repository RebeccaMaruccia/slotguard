import {ConfigurazioniReducerType, configurazioniState, funzionalita, permission} from "./types";
import {createSelector} from "reselect";


const configState = (state: configurazioniState): ConfigurazioniReducerType =>
    state.configurazioni;


export const configFunzionalita = createSelector(
    configState,
    (state: ConfigurazioniReducerType): funzionalita => {
        return state.funzionalita;
    }
);
export const configPermission = createSelector(
    configState,
    (state: ConfigurazioniReducerType): permission => {
        return state.permission;
    }
);

