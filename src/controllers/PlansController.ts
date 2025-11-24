/* eslint-disable max-statements */
import { action } from 'mobx';
import { BaseController } from './BaseController';
import getApiBaseUrl from '../utils/apiUrl';
import Get from '../utils/GetRequest';
import Post from '../utils/PostRequest';
import Patch from '../utils/PatchRequest';
import Delete from '../utils/DeleteRequest';

import PlansStore, { PlanInterface, WorkoutDayInterface } from '../store/plansStore';
import { toast } from 'react-toastify';
import { NOT_CHANGE_RESPONSE_CODE } from '../components/Common/constants';
import { cacheService } from '../services/cacheService';

export type PlanFormData = Omit<PlanInterface, 'id' | 'progress_percentage' | 'created_at' | 'updated_at'>;

export default class PlansController extends BaseController {
    plansStore: PlansStore;

    constructor(plansStore: PlansStore) {
        super();
        this.plansStore = plansStore;
    }

    @action
    async getPlans(): Promise<void> {
        const cachedEtag = await cacheService.getVersion('plans');
        console.log('Cached ETag for plans:', cachedEtag);
        const response = await new Get({
            configurator: {
                headers: cachedEtag ? { 'If-None-Match': `${cachedEtag}` } : {}
            },
            url: `${getApiBaseUrl()}/plans`
        }).execute();
        console.log('Plans response status:', response.status);
        if (response.status === NOT_CHANGE_RESPONSE_CODE) {
            const cached = await cacheService.get<PlanInterface[]>('plans');
            console.log('Plans not changed, using cached data.', cached);
            if (cached) {
                this.plansStore.setPlans(cached);
                return;
            }
            throw new Error('No cached plans available');
        }

        const json = await response.json();

        const etag = response.headers.get('etag') || null;

        await cacheService.set('plans', json.plans, etag);
        this.plansStore.setPlans(json.plans);
    }

    @action
    async getPlanDetails(planId: number): Promise<void> {
        const cacheKey = `plan_${planId}`;
        const localPlan = await cacheService.get<PlanInterface>(cacheKey);
        console.log('Local plan from cache:', localPlan);
        if (localPlan) {
            this.plansStore.setCurrentPlan(localPlan);
        }

        const cachedEtag = await cacheService.getVersion(cacheKey);

        const response = await new Get({
            configurator: {
                headers: cachedEtag ? { 'If-None-Match': cachedEtag } : {}
            },
            url: `${getApiBaseUrl()}/plans/${planId}`
        }).execute();

        if (response.status === NOT_CHANGE_RESPONSE_CODE) {
            if (localPlan) {return;}
            throw new Error('No cached plan available');
        }

        const json = await response.json();

        if (!json.ok) {return;}

        const etag = response.headers.get('etag') || null;

        await cacheService.set(cacheKey, json.plan, etag);
        this.plansStore.setCurrentPlan(json.plan);
    }

    @action
    createPlan(planData: PlanFormData,  navigate?: (path: string) => void): void {
        new Post({
            params: { plan: planData },
            url: `${getApiBaseUrl()}/plans`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.plansStore.addPlan(res.res);
                    toast.success('План сохранен');
                    navigate(`/plans/${res.res.id}`);
                }
            })
            .catch(error => {
                console.error('Failed to create plan:', error);
            });
    }

    @action
    updatePlan(planId: number, planData: Partial<PlanFormData>): void {
        new Patch({
            params: { plan: planData },
            url: `${getApiBaseUrl()}/plans/${planId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.plansStore.updatePlan(res.plan);
                    toast.success('План сохранен');
                }
            })
            .catch(error => {
                console.error('Failed to update plan:', error);
            });
    }

    @action
    deletePlan(planId: number): void {
        new Delete({
            url: `${getApiBaseUrl()}/plans/${planId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.plansStore.deletePlan(planId);
                }
            })
            .catch(error => {
                console.error('Failed to delete plan:', error);
            });
    }

    @action
    completePlan(planId: number): void {
        new Patch({
            params: { plan: { completed_at: new Date().toISOString(), is_completed: true } },
            url: `${getApiBaseUrl()}/plans/${planId}/complete`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.plansStore.updatePlan(res.plan);
                }
            })
            .catch(error => {
                console.error('Failed to complete plan:', error);
            });
    }

    @action
    addWorkoutDayToPlan(planId: number, dayData: WorkoutDayInterface): void {
        new Post({
            params: { workout_day: dayData },
            url: `${getApiBaseUrl()}/plans/${planId}/workout_days`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.plansStore.addWorkoutDayToPlan(planId, res.workout_day);
                }
            })
            .catch(error => {
                console.error('Failed to add workout day:', error);
            });
    }

    @action
    updateWorkoutDay(planId: number, dayData: WorkoutDayInterface): void {
        new Patch({
            params: { workout_day: dayData },
            url: `${getApiBaseUrl()}/plans/${planId}/workout_days/${dayData.id}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.plansStore.updateWorkoutDayInPlan(planId, res.workout_day);
                } else {
                    console.error('Failed to update workout day:', res.error || res.message);
                }
            })
            .catch(error => {
                console.error('Failed to update workout day:', error);
            });
    }

    @action
    deleteWorkoutDay(planId: number, dayId: number): void {
        new Delete({
            url: `${getApiBaseUrl()}/plans/${planId}/workout_days/${dayId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.plansStore.removeWorkoutDayFromPlan(planId, dayId);
                }
            })
            .catch(error => {
                console.error('Failed to delete workout day:', error);
            });
    }
}
