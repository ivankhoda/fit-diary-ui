
const getApiBaseUrl = (): string => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
    return process.env.NODE_ENV === 'production' ? `${baseUrl}/api` : `${baseUrl}:3000`;
};

export default getApiBaseUrl;
