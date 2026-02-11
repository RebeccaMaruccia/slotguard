import {useAppSelector} from "../../../../store/hook";
import {useEffect, useMemo, useRef, useState} from "react";
import {userLogged} from "lib-ts-bl/dist/reducers/auth";
import {AuthenticateApiResponse} from "api-service";


/**
 * Hook to maintain user auth if there are interactions
 * @param checkTokens Checks for user access and refresh tokens
 * @param refreshTokenGet The refresh token API call
 * @param refreshTokenLoading Indicates if refresh token API call is in progress
 * @param refreshTokenError Indicates if refresh token API call failed
 * @param refreshTokenResponse The refresh token API response
 * @param userInteractionDebounce User interaction handler debounce time (default: 3 seconds)
 * @param userKeepLoggedDebounce User authentication refresh debounce time (default: 60 seconds)
 */
const useSessionMaintainerHook = (
    checkTokens: () => boolean,
    refreshTokenGet: () => void,
    refreshTokenLoading: boolean,
    refreshTokenError: boolean,
    refreshTokenResponse: AuthenticateApiResponse | undefined,
    userInteractionDebounce: number = 3,
    userKeepLoggedDebounce: number = 60,
) => {

    /** Checks for user authentication */
    const userAuthLogged: boolean = useAppSelector(userLogged) ?? false;

    /** Handled events */
    const events = useMemo(() => ["click", "keydown", "mousewheel", "mousedown", "mousemove"], []);

    /** Checks for user interaction */
    const [userInteracted, setUserInteracted] = useState<boolean>(false);

    /** User interaction handler debounce timer */
    const userInteractionDebounceTimer = useRef<NodeJS.Timeout | null>(null);

    /** User authentication refresh debounce timer */
    const userKeepLoggedDebounceTimer =  useRef<ReturnType<typeof setTimeout> | null>(null);


    /**
     * Appends a listener for each events handled
     */
    useEffect(() => {
        startKeepLoggedHandler();
        return () => {
            stopKeepLoggedHandler();
        };
    }, []);

    /**
     * Start user session keeping system
     */
    const startKeepLoggedHandler = () => {
        events.forEach(event => {
            document.addEventListener(event, onUserInteraction);
            console.log(event);
        });
    };

    /**
     * Stop user session keeping system
     */
    const stopKeepLoggedHandler = () => {
        events.forEach(event => {
            document.removeEventListener(event, onUserInteraction);
        });
        if (userInteractionDebounceTimer.current) {
            clearTimeout(userInteractionDebounceTimer.current);
            userInteractionDebounceTimer.current = null;
        }
        if (userKeepLoggedDebounceTimer.current) {
            clearInterval(userKeepLoggedDebounceTimer.current);
            userKeepLoggedDebounceTimer.current = null;
        }
    };

    /**
     * Executed at every user interaction (with 3 seconds debounce)
     */
    const onUserInteraction = () => {
        if (!userInteractionDebounceTimer.current) {
            userInteractionDebounceTimer.current = setTimeout(() => {
                setUserInteracted(true);
                if (userInteractionDebounceTimer.current) {
                    clearTimeout(userInteractionDebounceTimer.current);
                }
                userInteractionDebounceTimer.current = null;
            }, (userInteractionDebounce * 1000));
        }
    };

    /**
     * If user is logged and has interacted, keep the user logged (with 60 seconds debounce)
     */
    useEffect(() => {
        if (userAuthLogged && userInteracted) {
            if (!userKeepLoggedDebounceTimer.current) {
                userKeepLoggedDebounceTimer.current = setInterval(keepLogged, (userKeepLoggedDebounce * 1000));
            }
        } else if (userKeepLoggedDebounceTimer.current) {
            clearInterval(userKeepLoggedDebounceTimer.current);
            userKeepLoggedDebounceTimer.current = null;
        }
    }, [userAuthLogged, userInteracted]);

    /**
     * Requests new access and refresh tokens
     */
    const keepLogged = () => {
        if (userAuthLogged && refreshTokenLoading === false && checkTokens()) {
            if (userKeepLoggedDebounceTimer.current) {
                clearInterval(userKeepLoggedDebounceTimer.current);
            }
            userKeepLoggedDebounceTimer.current = null;

            refreshTokenGet();
        }
    };

    /**
     * Reset checks for user interaction
     */
    useEffect(() => {
        if (refreshTokenResponse || refreshTokenError) {
            setUserInteracted(false);
        }
    }, [refreshTokenResponse, refreshTokenError]);
};

export default useSessionMaintainerHook;
