import { action } from 'mobx';
import { BaseController } from './BaseController';
import getApiBaseUrl from '../utils/apiUrl';
import Get from '../utils/GetRequest';
import Post from '../utils/PostRequest';
import Patch from '../utils/PatchRequest';
import Delete from '../utils/DeleteRequest';

import PlansStore, { PlanInterface, WorkoutDayInterface } from '../store/plansStore';

export type PlanFormData = Omit<PlanInterface, 'id' | 'progress_percentage' | 'created_at' | 'updated_at'>;

export default class PlansController extends BaseController {
    plansStore: PlansStore;

    constructor(plansStore: PlansStore) {
        super();
        this.plansStore = plansStore;
    }

    @action
    getPlans(): void {
        new Get({
            url: `${getApiBaseUrl()}/plans`
        }).execute()
            .then(r => r.json())
            .then(res => {
                this.plansStore.setPlans(res.plans);
            })
            .catch(error => {
                console.error('Failed to fetch plans:', error);
            });
    }

    @action
    getPlanDetails(planId: number): void {
        new Get({
            url: `${getApiBaseUrl()}/plans/${planId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.plansStore.setCurrentPlan(res.plan);
                }
            })
            .catch(error => {
                console.error('Failed to fetch plan details:', error);
            });
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
                    // eslint-disable-next-line no-alert
                    alert('План сохранен');
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
                    // eslint-disable-next-line no-alert
                    alert('План сохранен');
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
