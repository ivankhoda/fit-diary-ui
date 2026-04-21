import { useCallback, useSyncExternalStore } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  bootstrapSession,
  clearSession,
  getAccessToken,
  getRefreshToken,
  getSessionSnapshot,
  hasRefreshToken,
  setSessionTokens,
  subscribeToSession,
} from '../../services/authSession';

export interface DecodedToken {
  email: string;
  admin: boolean;
  coach: boolean;
  roles: {
    admin: boolean;
    coach: boolean;
    sportsman: boolean;
  };
  verified_coach: boolean;
  exp: number;
}

export const useToken = () => {
  const sessionSnapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getSessionSnapshot,
  );

  const decodeCurrentToken = (): DecodedToken | null => {
    const currentToken = getAccessToken();

    if (!currentToken) {
      return null;
    }

    try {
      return jwtDecode<DecodedToken>(currentToken);
    } catch {
      return null;
    }
  };

  const getToken = useCallback((): string | null => getAccessToken(), []);

  const decodeToken = useCallback((): DecodedToken | null => {
    return decodeCurrentToken();
  }, []);

  const saveToken = useCallback((userToken: string | null) => {
    if (userToken) {
      const currentRefreshToken = sessionSnapshot.hasRefreshToken
        ? getRefreshToken()
        : null;

      if (currentRefreshToken) {
        setSessionTokens({
          accessToken: userToken,
          refreshToken: currentRefreshToken,
        });
        return;
      }
    } else {
      clearSession();
    }

  }, [sessionSnapshot.hasRefreshToken]);


  const isAdmin = useCallback((): boolean => {
    const decoded = decodeCurrentToken();
    return decoded?.admin || false;
  }, []);

  const isCoach = useCallback((): boolean => {
    const decoded = decodeCurrentToken();
    return Boolean(decoded?.roles?.coach);
  }, []);

  const isVerifiedCoach = useCallback((): boolean => {
    const decoded = decodeCurrentToken();
    return Boolean(decoded?.verified_coach);
  }, []);

  const restoreSession = useCallback((): Promise<string | null> => bootstrapSession(), []);

  const hasStoredRefreshToken = useCallback((): boolean => hasRefreshToken(), []);

  return {
    bootstrapSession: restoreSession,
    hasRefreshToken: hasStoredRefreshToken,
    isReady: sessionSnapshot.isReady,
    setToken: saveToken,
    getToken,
    isAdmin,
    isCoach,
    isVerifiedCoach,
    token: sessionSnapshot.accessToken,
    decodeToken,
  };
};
