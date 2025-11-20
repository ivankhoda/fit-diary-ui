/* eslint-disable no-undefined */
import getToken from './getToken';

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
        return {
            Accept: 'application/json',
            Authorization: `Bearer ${getToken()}`,
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

    // eslint-disable-next-line max-params
    request(url, method, params = null, customHeaders = {}) {
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

        return fetch(url, fetchParams).then(response => {
            if (!response.ok && this.errorStatusCallback) {
                this.errorStatusCallback(response);
            }
            return response;
        });
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
