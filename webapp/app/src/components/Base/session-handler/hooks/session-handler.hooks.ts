import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../../store/hook";
import {AuthenticateApiResponse} from "api-service"
import {loginReload, loginReset, loginSet, SessionStorageType, userLoginType} from "lib-ts-bl/dist/reducers/auth";

/**
 * Hook to maintain user auth by refreshing tokens
 * @param cookiePrefix The cookie prefix used to store tokens in session storage
 * @param storageType The session storage used to store tokens
 * @param refreshTokenReset Reset the refresh token API call
 * @param refreshTokenError Indicates if refresh token API call failed
 * @param refreshTokenResponse The refresh token API response
 */
const useSessionHandlerHook = (
    cookiePrefix: string,
    storageType: SessionStorageType,
    refreshTokenReset: () => void,
    refreshTokenError: boolean,
    refreshTokenResponse: AuthenticateApiResponse | undefined,
) => {
    const dispatch = useAppDispatch();

    /**
     * Set user authentication from cookie
     */
    useEffect(() => {
        dispatch(loginReload({ cookiePrefix, storageType }));
    }, [cookiePrefix, storageType]);

    /** Checks for user login type */
    const userAuthLoginType: "internal" | "external" = useAppSelector(userLoginType) ?? "internal";

    /**
     * Set user auth info
     */
    const loginSetPrivate = () => {
        dispatch(loginSet({
            accessToken: refreshTokenResponse?.accessToken ?? "",
            refreshToken: refreshTokenResponse?.refreshToken ?? "",
            cookiePrefix,
            expiresIn: refreshTokenResponse?.expiresIn ?? 0,
            scope: "",
            storageType,
            loginType: userAuthLoginType,
        }));
        refreshTokenReset();
    };

    /**
     * Reset user auth info
     */
    const loginResetPrivate = () => {
        dispatch(loginReset({ cookiePrefix, storageType }));
    };

    /**
     * Update user access and refresh tokens in store
     */
    useEffect(() => {
        if (refreshTokenResponse) {
            loginSetPrivate();
        }
    }, [refreshTokenResponse]);

    /**
     * Clear user access and refresh tokens in store
     */
    useEffect(() => {
        if (refreshTokenError) {
            loginResetPrivate();
        }
    }, [refreshTokenError]);
};

export default useSessionHandlerHook;
