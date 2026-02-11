import {useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../store/hook";
import {loginReset, SessionStorageType, userExpiration, userLogged} from "lib-ts-bl/dist/reducers/auth";

/**
 * Hook to showing alerts with info about session is going to expire or has expired
 * @param cookiePrefix The cookie prefix used to store tokens in session storage
 * @param storageType The session storage used to store tokens
 * @param userSessionExpiringAlertAdvance Indicates how soon an alert should be displayed before the user session expires (in seconds, default 120)
 * @returns Indicates if expiring or expired session alerts are visible, the countdown to expiration of session and a method to hide all alerts
 */
const useSessionAlertsHook = (
    cookiePrefix: string,
    storageType: SessionStorageType,
    userSessionExpiringAlertAdvance: number = 120,
) => {
    const dispatch = useAppDispatch();

    /**
     * Reset user auth info
     */
    const loginResetPrivate = () => {
        dispatch(loginReset({ cookiePrefix, storageType }));
    };

    /** Checks for user authentication */
    const userAuthLogged: boolean = useAppSelector(userLogged) ?? false;

    /** User auth expiration time */
    const userAuthExpirationTimeInMs = useAppSelector(userExpiration);

    /** Countdown to session expiration */
    const [expirationCountdown, setExpirationCountdown] = useState<number | undefined>(undefined);

    /** User session expiration timer */
    const expirationCountdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Stop countdown on component unmount
     */
    useEffect(() => {
        return () => {
            stopCountdown();
        };
    }, []);

    /**
     * Start or stop countdown to session expiration
     */
    useEffect(() => {
        if (userAuthLogged && userAuthExpirationTimeInMs > 0) {
            startCountdown();
        } else {
            stopCountdown();
        }
    }, [userAuthLogged, userAuthExpirationTimeInMs]);

    /**
     * Start countdown to session expiration
     */
    const startCountdown = () => {
        stopCountdown();
        expirationCountdownTimer.current = setInterval(() => {
            const nowInMs = new Date().getTime();
            const diff = userAuthExpirationTimeInMs - nowInMs;
            console.log('diff', diff);
            if (diff > 0) {
                setExpirationCountdown(Math.ceil(diff / 1000));
            } else {
                setExpirationCountdown(0);
            }
        }, 1000);
    };

    /**
     * Stop countdown to session expiration
     */
    const stopCountdown = () => {
        if (expirationCountdownTimer.current) {
            clearInterval(expirationCountdownTimer.current);
        }
        expirationCountdownTimer.current = null;
    };

    /** Show alert for the expiring user session */
    const [userSessionExpiringAlertShow, setUserSessionExpiringAlertShow] = useState<boolean>(false);

    /** Show alert for the expired user session */
    const [userSessionExpiredAlertShow, setUserSessionExpiredAlertShow] = useState<boolean>(false);

    /**
     * Handling alerts showing
     */
    useEffect(() => {
        if (expirationCountdown !== undefined) {
            if (userAuthLogged && expirationCountdown > 0 && expirationCountdown < userSessionExpiringAlertAdvance) {
                setUserSessionExpiringAlertShow(true);
            } else if (userAuthLogged && expirationCountdown <= 1) {
                setUserSessionExpiringAlertShow(false);
                setUserSessionExpiredAlertShow(true);
            } else {
                setUserSessionExpiringAlertShow(false);
                setUserSessionExpiredAlertShow(false);
            }
        }
    }, [expirationCountdown]);

    /**
     * Reset user info after session expired
     */
    useEffect(() => {
        if (userSessionExpiredAlertShow) {
            loginResetPrivate();
        }
    }, [userSessionExpiredAlertShow]);

    /**
     * Get time in HH:mm format
     * @param timeInSeconds The time to format (in seconds)
     * @returns The time formatted (in HH:mm)
     */
    const getTime = (timeInSeconds: number | undefined) => {
        let time = "";
        if (timeInSeconds && timeInSeconds > 0) {
            const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
            const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
            time = `${minutes}:${seconds}`;
        }
        return time;
    };

    /**
     * Countdown to session expiration in HH:mm format
     */
    const userSessionExpiringAlertCountdown = useMemo(() => getTime(expirationCountdown), [expirationCountdown]);

    /**
     * Hide all alerts
     */
    const hideAlerts = () => {
        setUserSessionExpiringAlertShow(false);
        setUserSessionExpiredAlertShow(false);
    };

    return {
        userSessionExpiringAlertShow,
        userSessionExpiringAlertCountdown,
        userSessionExpiredAlertShow,
        hideAlerts
    };

};

export default useSessionAlertsHook;