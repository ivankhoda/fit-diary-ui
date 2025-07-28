import { action } from 'mobx';

import CoachPlansStore, { PlanInterface, WorkoutDayInterface } from '../store/CoachPlansStore';
import { BaseController } from '../../../controllers/BaseController';
import getApiBaseUrl from '../../../utils/apiUrl';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Patch from '../../../utils/PatchRequest';
import Post from '../../../utils/PostRequest';
import { toast } from 'react-toastify';

export type PlanFormData = Omit<PlanInterface, 'id' | 'progress_percentage' | 'created_at' | 'updated_at'>;

export default class CoachPlansController extends BaseController {
    coachPlansStore: CoachPlansStore;

    constructor(coachPlansStore: CoachPlansStore) {
        super();
        this.coachPlansStore = coachPlansStore;
    }

    @action
    getPlans(): void {
        new Get({
            url: `${getApiBaseUrl()}/coach/plans`
        }).execute()
            .then(r => r.json())
            .then(res => {
                this.coachPlansStore.setPlans(res.plans);
            })
            .catch(error => {
                console.error('Failed to fetch plans:', error);
            });
    }

    @action
    getPlanDetails(planId: number): void {
        new Get({
            url: `${getApiBaseUrl()}/coach/plans/${planId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.setCurrentPlan(res.plan);
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
                    this.coachPlansStore.addPlan(res.res);
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
            url: `${getApiBaseUrl()}/coach/plans/${planId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.updatePlan(res.plan);
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
            url: `${getApiBaseUrl()}/coach/plans/${planId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.deletePlan(planId);
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
            url: `${getApiBaseUrl()}/coach/plans/${planId}/complete`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.updatePlan(res.plan);
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
            url: `${getApiBaseUrl()}/coach/plans/${planId}/workout_days`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.addWorkoutDayToPlan(planId, res.workout_day);
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
            url: `${getApiBaseUrl()}/coach/plans/${planId}/workout_days/${dayData.id}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.updateWorkoutDayInPlan(planId, res.workout_day);
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
            url: `${getApiBaseUrl()}/coach/plans/${planId}/workout_days/${dayId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.removeWorkoutDayFromPlan(planId, dayId);
                }
            })
            .catch(error => {
                console.error('Failed to delete workout day:', error);
            });
    }

    @action
    assignPlan(clientId: number, planId: number): void {
        new Post({
            params: {
                assignment: {
                    client_id: clientId,
                    plan_id: planId
                }
            },
            url: `${getApiBaseUrl()}/coach/plan_assignments`
        })
            .execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.updatePlan(res.plan);
                    this.coachPlansStore.addPlanForClient(res.plan);
                } else {
                    console.error('Ошибка назначения плана:', res.errors);
                }
            });
    }

    unassignPlan(clientId: number, planId: number): void {
        new Delete({
            params: {
                assignment: {
                    client_id: clientId,
                    plan_id: planId,
                }
            },
            url: `${getApiBaseUrl()}/coach/plan_assignments/destroy_by_assignment`
        })
            .execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachPlansStore.updatePlan(res.plan);
                    this.coachPlansStore.removePlanForClient(planId);
                } else {
                    console.error('Ошибка удаления назначения:', res.errors);
                }
            });
    }
}
