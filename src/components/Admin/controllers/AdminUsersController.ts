import { action } from 'mobx';
import AdminUsersStore from '../store/AdminUsersStore';
import { BaseController } from '../../../controllers/BaseController';
import { WorkoutInterface } from '../../../store/workoutStore';

import Get from '../../../utils/GetRequest';
import getApiBaseUrl from '../../../utils/apiUrl';

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
