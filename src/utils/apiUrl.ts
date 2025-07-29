import { Capacitor } from '@capacitor/core';

const getApiBaseUrl = (): string => {
    console.log('[API] location.protocol:', window.location.protocol);
    console.log('[API] isNativePlatform:', Capacitor.isNativePlatform());

    const baseUrl = `${window.location.protocol}//${window.location.hostname}`;

    if (window.location.protocol === 'capacitor:' || Capacitor.isNativePlatform()) {
        console.log('[API] Using production API base URL');
        return 'https://planka.tech/api';
    }

    const url = process.env.NODE_ENV === 'production' ? `${baseUrl}/api` : `${baseUrl}:3000`;
    console.log('[API] Using dev API base URL:', url);
    return url;
};

export default getApiBaseUrl;
