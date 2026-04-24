import { action } from 'mobx';

import { BaseController } from '../../../controllers/BaseController';
import getApiBaseUrl from '../../../utils/apiUrl';
import Get from '../../../utils/GetRequest';
import Post from '../../../utils/PostRequest';
import {
    CoachApplication,
    CoachApplicationFilter,
} from '../../../store/coachApplicationsStore';
import AdminCoachApplicationsStore from '../store/AdminCoachApplicationsStore';

type CoachApplicationListResponse = {
    applications?: CoachApplication[];
    error?: string;
    ok?: boolean;
};

type CoachApplicationResponse = {
    application?: CoachApplication;
    error?: string;
    ok?: boolean;
};

type CoachApplicationActionResult = {
    application: CoachApplication | null;
    error?: string;
    ok: boolean;
};

const EMPTY_REJECTION_REASON = '';

export default class AdminCoachApplicationsController extends BaseController {
    adminCoachApplicationsStore: AdminCoachApplicationsStore;

    constructor(adminCoachApplicationsStore: AdminCoachApplicationsStore) {
        super();
        this.adminCoachApplicationsStore = adminCoachApplicationsStore;
    }

    @action
    approveApplication(applicationId: number): Promise<CoachApplicationActionResult> {
        return this.applyMutation(
            applicationId,
            new Post({
                url: `${getApiBaseUrl()}/admin/coach_applications/${applicationId}/approve`
            }),
        );
    }

    @action
    async fetchApplication(applicationId: number): Promise<CoachApplicationActionResult> {
        try {
            const response = await new Get({
                url: `${getApiBaseUrl()}/admin/coach_applications/${applicationId}`
            }).execute();
            const data = await response.json() as CoachApplicationResponse;

            if (!response.ok || !data.application) {
                return {
                    application: null,
                    error: data.error,
                    ok: false,
                };
            }

            this.adminCoachApplicationsStore.setApplication(data.application);

            return {
                application: data.application,
                ok: true,
            };
        } catch {
            return {
                application: null,
                error: 'Не удалось загрузить заявку',
                ok: false,
            };
        }
    }

    @action
    async fetchApplications(filter: CoachApplicationFilter = 'pending'): Promise<{ error?: string; ok: boolean }> {
        const request = filter === 'pending'
            ? new Get({
                url: `${getApiBaseUrl()}/admin/coach_applications`
            })
            : new Get({
                params: { status: filter },
                url: `${getApiBaseUrl()}/admin/coach_applications`
            });

        try {
            const response = await request.execute();
            const data = await response.json() as CoachApplicationListResponse;

            if (!response.ok) {
                return {
                    error: data.error,
                    ok: false,
                };
            }

            this.adminCoachApplicationsStore.setFilter(filter);
            this.adminCoachApplicationsStore.setApplications(data.applications ?? []);

            return { ok: true };
        } catch {
            return {
                error: 'Не удалось загрузить заявки',
                ok: false,
            };
        }
    }

    @action
    rejectApplication(applicationId: number, rejectionReason: string): Promise<CoachApplicationActionResult> {
        return this.applyMutation(
            applicationId,
            new Post({
                params: { rejection_reason: rejectionReason.trim() || EMPTY_REJECTION_REASON },
                url: `${getApiBaseUrl()}/admin/coach_applications/${applicationId}/reject`
            }),
        );
    }

    private async applyMutation(
        applicationId: number,
        request: Post,
    ): Promise<CoachApplicationActionResult> {
        try {
            const response = await request.execute();
            const data = await response.json() as CoachApplicationResponse;

            if (!response.ok || !data.application) {
                return {
                    application: null,
                    error: data.error,
                    ok: false,
                };
            }

            if (this.adminCoachApplicationsStore.filter === 'pending' && data.application.status !== 'pending') {
                this.adminCoachApplicationsStore.removeApplication(applicationId);
            } else {
                this.adminCoachApplicationsStore.upsertApplication(data.application);
            }

            return {
                application: data.application,
                ok: true,
            };
        } catch {
            return {
                application: null,
                error: 'Не удалось обновить заявку',
                ok: false,
            };
        }
    }
}
