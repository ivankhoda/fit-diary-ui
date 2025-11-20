import qs from 'qs';
import httpFetch from './httpFetch';

export interface ParamsInterface {
  [key: string]: unknown;
}

export interface GetInterface {
  url: string;
  params?: ParamsInterface;
  configurator?: {
    errorStatusCallback?: (response: Response) => void;
    headers?: Record<string, string>;
    convertParamsByContentType?: (params: ParamsInterface) => string;
  };
}

export default class Get {
  method = 'GET';
  url: string;
  params: ParamsInterface;
  configurator: GetInterface['configurator'];

  constructor({ url, params, configurator }: GetInterface) {
      this.url = url;
      this.params = params || {};
      this.configurator = { ...configurator };
  }

  get requestUrl(): string {
      return this.url + qs.stringify(this.params, {
          addQueryPrefix: true,
          arrayFormat: 'brackets',
          encodeValuesOnly: true,
      });
  }

  execute(): Promise<Response> {
      const { errorStatusCallback, headers } = this.configurator || {};

      // Для GET/HEAD body не передаём
      const body = this.method === 'GET' || this.method === 'HEAD' ? null : this.params;

      return httpFetch
          .request(this.requestUrl, this.method, body, headers)
          .then((response: Response) => {
              if (!response.ok && errorStatusCallback) {
                  errorStatusCallback(response);
              }
              return response;
          });
  }
}
