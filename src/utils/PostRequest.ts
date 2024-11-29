import Get from './GetRequest';


export default class Post extends Get {
    method = 'POST';

    get requestUrl(): string {
        return this.url;
    }

    get body(): string {
        return this.configurator.convertParamsByContentType(this.params);
    }
}
