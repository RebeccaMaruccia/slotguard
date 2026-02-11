import {LocalStorageType} from "../utils";

export interface CustomCookieDto {
    cookiePrefix: string,
    code: string,
    value: string;
    storageType?: LocalStorageType;
};
