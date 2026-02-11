import {createAction} from "@reduxjs/toolkit";
import {funzionalita, permission} from "./types";


/** Aggiorna il ViewModel di simulazione preventivo */
export const configurazioniFunzionalitaViewModelSet = createAction<
    funzionalita,
    "configurazioni/configurazioniFunzionalitaViewModelSet"
>("configurazioni/configurazioniFunzionalitaViewModelSet");
export const configurazioniPermissionViewModelSet = createAction<
    permission,
    "configurazioni/configurazioniPermissionViewModelSet"
>("configurazioni/configurazioniPermissionViewModelSet");



