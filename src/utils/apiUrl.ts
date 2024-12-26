const DEFAULT_PORT = 3000;

const getApiBaseUrl = (): string => `${window.location.protocol}//${window.location.hostname}:${window.location.port || DEFAULT_PORT}/api`;

export default getApiBaseUrl;
