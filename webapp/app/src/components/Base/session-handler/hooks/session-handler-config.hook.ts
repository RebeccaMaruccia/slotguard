import useAuthHook from "../../../../hooks/auth/auth.hook";
import {SessionStorageType} from "lib-ts-bl/dist/reducers/auth";
import {environment} from "../../../../shared/environment";


/**
 * Hook to set the current project session handler configurations
 * @returns The current project session handler configurations
 */
const useSessionHandlerConfigHook = () => {

    /**
     * Refresh user auth
     */
    const { refreshTokenGet, refreshTokenResponse, refreshTokenLoading, refreshTokenError, refreshTokenReset } = useAuthHook();
    const refreshTokenPrivate = () => {
        const accessToken = sessionStorage.getItem(environment.auth.accessTokenName) ?? "";
        const refreshToken = sessionStorage.getItem(environment.auth.refreshTokenName) ?? "";
        refreshTokenGet(refreshToken);
    };

    /**
     * Checks for user access and refresh tokens
     * @returns True if there are access and refresh tokens
     */
    const checkTokens = (): boolean => {
        const accessToken = sessionStorage.getItem(environment.auth.accessTokenName) ?? "";
        const refreshToken = sessionStorage.getItem(environment.auth.refreshTokenName) ?? "";
        if (accessToken && refreshToken) {
            return true;
        }
        return false;
    };

    /**
     * Redirect to login (after session expired)
     */
   // const { redirectToPage } = useNavigationHook();
    const redirectToLogin = () => {
        //redirectToPage(EnumRoutes.LOGIN);
    };

    return {
        checkTokens,
        redirectToLogin,
        cookiePrefix: environment.cookie.prefix,
        storageType: environment.auth.sessionStorageType as SessionStorageType,
        userSessionExpiringAlertAdvance: environment.auth.sessionExpiringAlertAdvance,
        refreshTokenGet: refreshTokenPrivate,
        refreshTokenResponse,
        refreshTokenLoading,
        refreshTokenError,
        refreshTokenReset,
    };
};

export default useSessionHandlerConfigHook;
