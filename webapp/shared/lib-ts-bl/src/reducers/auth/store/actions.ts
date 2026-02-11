import {createAction} from "@reduxjs/toolkit";
import {CustomCookieDto, ErrorDetailDto, LoginSetRequest, PopupDetailDto} from "../models";
import {LoginReloadRequest} from "../models/LoginReloadRequest";
import {LoginResetRequest} from "../models/LoginResetRequest";

/**
 * Store login tokens in browser session storage
 * @param accessToken The jwt access token
 * @param refreshToken The jwt refresh token
 * @param cookiePrefix The app cookie prefix
 * @param expiresIn The jwt expiration (in seconds)
 * @param scope The user scopes
 * @param storageType The storage type
 */
export const loginSet = createAction<LoginSetRequest, "common/loginSet">("common/loginSet");

/**
 * Check if access token is stored in browser session storage and is still valid
 * @param cookiePrefix The app cookie prefix
 * @param storageType The storage type
 */
export const loginReload = createAction<LoginReloadRequest, "common/loginReload">("common/loginReload");

/**
 * Remove from browser session storage the jwt access and refresh tokens
 * @param cookiePrefix The app cookie prefix
 * @param storageType The storage type
 */
export const loginReset = createAction<LoginResetRequest, "common/loginReset">("common/loginReset");

/**
 * Restore the login type to "internal" 
 */
export const loginTypeReset = createAction<void, "common/loginTypeReset">("common/loginTypeReset");

/**
 * Stores a custom cookie
 * @param cookiePrefix The custom cookie prefix
 * @param code The custom cookie code
 * @param value The custom cookie value
 * @param storageType The storage type
 */
export const customCookieSet = createAction<CustomCookieDto, "common/customCookieSet">("common/customCookieSet");

/**
 * Check if custom cookie is stored in browser local storage and stores it
 * @param cookiePrefix The custom cookie prefix
 * @param code The custom cookie code
 * @param storageType The storage type
 */
export const customCookieReload = createAction<Pick<CustomCookieDto, "cookiePrefix" | "code" | "storageType">, "common/customCookieReload">("common/customCookieReload");

/**
 * Delete custom cookie 
 * @param cookiePrefix The custom cookie prefix
 * @param code The custom cookie code
 * @param storageType The storage type
 */
export const customCookieDel = createAction<Pick<CustomCookieDto, "cookiePrefix" | "code" | "storageType">, "common/customCookieDel">("common/customCookieDel");

/**
 * Stores a new error
 * @param ErrorDetailDto The error details
 */
export const errorSet = createAction<ErrorDetailDto, "common/errorSet">("common/errorSet");

/**
 * Remove all errors
 */
export const errorReset = createAction<void, "common/errorReset">("common/errorReset");

/**
 * Stores a loader
 * @param code The loader unique code
 */
export const loaderSet = createAction<string | undefined, "common/loaderSet">("common/loaderSet");

/**
 * Removes a loader
 * @param code The loader unique code
 */
export const loaderDel = createAction<string | undefined, "common/loaderDel">("common/loaderDel");

/**
 * Stores a popup
 * @param PopupDetailDto The popup details
 */
export const popupSet = createAction<PopupDetailDto, "common/popupSet">("common/popupSet");

/**
 * Removes a popup
 * @param code The popup unique code
 */
export const popupDel = createAction<string, "common/popupDel">("common/popupDel");
