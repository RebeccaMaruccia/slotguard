import configurazioniModel from "../../models/configurazioni/configurazioni_model";
import funzionalita from "../../models/configurazioni/funzionalita_model";
import permission from "../../models/configurazioni/permission_models";

export interface ConfigurazioniReducerType {
    funzionalita: funzionalita;
    permission: permission;
}

export interface configurazioniState {
    configurazioni: ConfigurazioniReducerType;
}

export {
    configurazioniModel,
    funzionalita,
    permission
};

