import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";
import {ErrorDetailDto, ErrorDto, PopupDetailDto, PopupDto} from "./models";
import {loaderDel, loaderSet} from "./store/actions";
import {CommonState} from "./store/types";

export type SessionStorageType = "SessionStorage" | "ReduxStore";
export const isSessionStorageType = (value: string | undefined): value is SessionStorageType => {
    value ??= "";
    return ["SessionStorage", "ReduxStore"].includes(value);
};

export type LocalStorageType = "LocalStorage" | "Cookie" | "ReduxStore";
export const isLocalStorageType = (value: string | undefined): value is LocalStorageType => {
    value ??= "";
    return ["LocalStorage", "Cookie", "ReduxStore"].includes(value);
};

export const sessionSet = (name: string, value: string, type: SessionStorageType = "SessionStorage"): void => {
    switch (type) {
        case "SessionStorage":
            sessionStorage.setItem(name, value);
            break;
    }
};

export const sessionGet = (name: string, type: SessionStorageType = "SessionStorage"): string => {
    let result: string = "";
    switch (type) {
        case "SessionStorage":
            result = sessionStorage.getItem(name) || "";
            break;
    }
    return result;
};

export const sessionDel = (name: string, type: SessionStorageType = "SessionStorage"): void => {
    switch (type) {
        case "SessionStorage":
            sessionStorage.removeItem(name);
            break;
    }
};

export const storageSet = (name: string, value: string, type: LocalStorageType = "LocalStorage"): void => {
    switch (type) {
        case "LocalStorage":
            localStorage.setItem(name, value);
            break;
        case "Cookie":
            setCookie(name, value);
            break;
    }
};

export const storageGet = (name: string, type: LocalStorageType = "LocalStorage"): string => {
    let result: string = "";
    switch (type) {
        case "LocalStorage":
            result = localStorage.getItem(name) || "";
            break;
        case "Cookie":
            result = getCookie(name) || "";
            break;
    }
    return result;
};

export const storageDel = (name: string, type: LocalStorageType = "LocalStorage"): void => {
    switch (type) {
        case "LocalStorage":
            localStorage.removeItem(name);
            break;
        case "Cookie":
            delCookie(name);
            break;
    }
};

const setCookie = (cookieName: string, cookieValue: string, expDays?: number | undefined) => {
    let date = new Date();
    if (expDays === undefined) {
        date.setFullYear(date.getFullYear() + 100);
    } else {
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    }
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${cookieName}=${cookieValue};${expires}; path=/`;
};

const delCookie = (cookieName: string) => {
    let cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = cookie;
};

const getCookie = (cookieName: string): string => {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

export const showLoaderHandler = (name: string, dispatch: ThunkDispatch<CommonState, unknown, AnyAction>): void => {
    dispatch(loaderSet(name));
};

export const hideLoaderHandler = (name: string, dispatch: ThunkDispatch<CommonState, unknown, AnyAction>): void => {
    dispatch(loaderDel(name));
};

export const createError = (detail: ErrorDetailDto): ErrorDto => {
    let error: ErrorDto = {
        id: getUniqueId(),
        timestamp: (new Date()).getTime(),
        ...detail,
    };
    return error;
};

export const createPopup = (detail: PopupDetailDto): PopupDto => {
    let popup: PopupDto = {
        id: getUniqueId(),
        timestamp: (new Date()).getTime(),
        type: detail.type,
        code: detail.code,
        detail: detail.detail,
        title: detail.title,
        autohideDelay: detail.autohideDelay,
    };
    return popup;
};

export const getUniqueId = (): string => {
    return Date.now().toString();
};

export const Utf8ArrayToStr = (array: Uint8Array): string => {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(
                    ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
                );
                break;
        }
    }
    return out;
};

export const JSONTryParse = (str: string): Object => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {
            error: `JSONTryParse ${e}`,
            error_code: str,
            error_description: str
        };
    }
};

export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
