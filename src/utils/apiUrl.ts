import { Capacitor } from '@capacitor/core';

const getApiBaseUrl = (): string => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}`;

    if (window.location.protocol === 'capacitor:' || Capacitor.isNativePlatform()) {
        return 'https://planka.tech/api';
    }

    const url = process.env.NODE_ENV === 'production' ? `${baseUrl}/api` : `${baseUrl}:3000`;

    return url;
};

export default getApiBaseUrl;
