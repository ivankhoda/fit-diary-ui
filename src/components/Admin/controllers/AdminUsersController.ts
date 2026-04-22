import { action } from 'mobx';
import AdminUsersStore, { AdminUserProfile } from '../store/AdminUsersStore';
import { BaseController } from '../../../controllers/BaseController';
import { WorkoutInterface } from '../../../store/workoutStore';

import Get from '../../../utils/GetRequest';
import Patch from '../../../utils/PatchRequest';
import getApiBaseUrl from '../../../utils/apiUrl';

export interface AdminUserUpdatePayload {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    role?: string;
    roles?: string[];
    telegram_username?: string;
    username?: string;
}

interface AdminUserUpdateResponse {
    errors?: string[];
    ok?: boolean;
    user?: AdminUserProfile;
}

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object';

const getErrorMessages = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((message): message is string => typeof message === 'string');
};

const getUpdatedUser = (result: unknown): AdminUserProfile | null => {
    if (!isRecord(result)) {
        return null;
    }

    if (isRecord(result.user)) {
        return result.user as AdminUserProfile;
    }

    if (typeof result.id === 'number') {
        return result as AdminUserProfile;
    }

    return null;
};

const getWorkoutsList = (response: unknown): WorkoutInterface[] => {
    if (Array.isArray(response)) {
        return response as WorkoutInterface[];
    }

    if (!response || typeof response !== 'object') {
        return [];
    }

    const workoutsResponse = response as Record<string, unknown>;
    const candidateKeys = [
        'user_workouts_done',
        'user_workouts',
        'workouts'
    ];

    for (const key of candidateKeys) {
        const value = workoutsResponse[key];

        if (Array.isArray(value)) {
            return value as WorkoutInterface[];
        }
    }

    return [];
};

export default class AdminUsersController extends BaseController {
    adminUsersStore: AdminUsersStore;

    constructor(adminUsersStore: AdminUsersStore) {
        super();
        this.adminUsersStore = adminUsersStore;
    }

    @action
    getUsers(): void {
        new Get({ url: `${getApiBaseUrl()}/admin/users` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminUsersStore.setUserProfiles(res);
            });
    }

    @action
    getUserById(id:number): void {
        new Get({ url: `${getApiBaseUrl()}/admin/users/${id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminUsersStore.setUserProfile(res);
            });
    }

    @action
    async updateUser(id: number, userData: AdminUserUpdatePayload): Promise<AdminUserUpdateResponse> {
        try {
            const response = await new Patch({
                params: { user: userData },
                url: `${getApiBaseUrl()}/admin/users/${id}`,
            }).execute();
            const result = await response.json() as unknown;
            const updatedUser = getUpdatedUser(result);
            const responseRecord = isRecord(result) ? result : null;
            const ok = typeof responseRecord?.ok === 'boolean' ? responseRecord.ok : response.ok;
            const errors = getErrorMessages(responseRecord?.errors);

            if (ok && updatedUser) {
                this.adminUsersStore.setUserProfile(updatedUser);
                this.adminUsersStore.updateUserProfile(updatedUser);
            }

            return {
                errors,
                ok,
                user: updatedUser,
            };
        } catch (error) {
            return {
                errors: [error instanceof Error ? error.message : 'Unknown error'],
                ok: false,
            };
        }
    }

    @action
    sendEmail(id:number): void {
        new Get({ url: `${getApiBaseUrl()}/admin/users/${id}/resend_confirmation_instruction` }).execute();
    }

    @action
    confirm(id:number): void {
        new Get({ url: `${getApiBaseUrl()}/admin/users/${id}/confirm` }).execute();
    }

    @action
    getWorkoutsByUser(id: string): void {
        new Get({ url: `${getApiBaseUrl()}/admin/users/${id}/workouts` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminUsersStore.setWorkouts(res);
            });
    }

    @action
    getUserWorkoutsDoneByUser(id: string): void {
        new Get({ url: `${getApiBaseUrl()}/admin/users/${id}/workouts` }).execute()
            .then(async response => {
                if (!response.ok) {
                    return [];
                }

                const res = await response.json();

                return getWorkoutsList(res);
            })
            .then(workouts => {
                this.adminUsersStore.setUserWorkoutsDone(workouts);
            })
            .catch(() => {
                this.adminUsersStore.setUserWorkoutsDone([]);
            });
    }

    @action
    getPermissonsByUser(id: string): void {
        new Get({ url: `${getApiBaseUrl()}/admin/users/${id}/permissions` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminUsersStore.setPermissons(res);
            });
    }
}
