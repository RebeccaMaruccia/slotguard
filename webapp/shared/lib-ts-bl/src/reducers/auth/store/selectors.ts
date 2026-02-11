import {createSelector} from "reselect";
import {ErrorDto, PopupDto} from "../models";
import {CommonReducer, CommonState} from "./types";

const commonState = (state: CommonState): CommonReducer => state.common;

/**
 * Returns a check if the user is logged on or not
 */
export const userLogged = createSelector(
    commonState,
    (state: CommonReducer): boolean | undefined => {
        return state.auth.logged;
    }
);

/**
 * Returns the type of login (current or last)
 */
export const userLoginType = createSelector(
    commonState,
    (state: CommonReducer): "internal" | "external" => {
        return state.auth.loginType;
    }
);

/**
 * Returns user auth exiration (in ms)
 */
export const userExpiration = createSelector(
    commonState,
    (state: CommonReducer): number => {
        return state.auth.expiresAt;
    }
);

/**
 * Returns user auth tokens
 */
export const userTokens = createSelector(
    commonState,
    (state: CommonReducer): {
        accessToken: string;
        refreshToken: string;
    } => {
        return {
            accessToken: state.auth.accessToken,
            refreshToken: state.auth.refreshToken,
        };
    }
);

/**
 * Returns user scope
 */
export const userScope = createSelector(
    commonState,
    (state: CommonReducer): string[] => {
        return state.auth.scope;
    }
);

/**
 * Returns the value of a custom cookie
 * @param code The cookie code
 */
export const customCookie = (code: string) => {
    return createSelector(commonState,
        (state: CommonReducer): string => {
            return state.cookies[code] || "";
        }
    );
};

/**
 * Returns all custom cookies
 */
export const customCookies = createSelector(
    commonState,
    (state: CommonReducer): { [key: string]: string; } => {
        return state.cookies;
    }
);

/**
 * Returns the errors list
 */
export const error = createSelector(
    commonState,
    (state: CommonReducer): ErrorDto[] | undefined => {
        const errors = Object.keys(state.errors).map(key => state.errors[key]);
        return errors;
    }
);

/**
 * Returns the loaders list (filtered by "keys" if is passed)
 * @param keys The loaders unique codes (optional)
 */
export const loader = (keys?: string[]) => {
    return createSelector(commonState,
        (state: CommonReducer): boolean => {
            if (keys) {
                const loaderKeysMatches = Object.keys(state.loaders).filter(x => keys.includes(x));
                const total = loaderKeysMatches.map(loaderKey => state.loaders[loaderKey]).reduce((total, count) => total + count, 0);
                return total > 0;
            } else {
                return state.generalLoaders > 0;
            }
        }
    );
};

/**
 * Returns the popups list
 */
export const popup = createSelector(
    commonState,
    (state: CommonReducer): PopupDto[] | undefined => {
        const popups = Object.keys(state.popups).map(key => state.popups[key]);
        return popups;
    }
);
