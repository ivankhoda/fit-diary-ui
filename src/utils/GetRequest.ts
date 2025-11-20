import merge from 'lodash/merge';
import qs from 'qs';
import httpFetch from './httpFetch';

export interface ParamsInterface {
    [key: string]: unknown;
}

export interface GetInterface {
    url: string,
    params?: ParamsInterface,
    configurator?: {
        errorStatusCallback?: (response: Response) => void,
        headers?: {
            [key: string]: string

        },
        convertParamsByContentType?: (params: ParamsInterface) => string
    },
    options?: RequestInit
}

export default class Get {
    method = 'GET';

    url;

    params;

    configurator;

    constructor({url, params, configurator}: GetInterface) {
        this.url = url;
        this.params = params || {};
        this.configurator = merge(httpFetch, configurator);
    }

    get requestUrl(): string {
        return this.url + qs.stringify(this.params, {
            addQueryPrefix: true,
            arrayFormat: 'brackets',
            encodeValuesOnly: true
        });
    }

    get body(): string {
        return null;
    }

    execute(): Promise<Response> {
        const {errorStatusCallback, options} = this.configurator;

        return fetch(
            this.requestUrl,
            merge(options, {
                body: this.body,
                method: this.method
            })
        ).then((response: Response): Response => {
            if (!response.ok) {
                errorStatusCallback && errorStatusCallback(response);
            }
            return response;
        });
    }
}
