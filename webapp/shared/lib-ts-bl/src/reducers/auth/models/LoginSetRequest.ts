import {SessionStorageType} from "../utils";

export interface LoginSetRequest {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    scope: string;
    cookiePrefix: string;
    storageType?: SessionStorageType;
    loginType: "internal" | "external";
}
