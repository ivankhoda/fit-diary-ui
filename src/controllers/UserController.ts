/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PermissionProfile } from './../store/userStore';
import { action } from 'mobx';
import UserStore from '../store/userStore';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import Delete from '../utils/DeleteRequest';
import getApiBaseUrl from '../utils/apiUrl';

export default class UserController extends BaseController {
    userStore: UserStore;

    constructor(userStore: UserStore) {
        super();
        this.userStore = userStore;
    }

    @action
    getUser(): void {
        new Get({ url: `${getApiBaseUrl()}/users/current` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setUserProfile(res);
            });
    }

    @action
    async updateUser(userData: {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  telegram_username?: string;
}): Promise<{ ok: boolean; user?: any; errors?: string[] }> {
        try {
            const response = await new Patch({
                url: `${getApiBaseUrl()}/users/update`,
                params: { user: userData },
            }).execute();

            const result = await response.json();

            if (result.ok && result?.user) {
                this.userStore.setUserProfile(result.user);
            }

            return result;
        } catch (error) {
            console.error('Unexpected error during user update:', error);
            return { ok: false, errors: [error?.message || 'Unexpected error'] };
        }
    }

    async generateCoachLinkCode(): Promise<{ ok: boolean; code?: string; errors?: string[] }> {
        try {
            const response = await new Post({url: `${getApiBaseUrl()}/users/generate_link_code`}).execute();

            const result = await response.json();

            return result;
        } catch (error) {
            console.error('Ошибка генерации кода:', error);
            return { ok: false, errors: ['Network error'] };
        }
    }

    @action
    getUserWorkoutStats(): void {
        new Get({ url: `${getApiBaseUrl()}/users/users-statistics` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setWorkoutsStats(res);
            });
    }

    @action
    getUserExercisesStats(): void {
        new Get({ url: `${getApiBaseUrl()}/users/exercise-statistics` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setUserExerciseStats(res.exercises, res.consistency);
            })
            .catch(error => {
                console.error('Failed to fetch user exercise statistics:', error);
            });
    }
    @action
    addWeightMeasurement(weight: number, recorded_at: string): void {
        const params = { recorded_at,  weight };
        new Post({ params: { measurement: params }, url: `${getApiBaseUrl()}/users/user_measurements` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.addMeasurement(res);
            });
    }

    @action
    deleteWeightMeasurement(id: number): void {
        const params = { id};
        new Delete({ params: { measurement: params }, url: `${getApiBaseUrl()}/users/user_measurements/${id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.deleteMeasurement(res.id);
            });
    }

    @action
    getWeightMeasurements(): void {
        new Get({ url: `${getApiBaseUrl()}/users/user_measurements` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setMeasurements(res);
            });
    }

    // Fetch exercise statistics
    @action
    getExerciseStatistics(): void {
        new Get({ url: `${getApiBaseUrl()}/user_exercise_statistics` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setExerciseStatistics(res);
            });
    }

    @action
    getPermissions(): void {
        new Get({ url: `${getApiBaseUrl()}/permissions` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setPermissions(res.res);
            });
    }

    @action
    getPermissionTypes(): void {
        new Get({ url: `${getApiBaseUrl()}/permissions/types` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setPermissionsTypes(res.res);
            });
    }

    @action
    createPermission(permission: PermissionProfile): void {
        new Post({ params: {permission} , url: `${getApiBaseUrl()}/permissions` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.updatePermissions(res);
                window.location.href = '/permissions';
            });
    }

    @action
    updatePermission(permission: PermissionProfile): void {
        new Patch({ params: {permission} , url: `${getApiBaseUrl()}/permissions` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.updatePermissions(res);
            });
    }

    @action
    deletePermission(permission: PermissionProfile): void {
        new Delete({url: `${getApiBaseUrl()}/permissions/${permission.id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.deletePermission(res.res);
            });
    }
}
