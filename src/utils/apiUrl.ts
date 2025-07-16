const getApiBaseUrl = (): string => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
    console.log('Base URL:', baseUrl);
    console.log('Protocol:', window.location.protocol);
    if (window.location.protocol === 'capacitor:') {
        return 'https://planka.tech/api';
    }

    return process.env.NODE_ENV === 'production' ? `${baseUrl}/api` : `${baseUrl}:3000`;
};
export default getApiBaseUrl;
