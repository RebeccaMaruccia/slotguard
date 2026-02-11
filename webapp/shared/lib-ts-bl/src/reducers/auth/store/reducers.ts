import {AnyAction, AsyncThunk, createReducer} from "@reduxjs/toolkit";
import {UserAuthDto} from "../models";
import {
    createError,
    createPopup,
    LocalStorageType,
    sessionDel,
    sessionGet,
    sessionSet,
    SessionStorageType,
    storageDel,
    storageGet,
    storageSet
} from "../utils";
import {
    customCookieDel,
    customCookieReload,
    customCookieSet,
    errorReset,
    errorSet,
    loaderDel,
    loaderSet,
    loginReload,
    loginReset,
    loginSet,
    loginTypeReset,
    popupDel,
    popupSet
} from "./actions";
import {CommonReducer} from "./types";

const initialState: CommonReducer = {
    cookiePrefix: "app-",
    sessionStorageType: "ReduxStore",
    auth: {
        logged: undefined,
        accessToken: "",
        refreshToken: "",
        loggedAt: 0,
        expiresAt: 0,
        scope: [],
        loginType: "internal"
    },
    cookies: {},
    errors: {},
    popups: {},
    generalLoaders: 0,
    loaders: {}
};

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;
const isPendingAction = (action: AnyAction): action is PendingAction => action.type.endsWith('/pending');
const isFulfilledAction = (action: AnyAction): action is FulfilledAction => action.type.endsWith('/fulfilled');
const isRejectedAction = (action: AnyAction): action is RejectedAction => action.type.endsWith('/rejected');

const logout = (state: CommonReducer, cookiePrefix: string = "", storageType: SessionStorageType | undefined = undefined) => {
    if (cookiePrefix === "") {
        cookiePrefix = state.cookiePrefix;
    }
    if (storageType === undefined) {
        storageType = state.sessionStorageType;
    }

    if (storageType !== "ReduxStore") {
        sessionDel(cookiePrefix + "token-access");
        sessionDel(cookiePrefix + "token-refresh");
        sessionDel(cookiePrefix + "token-creation");
        sessionDel(cookiePrefix + "token-expiration");
        sessionDel(cookiePrefix + "token-scope");
        sessionDel(cookiePrefix + "token-login-type");
    }

    state.cookiePrefix = cookiePrefix;
    state.sessionStorageType = storageType;
    state.auth = { ...initialState.auth, logged: false, loginType: state.auth.loginType };
};

export const commonReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loginSet, (state, action) => {
            const cookiePrefix = action.payload.cookiePrefix || state.cookiePrefix;
            const storageType: SessionStorageType = action.payload.storageType || state.sessionStorageType;

            let auth: UserAuthDto = {
                logged: false,
                accessToken: "",
                refreshToken: "",
                loggedAt: 0,
                expiresAt: 0,
                scope: [],
                loginType: "internal",
            };

            if (action.payload && action.payload.accessToken && action.payload.refreshToken) {
                const scope = action.payload.scope;
                const loggedAt = new Date().getTime();
                const expiresAt = new Date(loggedAt + ((action.payload.expiresIn || 3600) * 1000)).getTime();
                auth = {
                    logged: true,
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                    loggedAt: isNaN(loggedAt) ? 0 : loggedAt,
                    expiresAt: isNaN(expiresAt) ? 0 : expiresAt,
                    scope: scope.split(" "),
                    loginType: action.payload.loginType,
                };
            }

            if (storageType !== "ReduxStore") {
                sessionSet(cookiePrefix + "token-access", auth.accessToken);
                sessionSet(cookiePrefix + "token-refresh", auth.refreshToken);
                sessionSet(cookiePrefix + "token-creation", auth.loggedAt.toString());
                sessionSet(cookiePrefix + "token-expiration", auth.expiresAt.toString());
                sessionSet(cookiePrefix + "token-scope", auth.scope.join(" "));
                sessionSet(cookiePrefix + "token-login-type", auth.loginType);
            }

            state.cookiePrefix = cookiePrefix;
            state.sessionStorageType = storageType;
            state.auth = auth;
        })
        .addCase(loginReload, (state, action) => {
            const cookiePrefix = action.payload.cookiePrefix || state.cookiePrefix;
            const storageType: SessionStorageType = action.payload.storageType || state.sessionStorageType;

            if (storageType !== "ReduxStore") {
                let auth: UserAuthDto = {
                    logged: false,
                    accessToken: "",
                    refreshToken: "",
                    loggedAt: 0,
                    expiresAt: 0,
                    scope: [],
                    loginType: "internal",
                };

                const accessToken: string = sessionGet(cookiePrefix + "token-access") || "";
                const refreshToken: string = sessionGet(cookiePrefix + "token-refresh") || "";
                const loggedAt: number = parseInt(sessionGet(cookiePrefix + "token-creation") || "0");
                const expiresAt: number = parseInt(sessionGet(cookiePrefix + "token-expiration") || "0");
                const scope: string = sessionGet(cookiePrefix + "token-scope") || "";
                const loginType: "internal" | "external" = sessionGet(cookiePrefix + "token-login-type") === "external" ? "external" : "internal";

                if (accessToken && refreshToken) {
                    auth = {
                        logged: true,
                        accessToken,
                        refreshToken,
                        loggedAt: isNaN(loggedAt) ? 0 : loggedAt,
                        expiresAt: isNaN(expiresAt) ? 0 : expiresAt,
                        scope: scope.split(" "),
                        loginType,
                    };
                }

                state.auth = auth;
            }

            state.cookiePrefix = cookiePrefix;
            state.sessionStorageType = storageType;
        })
        .addCase(loginReset, (state, action) => {
            const cookiePrefix = action.payload.cookiePrefix || state.cookiePrefix;
            const storageType: SessionStorageType = action.payload.storageType || state.sessionStorageType;

            logout(state, cookiePrefix, storageType);
        })
        .addCase(loginTypeReset, (state) => {
            state.auth.loginType = "internal";
        })
        .addCase(customCookieSet, (state, action) => {
            const cookiePrefix = action.payload.cookiePrefix || state.cookiePrefix;
            const storageType: LocalStorageType = action.payload.storageType || "LocalStorage";

            if (storageType !== "ReduxStore") {
                storageSet(cookiePrefix + "custom-" + action.payload.code, action.payload.value, storageType);
            }

            state.cookies[action.payload.code] = action.payload.value;
        })
        .addCase(customCookieReload, (state, action) => {
            const cookiePrefix = action.payload.cookiePrefix || state.cookiePrefix;
            const storageType: LocalStorageType = action.payload.storageType || "LocalStorage";

            if (storageType !== "ReduxStore") {
                const value = storageGet(cookiePrefix + "custom-" + action.payload.code, storageType) || "";
                state.cookies[action.payload.code] = value;
            }
        })
        .addCase(customCookieDel, (state, action) => {
            const cookiePrefix = action.payload.cookiePrefix || state.cookiePrefix;
            const storageType: LocalStorageType = action.payload.storageType || "LocalStorage";

            if (storageType !== "ReduxStore") {
                storageDel(cookiePrefix + "custom-" + action.payload.code, storageType);
            }

            state.cookies[action.payload.code] = "";
        })
        .addCase(errorSet, (state, action) => {
            if (action.payload.shouldLogout === true) {
                logout(state);
            }
            const error = createError(action.payload);
            state.errors[error.id] = error;
        })
        .addCase(errorReset, (state) => {
            state.errors = initialState.errors;
        })
        .addCase(loaderSet, (state, action) => {
            if (!action.payload) {
                state.generalLoaders = state.generalLoaders + 1;
            } else {
                state.loaders[action.payload] = (state.loaders[action.payload] || 0) + 1;
            }
        })
        .addCase(loaderDel, (state, action) => {
            if (!action.payload) {
                state.generalLoaders = state.generalLoaders - 1;
            } else {
                state.loaders[action.payload] = (state.loaders[action.payload] || 0) - 1;
            }
        })
        .addCase(popupSet, (state, action) => {
            const popup = createPopup(action.payload);
            state.popups[popup.id] = popup;
        })
        .addCase(popupDel, (state, action) => {
            delete state.popups[action.payload];
        })
        .addMatcher(isPendingAction, (state, action) => {
            const loaderName = action.type.replace("/pending", "");
            state.loaders[loaderName] = (state.loaders[loaderName] || 0) + 1;
        })
        .addMatcher(isRejectedAction, (state, action) => {
            // const error = action.payload as ErrorDto;
            // state.error[error.id] = error;
            const loaderName = action.type.replace("/rejected", "");
            state.loaders[loaderName] = (state.loaders[loaderName] || 0) - 1;
        })
        .addMatcher(isFulfilledAction, (state, action) => {
            const loaderName = action.type.replace("/fulfilled", "");
            state.loaders[loaderName] = (state.loaders[loaderName] || 0) - 1;
        });
});
