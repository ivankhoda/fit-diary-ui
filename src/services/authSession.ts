import getApiBaseUrl from '../utils/apiUrl';
import { clearAuthStorage } from '../utils/clearAuthStorage';

type SessionListener = () => void;

type RefreshResponse = {
    access_token?: string;
    jwt?: string;
    refresh_token?: string;
};

export type SessionSnapshot = {
    accessToken: string | null;
    hasRefreshToken: boolean;
    isReady: boolean;
};

const LOGIN_PATH = '/login';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';
const LEGACY_ACCESS_TOKEN_KEYS = ['access_token', 'token'] as const;

let accessToken: string | null = null;
let isReady = false;
let bootstrapPromise: Promise<string | null> | null = null;
let refreshPromise: Promise<string | null> | null = null;
let sessionSnapshot: SessionSnapshot = {
    accessToken,
    hasRefreshToken: false,
    isReady,
};

const listeners = new Set<SessionListener>();

const syncSessionSnapshot = (): void => {
    const nextHasRefreshToken = Boolean(getStoredValue(REFRESH_TOKEN_STORAGE_KEY));

    if (
        sessionSnapshot.accessToken === accessToken
        && sessionSnapshot.hasRefreshToken === nextHasRefreshToken
        && sessionSnapshot.isReady === isReady
    ) {
        return;
    }

    sessionSnapshot = {
        accessToken,
        hasRefreshToken: nextHasRefreshToken,
        isReady,
    };
};

const isBrowser = (): boolean => typeof window !== 'undefined';

const notifyListeners = (): void => {
    listeners.forEach(listener => {
        listener();
    });
};

const getStoredValue = (key: string): string | null => {
    if (!isBrowser()) {
        return null;
    }

    return window.localStorage.getItem(key);
};

const setStoredValue = (key: string, value: string): void => {
    if (!isBrowser()) {
        return;
    }

    window.localStorage.setItem(key, value);
};

const removeStoredValue = (key: string): void => {
    if (!isBrowser()) {
        return;
    }

    window.localStorage.removeItem(key);
};

const clearLegacyAccessTokens = (): void => {
    LEGACY_ACCESS_TOKEN_KEYS.forEach(removeStoredValue);
};

const readLegacyAccessToken = (): string | null => {
    for (const key of LEGACY_ACCESS_TOKEN_KEYS) {
        const storedToken = getStoredValue(key);

        if (storedToken) {
            return storedToken;
        }
    }

    return null;
};

const setReadyState = (nextReadyState: boolean): void => {
    isReady = nextReadyState;
    syncSessionSnapshot();
};

const commitAccessToken = (nextAccessToken: string | null): void => {
    accessToken = nextAccessToken;
    clearLegacyAccessTokens();
    syncSessionSnapshot();
};

const commitRefreshToken = (nextRefreshToken: string | null): void => {
    if (nextRefreshToken) {
        setStoredValue(REFRESH_TOKEN_STORAGE_KEY, nextRefreshToken);
        syncSessionSnapshot();
        return;
    }

    removeStoredValue(REFRESH_TOKEN_STORAGE_KEY);
    syncSessionSnapshot();
};

const parseRefreshResponse = (response: Response): Promise<RefreshResponse> => response.json() as Promise<RefreshResponse>;

export const subscribeToSession = (listener: SessionListener): (() => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

export const getAccessToken = (): string | null => accessToken;

export const getRefreshToken = (): string | null => getStoredValue(REFRESH_TOKEN_STORAGE_KEY);

export const hasRefreshToken = (): boolean => Boolean(getRefreshToken());

export const getSessionSnapshot = (): SessionSnapshot => sessionSnapshot;

export const setSessionTokens = ({
    accessToken: nextAccessToken,
    refreshToken,
}: {
    accessToken: string;
    refreshToken: string;
}): void => {
    commitAccessToken(nextAccessToken);
    commitRefreshToken(refreshToken);
    setReadyState(true);
    notifyListeners();
};

export const clearSession = (): void => {
    commitAccessToken(null);
    clearAuthStorage();
    syncSessionSnapshot();
    setReadyState(true);
    notifyListeners();
};

export const bootstrapSession = (): Promise<string | null> => {
    if (isReady) {
        return Promise.resolve(accessToken);
    }

    if (bootstrapPromise) {
        return bootstrapPromise;
    }

    bootstrapPromise = (async() => {
        const legacyAccessToken = readLegacyAccessToken();

        if (legacyAccessToken) {
            commitAccessToken(legacyAccessToken);
            setReadyState(true);
            notifyListeners();
            return legacyAccessToken;
        }

        if (!hasRefreshToken()) {
            setReadyState(true);
            notifyListeners();
            return null;
        }

        const refreshedAccessToken = await refreshSession();

        if (!isReady) {
            setReadyState(true);
            notifyListeners();
        }

        return refreshedAccessToken;
    })().finally(() => {
        bootstrapPromise = null;
    });

    return bootstrapPromise;
};

export const refreshSession = (): Promise<string | null> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        clearSession();
        return Promise.resolve(null);
    }

    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async() => {
        try {
            const response = await fetch(`${getApiBaseUrl()}/refresh`, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
                method: 'POST',
            });

            if (!response.ok) {
                clearSession();
                return null;
            }

            const data = await parseRefreshResponse(response);
            const nextAccessToken = data.jwt ?? data.access_token;
            const nextRefreshToken = data.refresh_token;

            if (!nextAccessToken || !nextRefreshToken) {
                clearSession();
                return null;
            }

            setSessionTokens({
                accessToken: nextAccessToken,
                refreshToken: nextRefreshToken,
            });

            return nextAccessToken;
        } catch {
            clearSession();
            return null;
        }
    })().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
};

export const redirectToLogin = (): void => {
    if (!isBrowser() || window.location.pathname === LOGIN_PATH) {
        return;
    }

    window.location.replace(LOGIN_PATH);
};

export const revokeCurrentSession = async(): Promise<void> => {
    const currentAccessToken = getAccessToken();
    const currentRefreshToken = getRefreshToken();

    if (!currentAccessToken && !currentRefreshToken) {
        return;
    }

    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    if (currentAccessToken) {
        headers.Authorization = `Bearer ${currentAccessToken}`;
    }

    if (currentRefreshToken) {
        headers['X-Refresh-Token'] = currentRefreshToken;
    }

    try {
        await fetch(`${getApiBaseUrl()}/users/sign_out`, {
            credentials: 'same-origin',
            headers,
            keepalive: true,
            method: 'DELETE',
        });
    } catch {
        // Ignore revoke failures and clear local session anyway.
    }
};
