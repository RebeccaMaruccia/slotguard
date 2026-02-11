import {createReducer} from "@reduxjs/toolkit";
import {configurazioniFunzionalitaViewModelSet, configurazioniPermissionViewModelSet} from "./actions";
import {configurazioniModel} from "./types";


const initialState: configurazioniModel = {
    funzionalita: {
        AltriPrestiti: false,
        campiBoxPreventivo: false,
        dashBoardConsensi: false,
        noPensionatoLanding: false,
        categoriaAmministrativa: false,
        nomeCognomeLanding: false,
        remoteCollaboration: false,
        richiesteMultiple: false

    },
    permission: {
        isAgente: false,
        tokenRestAgente: ""

    }

};

export const configurazioniReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(configurazioniFunzionalitaViewModelSet, (state, action) => {
            state.funzionalita = action.payload;
        })
        .addCase(configurazioniPermissionViewModelSet, (state, action) => {
            state.permission = action.payload;
        })
    ;


});
