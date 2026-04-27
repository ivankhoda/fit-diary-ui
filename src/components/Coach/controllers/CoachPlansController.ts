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

type PlanAssignmentResponse = {
    error?: string;
    errors?: string[];
    ok?: boolean;
    plan?: PlanInterface;
};

const getAssignmentErrorMessage = (response: PlanAssignmentResponse, fallbackMessage: string): string => {
    if (response.error) {
        return response.error;
    }

    if (response.errors?.length) {
        return response.errors.join(', ');
    }

    return fallbackMessage;
};

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
            .catch(() => {
                toast.error('Не удалось загрузить планы');
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
            .catch(() => {
                toast.error('Не удалось загрузить детали плана');
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
            .catch(() => {
                toast.error('Не удалось создать план');
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
            .catch(() => {
                toast.error('Не удалось обновить план');
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
            .catch(() => {
                toast.error('Не удалось удалить план');
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
            .catch(() => {
                toast.error('Не удалось завершить план');
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
            .catch(() => {
                toast.error('Не удалось добавить тренировочный день');
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
                    toast.error(res.error || res.message || 'Не удалось обновить тренировочный день');
                }
            })
            .catch(() => {
                toast.error('Не удалось обновить тренировочный день');
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
            .catch(() => {
                toast.error('Не удалось удалить тренировочный день');
            });
    }

    @action
    async assignPlan(clientId: number, planId: number): Promise<boolean> {
        try {
            const response = await new Post({
                params: {
                    assignment: {
                        client_id: clientId,
                        plan_id: planId
                    }
                },
                url: `${getApiBaseUrl()}/coach/plan_assignments`
            }).execute();
            const result = await response.json() as PlanAssignmentResponse;

            if (!response.ok || !result.plan) {
                toast.error(getAssignmentErrorMessage(result, 'Не удалось назначить план'));
                return false;
            }

            this.coachPlansStore.updatePlan(result.plan);
            this.coachPlansStore.addPlanForClient(result.plan);
            return true;
        } catch {
            toast.error('Не удалось назначить план');
            return false;
        }
    }

    async unassignPlan(clientId: number, planId: number): Promise<boolean> {
        try {
            const response = await new Delete({
                params: {
                    assignment: {
                        client_id: clientId,
                        plan_id: planId,
                    }
                },
                url: `${getApiBaseUrl()}/coach/plan_assignments/destroy_by_assignment`
            }).execute();
            const result = await response.json() as PlanAssignmentResponse;

            if (!response.ok || !result.plan) {
                toast.error(getAssignmentErrorMessage(result, 'Не удалось удалить назначение плана'));
                return false;
            }

            this.coachPlansStore.updatePlan(result.plan);
            this.coachPlansStore.removePlanForClient(planId);
            return true;
        } catch {
            toast.error('Не удалось удалить назначение плана');
            return false;
        }
    }
}
