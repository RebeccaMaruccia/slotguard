import SessionAlertExpiring from "./session.dialog.expiring.component";
import SessionAlertExpired from "./session.dialog.expired.component";
import useSessionAlertsHook from "./hooks/session.hooks";
import {SessionStorageType} from "lib-ts-bl/dist/reducers/auth";


interface IProps {
    readonly refreshTokenGet: () => void,
    readonly refreshTokenLoading: boolean,
    readonly redirectToLogin: () => void,
    readonly cookiePrefix: string,
    readonly storageType: SessionStorageType,
    readonly userSessionExpiringAlertAdvance?: number,
}

const SessionAlerts: React.FC<IProps> = (props: IProps): React.ReactElement => {

    const { refreshTokenGet, refreshTokenLoading, redirectToLogin, cookiePrefix, storageType, userSessionExpiringAlertAdvance } = props;

    /**
     * Hook to showing alerts with info about session is going to expire or has expired
     */
    const { userSessionExpiringAlertShow, userSessionExpiringAlertCountdown, userSessionExpiredAlertShow, hideAlerts } = useSessionAlertsHook(
        cookiePrefix,
        storageType,
        userSessionExpiringAlertAdvance,
    );

    return (
        <>
            <SessionAlertExpiring
                show={userSessionExpiringAlertShow}
                action={() => { hideAlerts(); refreshTokenGet(); }}
                isLoading={refreshTokenLoading}
                countdown={userSessionExpiringAlertCountdown}
            />
            <SessionAlertExpired
                show={userSessionExpiredAlertShow}
                action={() => { hideAlerts(); redirectToLogin(); }}
            />
        </>
    );
};

export default SessionAlerts;
