import { Capacitor } from '@capacitor/core';

const getApiBaseUrl = (): string => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}`;

    if (window.location.protocol === 'capacitor:' || Capacitor.isNativePlatform()) {
        return 'https://planka.tech/api';
    }

    const url = process.env.NODE_ENV === 'production' ? `${baseUrl}/api` : 'https://u65v14-163-5-63-252.ru.tuna.am';

    return url;
};

export default getApiBaseUrl;
