/* eslint-disable max-params */
/* eslint-disable func-style */
// @ts-ignore
import getToken from './getToken';


function objectToURIComponent(data) { return Object.keys(data)
    .filter(analyticsKey =>data[analyticsKey])
    .map(analyticsKey => `${analyticsKey  }=${  encodeURIComponent(data[analyticsKey])}`).join('&');
}


class HttpFetch {
    constructor(options) {
        this.options = {
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',

            },
            ...options
        };
    }

    errorStatusCallback;

    get cache() {
        return this.options.cache;
    }

    set cache(value) {
        this.options.cache = value;
    }

    get credentials() {
        return this.options.credentials;
    }

    set credentials(value) {
        this.options.credentials = value;
    }

    get mode() {
        return this.options.mode;
    }

    set mode(value) {
        this.options.mode = value;
    }

    get redirect() {
        return this.options.redirect;
    }

    set redirect(value) {
        this.options.redirect = value;
    }

    get referrerPolicy() {
        return this.options.referrerPolicy;
    }

    set referrerPolicy(value) {
        this.options.referrerPolicy = value;
    }

    get headers() {
        return this.options.headers;
    }

    set headers(value) {
        this.options.headers = {
            ...this.options.headers,
            ...value
        };
    }

    convertParamsByContentType(data) {
        switch (this.options.headers['Content-Type']) {
        case 'application/json':
            return JSON.stringify(data);
        case 'application/x-www-form-urlencoded':
            return objectToURIComponent(data);
        default:
            return JSON.stringify(data);
        }
    }

    request(url, method, params, headers) {
        const fetchParams = {
            ...this.options,
            headers: {
                ...this.options.headers,
                ...headers
            },
            method
        };

        if (params) {
            fetchParams.body = this.convertParamsByContentType(params);
        }

        return fetch(url, fetchParams)
            .then(response => {
                if (!response.ok) {
                    this.errorStatusCallback && this.errorStatusCallback(response);
                }

                return response;
            });
    }

    get({url, params = null, headers = {}}) {
        return this.request(url, 'GET', params, headers);
    }

    post({url, params = null, headers = {}}) {
        return this.request(url, 'POST', params, headers);
    }

    put({url, params = null, headers = {}}) {
        return this.request(url, 'PUT', params, headers);
    }

    delete({url, params = null, headers = {}}) {
        return this.request(url, 'DELETE', params, headers);
    }
}

const httpFetch = new HttpFetch();

export { HttpFetch };

export default httpFetch;
