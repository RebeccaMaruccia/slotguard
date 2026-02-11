import {ErrorDto, PopupDto, UserAuthDto} from "../models";
import {SessionStorageType} from "../utils";

export interface CommonReducer {
    cookiePrefix: string,
    sessionStorageType: SessionStorageType,
    auth: UserAuthDto,
    cookies: { [key: string]: string; },
    errors: { [key: string]: ErrorDto; },
    popups: { [key: string]: PopupDto; },
    generalLoaders: number,
    loaders: { [key: string]: number; },
}

export interface CommonState {
    common: CommonReducer,
}
