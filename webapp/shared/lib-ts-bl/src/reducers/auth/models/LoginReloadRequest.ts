import {SessionStorageType} from "../utils";

export interface LoginReloadRequest {
    cookiePrefix: string;
    storageType?: SessionStorageType;
}
