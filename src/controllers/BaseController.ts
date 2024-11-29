import { redirect } from 'react-router-dom';

export class BaseController {
    navigateTo(path: string): void {
        redirect(path);
    }
}
