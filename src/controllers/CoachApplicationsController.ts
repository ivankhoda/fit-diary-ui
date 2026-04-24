import { action } from 'mobx';

import { BaseController } from './BaseController';
import getApiBaseUrl from '../utils/apiUrl';
import Get from '../utils/GetRequest';
import Post from '../utils/PostRequest';
import CoachApplicationsStore, { CoachApplication } from '../store/coachApplicationsStore';

type CoachApplicationListResponse = {
    applications?: CoachApplication[];
    error?: string;
    ok?: boolean;
};

type CoachApplicationResponse = {
    application?: CoachApplication | null;
    error?: string;
    ok?: boolean;
};

export default class CoachApplicationsController extends BaseController {
    coachApplicationsStore: CoachApplicationsStore;

    constructor(coachApplicationsStore: CoachApplicationsStore) {
        super();
        this.coachApplicationsStore = coachApplicationsStore;
    }

    @action
    async createCoachApplication(applicationData: {
        contacts?: string;
        experience?: string;
        message: string;
        specialization?: string;
    }): Promise<CoachApplicationResponse> {
        try {
            const response = await new Post({
                params: applicationData,
                url: `${getApiBaseUrl()}/users/coach_applications`
            }).execute();
            const result = await response.json() as CoachApplicationResponse;

            if (response.ok && typeof result.application !== 'undefined') {
                this.coachApplicationsStore.setCurrentApplication(result.application ?? null);

                if (result.application) {
                    this.coachApplicationsStore.upsertHistory(result.application);
                }
            }

            return {
                application: result.application ?? null,
                error: result.error,
                ok: response.ok,
            };
        } catch {
            return {
                application: null,
                error: 'Не удалось отправить заявку',
                ok: false,
            };
        }
    }

    @action
    async getCoachApplicationHistory(): Promise<CoachApplicationListResponse> {
        try {
            const response = await new Get({
                url: `${getApiBaseUrl()}/users/coach_applications/history`
            }).execute();
            const result = await response.json() as CoachApplicationListResponse;

            if (response.ok) {
                this.coachApplicationsStore.setHistory(result.applications ?? []);
            }

            return {
                applications: result.applications ?? [],
                error: result.error,
                ok: response.ok,
            };
        } catch {
            return {
                applications: [],
                error: 'Не удалось загрузить историю заявок',
                ok: false,
            };
        }
    }

    @action
    async getCurrentCoachApplication(): Promise<CoachApplicationResponse> {
        try {
            const response = await new Get({
                url: `${getApiBaseUrl()}/users/coach_applications/current`
            }).execute();
            const result = await response.json() as CoachApplicationResponse;

            if (response.ok && 'application' in result) {
                this.coachApplicationsStore.setCurrentApplication(result.application ?? null);
            }

            return {
                application: typeof result.application === 'undefined' ? null : result.application,
                error: result.error,
                ok: response.ok,
            };
        } catch {
            return {
                application: null,
                error: 'Не удалось загрузить статус заявки',
                ok: false,
            };
        }
    }
}
