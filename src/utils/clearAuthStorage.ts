const AUTH_STORAGE_KEYS = [
    'token',
    'refresh_token',
    'access_token',
] as const;

export const clearAuthStorage = (): void => {
    AUTH_STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
    });
};
