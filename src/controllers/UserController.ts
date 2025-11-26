import { NOT_CHANGE_RESPONSE_CODE, UNAUTHORIZED_RESPONSE_CODE } from './../components/Common/constants';

/* eslint-disable max-statements */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CachedUserProfile, PermissionProfile } from './../store/userStore';
import { action } from 'mobx';
import UserStore from '../store/userStore';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import Delete from '../utils/DeleteRequest';
import getApiBaseUrl from '../utils/apiUrl';
import { toast } from 'react-toastify';

import { cacheService } from '../services/cacheService';

export default class UserController extends BaseController {
    userStore: UserStore;

    constructor(userStore: UserStore) {
        super();
        this.userStore = userStore;
    }

    @action
    async login(credentials: { email: string; password: string }): Promise<boolean> {
        try {
            const cachedEtag = await cacheService.getVersion('current_user');
            const response = await fetch(`${getApiBaseUrl()}/users/sign_in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(cachedEtag ? { 'If-None-Match': cachedEtag } : {}),
                },
                body: JSON.stringify({ user: credentials }),
            });

            if (response.status === NOT_CHANGE_RESPONSE_CODE) {
                const cached = await cacheService.get<CachedUserProfile>('current_user');

                if (cached) {
                    this.userStore.setUserProfile(cached);
                    return true;
                }
                throw new Error('No cached user found');
            }

            const data = await response.json();

            if (!response.ok) {
                return false;
            }

            if (data.user && data.jwt) {
                const userToCache = { ...data.user, jwt: data.jwt };
                await cacheService.set('current_user', userToCache, response.headers.get('etag') || null);
                this.userStore.setUserProfile(data.user);
                this.userStore.setCurrentUser(data.user);
                localStorage.setItem('token', data.jwt);
                localStorage.setItem('refresh_token', data.refresh_token);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    @action
    async refreshAccessToken(): Promise<boolean> {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {return false;}

        try {
            const response = await fetch(`${getApiBaseUrl()}/users/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
            });

            const data = await response.json();

            if (response.ok && data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                return true;
            }
            this.logout();
            return false;
        } catch (err) {
            console.error('Failed to refresh access token', err);
            return false;
        }
    }

    @action
    logout(): void {
        this.userStore.clearUserData();
        cacheService.clear('current_user');
        localStorage.removeItem('token');
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
    getUserFromCache(): CachedUserProfile | null {
        const cached = localStorage.getItem('current_user');

        if (cached) {
            return JSON.parse(cached) as CachedUserProfile;
        }
        return null;
    }

    @action
    async restoreCurrentUser(): Promise<void> {
        const token = localStorage.getItem('token');

        if (!token) {
            this.userStore.setUserProfile(null);
            return;
        }

        const cached = await cacheService.get<CachedUserProfile>('current_user');

        if (cached) {
            this.userStore.setUserProfile(cached);
            this.userStore.setCurrentUser(cached);
        }

        try {
            const etag = await cacheService.getVersion('current_user');

            const response = await fetch(`${getApiBaseUrl()}/users/current`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(etag ? { 'If-None-Match': etag } : {})
                }
            });

            if (response.status === NOT_CHANGE_RESPONSE_CODE) {
                return;
            }

            if (response.status === UNAUTHORIZED_RESPONSE_CODE) {
                localStorage.removeItem('token');
                await cacheService.clear('current_user');
                this.userStore.setUserProfile(null);
                return;
            }

            if (response.ok) {
                const user = await response.json();
                await cacheService.set('current_user', user, response.headers.get('etag'));
                this.userStore.setUserProfile(user);
            }
        } catch (err) {
            console.error('restoreCurrentUser error', err);
        }
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
            return { ok: false, errors: [error?.message] };
        }
    }

    @action
    async deleteUser(): Promise<void> {
        try {
            const response = await new Delete({
                url: `${getApiBaseUrl()}/users/destroy`,
            }).execute();

            const result = await response.json();

            if (result.ok) {
                toast.success('Вы успешно деактивировали профиль');
                this.userStore.setUserProfile(null);
                localStorage.removeItem('token');

                window.location.reload();
            }
        } catch (error) {
            toast.error('Произошла ошибка, попробуйте позже, либо напишите нам.');
        }
    }

    async generateCoachLinkCode(): Promise<{ ok: boolean; code?: string; errors?: string[] }> {
        try {
            const response = await new Post({url: `${getApiBaseUrl()}/users/generate_link_code`}).execute();

            const result = await response.json();

            return result;
        } catch (error) {
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
