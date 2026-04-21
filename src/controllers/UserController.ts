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
import {
    bootstrapSession,
    clearSession,
    getAccessToken,
    refreshSession,
    setSessionTokens,
} from '../services/authSession';
import { ExerciseStatsRefreshScheduler } from './exerciseStatsRefresh';

const AUTH_DEVICE_NAME = 'web';

type AuthResponse = {
    access_token?: string;
    errors?: string[];
    jwt?: string;
    refresh_token?: string;
    user?: CachedUserProfile;
};

export default class UserController extends BaseController {
    userStore: UserStore;
    private readonly exerciseStatsRefreshScheduler = new ExerciseStatsRefreshScheduler();

    constructor(userStore: UserStore) {
        super();
        this.userStore = userStore;
    }

    private async persistAuthenticatedSession(response: Response, data: AuthResponse): Promise<boolean> {
        const accessToken = data.jwt ?? data.access_token;

        if (!data.user || !accessToken || !data.refresh_token) {
            return false;
        }

        await cacheService.set('current_user', data.user, response.headers.get('etag'));
        this.userStore.setUserProfile(data.user);
        this.userStore.setCurrentUser(data.user);
        setSessionTokens({
            accessToken,
            refreshToken: data.refresh_token,
        });

        return true;
    }

    private clearLocalSession(): void {
        this.userStore.clearUserData();
        cacheService.clear('current_user');
        clearSession();
    }

    private buildDeviceHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'Device-Name': AUTH_DEVICE_NAME,
        };
    }

    @action
    scheduleExerciseStatsRefresh(): void {
        this.exerciseStatsRefreshScheduler.schedule(
            () => this.userStore.setExerciseStatsRefreshState('refreshing'),
            () => this.getUserExercisesStats(),
        );
    }

    @action
    async login(credentials: { email: string; password: string }): Promise<boolean> {
        try {
            const response = await fetch(`${getApiBaseUrl()}/users/sign_in`, {
                body: JSON.stringify({ user: credentials }),
                headers: {
                    ...this.buildDeviceHeaders(),
                },
                method: 'POST',
            });

            const data = await response.json() as AuthResponse;

            if (!response.ok) {
                return false;
            }

            return this.persistAuthenticatedSession(response, data);
        } catch {
            return false;
        }
    }

    @action
    async refreshAccessToken(): Promise<boolean> {
        const nextAccessToken = await refreshSession();

        if (!nextAccessToken) {
            this.logout();
        }

        return Boolean(nextAccessToken);
    }

    @action
    async loginWithTelegram(initData: string): Promise<boolean> {
        try {
            const response = await fetch(`${getApiBaseUrl()}/users/telegram_auth`, {
                body: JSON.stringify({ init_data: initData }),
                headers: {
                    ...this.buildDeviceHeaders(),
                },
                method: 'POST',
            });

            const data = await response.json() as AuthResponse;

            if (!response.ok) {
                return false;
            }

            return this.persistAuthenticatedSession(response, data);
        } catch {
            return false;
        }
    }

    @action
    async register(credentials: {
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<{ errors: string[]; success: boolean }> {
        try {
            const response = await fetch(`${getApiBaseUrl()}/users`, {
                body: JSON.stringify({ user: credentials }),
                headers: {
                    ...this.buildDeviceHeaders(),
                },
                method: 'POST',
            });
            const data = await response.json() as AuthResponse;

            if (!response.ok) {
                return { errors: data.errors || [], success: false };
            }

            const success = await this.persistAuthenticatedSession(response, data);

            return { errors: [], success };
        } catch {
            return { errors: [], success: false };
        }
    }

    @action
    async registerWithTelegram(initData: string): Promise<{ errors: string[]; success: boolean }> {
        try {
            const response = await fetch(`${getApiBaseUrl()}/users/telegram_register`, {
                body: JSON.stringify({ init_data: initData }),
                headers: {
                    ...this.buildDeviceHeaders(),
                },
                method: 'POST',
            });
            const data = await response.json() as AuthResponse;

            if (!response.ok) {
                return { errors: data.errors || [], success: false };
            }

            const success = await this.persistAuthenticatedSession(response, data);

            return { errors: [], success };
        } catch {
            return { errors: [], success: false };
        }
    }

    @action
    async loginWithTelegramWidget(initData: string): Promise<{ errors: string[]; success: boolean }> {
        try {
            const response = await fetch(`${getApiBaseUrl()}/users/telegram_widget_auth`, {
                body: JSON.stringify({ init_data: initData }),
                headers: {
                    ...this.buildDeviceHeaders(),
                },
                method: 'POST',
            });
            const data = await response.json() as AuthResponse;

            if (!response.ok) {
                return { errors: data.errors || [], success: false };
            }

            const success = await this.persistAuthenticatedSession(response, data);

            return { errors: [], success };
        } catch {
            return { errors: [], success: false };
        }
    }

    @action
    logout(): void {
        this.clearLocalSession();
    }

    @action
    getUser(): void {
        new Get({ url: `${getApiBaseUrl()}/users/current` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setUserProfile(res);
                this.userStore.setCurrentUser(res);
            });
    }

    @action
    async getUserFromCache(): Promise<CachedUserProfile | null> {
        const cached = await cacheService.get<CachedUserProfile>('current_user');

        if (cached) {
            this.userStore.setUserProfile(cached);
            this.userStore.setCurrentUser(cached);
            return cached;
        }

        return null;
    }

    @action
    async restoreCurrentUser(): Promise<void> {
        await bootstrapSession();

        const token = getAccessToken();

        if (!token) {
            this.userStore.clearUserData();
            return;
        }

        const cached = await cacheService.get<CachedUserProfile>('current_user');

        if (cached) {
            this.userStore.setUserProfile(cached);
            this.userStore.setCurrentUser(cached);
        }

        try {
            const etag = await cacheService.getVersion('current_user');
            const requestUser = (sessionToken: string): Promise<Response> => fetch(`${getApiBaseUrl()}/users/current`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    ...(etag ? { 'If-None-Match': etag } : {}),
                },
            });

            let response = await requestUser(token);

            if (response.status === UNAUTHORIZED_RESPONSE_CODE) {
                const refreshedAccessToken = await refreshSession();

                if (!refreshedAccessToken) {
                    this.logout();
                    return;
                }

                response = await requestUser(refreshedAccessToken);
            }

            if (response.status === NOT_CHANGE_RESPONSE_CODE) {
                return;
            }

            if (response.status === UNAUTHORIZED_RESPONSE_CODE) {
                this.logout();
            }

            if (response.ok) {
                const user = await response.json();
                await cacheService.set('current_user', user, response.headers.get('etag'));
                this.userStore.setUserProfile(user);
                this.userStore.setCurrentUser(user);
            }
        } catch {
            // Keep cached profile on transient restore failures.
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
            return { ok: false, errors: [error instanceof Error ? error.message : 'Unknown error'] };
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
                this.logout();

                window.location.reload();
            }
        } catch {
            toast.error('Произошла ошибка, попробуйте позже, либо напишите нам.');
        }
    }

    async generateCoachLinkCode(): Promise<{ ok: boolean; code?: string; errors?: string[] }> {
        try {
            const response = await new Post({ url: `${getApiBaseUrl()}/users/generate_link_code` }).execute();

            const result = await response.json();

            return result;
        } catch {
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
    getUserExercisesStats(): Promise<void> {
        return new Get({ url: `${getApiBaseUrl()}/users/exercise-statistics` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setUserExerciseStats(res.exercises, res.consistency);
            })
            .catch(() => Promise.resolve())
            .finally(() => {
                this.userStore.setExerciseStatsRefreshState('idle');
            });
    }

    @action
    addWeightMeasurement(weight: number, recorded_at: string): void {
        const params = { recorded_at, weight };
        new Post({ params: { measurement: params }, url: `${getApiBaseUrl()}/users/user_measurements` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.addMeasurement(res);
            });
    }

    @action
    deleteWeightMeasurement(id: number): void {
        const params = { id };
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
        new Post({ params: { permission }, url: `${getApiBaseUrl()}/permissions` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.updatePermissions(res);
                window.location.href = '/permissions';
            });
    }

    @action
    updatePermission(permission: PermissionProfile): void {
        new Patch({ params: { permission }, url: `${getApiBaseUrl()}/permissions` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.updatePermissions(res);
            });
    }

    @action
    deletePermission(permission: PermissionProfile): void {
        new Delete({ url: `${getApiBaseUrl()}/permissions/${permission.id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.deletePermission(res.res);
            });
    }
}
