/* eslint-disable no-undefined */
import {
    getAccessToken,
    hasRefreshToken,
    redirectToLogin,
    refreshSession,
} from '../services/authSession';

const UNAUTHORIZED_STATUS = 401;

const objectToURIComponent = data => Object.keys(data)
    .filter(key => data[key] !== undefined && data[key] !== null)
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

class HttpFetch {
    constructor(options = {}) {
        this.options = {
            credentials: 'same-origin',
            ...options
        };
    }

    /** Динамические заголовки — всегда свежий токен */
    get defaultHeaders() {
        const accessToken = getAccessToken();

        return {
            Accept: 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            'Content-Type': 'application/json'
        };
    }

    convertParamsByContentType(data) {
        switch (this.defaultHeaders['Content-Type']) {
        case 'application/json':
            return JSON.stringify(data);
        case 'application/x-www-form-urlencoded':
            return objectToURIComponent(data);
        default:
            return JSON.stringify(data);
        }
    }

    buildFetchParams(method, params, customHeaders) {
        const headers = {
            ...this.defaultHeaders,
            ...customHeaders
        };
        const fetchParams = {
            ...this.options,
            headers,
            method
        };

        if (params) {
            fetchParams.body = this.convertParamsByContentType(params);
        }

        return { fetchParams, headers };
    }

    reportErrorStatus(response) {
        if (!response.ok && this.errorStatusCallback) {
            this.errorStatusCallback(response);
        }
    }

    async retryUnauthorizedRequest(url, fetchParams, headers) {
        const nextAccessToken = await refreshSession();

        if (!nextAccessToken) {
            redirectToLogin();
            return null;
        }

        const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${nextAccessToken}`,
        };
        const retryResponse = await fetch(url, {
            ...fetchParams,
            headers: retryHeaders,
        });

        this.reportErrorStatus(retryResponse);

        return retryResponse;
    }

    // eslint-disable-next-line max-params
    async request(url, method, params = null, customHeaders = {}, retry = true) {
        const { fetchParams, headers } = this.buildFetchParams(method, params, customHeaders);

        const response = await fetch(url, fetchParams);
        const hadSession = Boolean(getAccessToken()) || hasRefreshToken();

        if (response.status === UNAUTHORIZED_STATUS && retry && hadSession) {
            const retryResponse = await this.retryUnauthorizedRequest(url, fetchParams, headers);

            if (retryResponse) {
                return retryResponse;
            }
        }

        this.reportErrorStatus(response);

        return response;
    }

    get({ url, params = null, headers = {} }) {
        return this.request(url, 'GET', params, headers);
    }

    post({ url, params = null, headers = {} }) {
        return this.request(url, 'POST', params, headers);
    }

    put({ url, params = null, headers = {} }) {
        return this.request(url, 'PUT', params, headers);
    }

    delete({ url, params = null, headers = {} }) {
        return this.request(url, 'DELETE', params, headers);
    }
}

const httpFetch = new HttpFetch();
export { HttpFetch };
export default httpFetch;
