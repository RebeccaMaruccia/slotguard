import useSessionHandlerConfigHook from "./hooks/session-handler-config.hook";
import useSessionHandlerHook from "./hooks/session-handler.hooks";
import useSessionMaintainerHook from "./hooks/session-maintainer.hook";
import SessionAlerts from "./session-alters.components";
import {SessionStorageType} from "lib-ts-bl/dist/reducers/auth";


/**
 * User auth handler component
 * @returns Alerts with info about session is going to expire or has expired
 */
const SessionHandler: React.FC = (): React.ReactElement => {

    /**
     * Hook to set the current project session handler configurations
     */
    const {
        checkTokens,
        redirectToLogin,
        cookiePrefix,
        storageType,
        userSessionExpiringAlertAdvance,
        refreshTokenGet,
        refreshTokenResponse,
        refreshTokenLoading,
        refreshTokenError,
        refreshTokenReset
    } = useSessionHandlerConfigHook();

    /**
     * Hook to update user auth by refreshing tokens
     */
    useSessionHandlerHook(
        cookiePrefix,
        storageType,
        refreshTokenReset,
        refreshTokenError,
        refreshTokenResponse,
    );

    /**
     * Hook to maintain user auth if there are interactions
     */
    useSessionMaintainerHook(
        checkTokens,
        refreshTokenGet,
        refreshTokenLoading,
        refreshTokenError,
        refreshTokenResponse,
    );

    return (
        <SessionAlerts
            refreshTokenGet={refreshTokenGet}
            refreshTokenLoading={refreshTokenLoading}
            redirectToLogin={redirectToLogin}
            cookiePrefix={cookiePrefix}
            storageType={storageType as SessionStorageType}
            userSessionExpiringAlertAdvance={userSessionExpiringAlertAdvance}
        />
    );
};

export default SessionHandler;
