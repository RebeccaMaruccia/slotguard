import {SessionStorageType} from "../utils";

export interface LoginResetRequest {
    cookiePrefix?: string;
    storageType?: SessionStorageType;
}
