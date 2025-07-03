/* eslint-disable no-magic-numbers */
import { action, computed, makeObservable, observable } from 'mobx';

import { TrainingGoalInterface } from './CoachTrainingGoalsStore';
import { WorkoutInterface } from '../../../store/workoutStore';
import { UserProfile } from '../../../store/userStore';

export interface WorkoutDayInterface {
    id?: number;
    plan_id: number;
    workout_id?: number | null;
    new_workout?: { name: string } | null;
    week_day?: string | null;
    day_number?: number | null;
    scheduled_date?: string;
    position?: string;
    microcycle_id?:string;
    notes?: string;
    name?: string;
    date?: string;
    schedule_type?: string,
    workouts?: WorkoutInterface[],
    mode?: string
    created_at?:string
}

export interface PlanInterface {
    id?: number;
    user_id?: number;
    training_goal_id?: number;
    training_goal_name?: string;
    name: string;
    description?: string;
    start_date: string;
    end_date: string;
    workout_days_count?: number;
    created_at?: string;
    updated_at?: string;
    is_completed?: boolean;
    status?: string;
    workout_days?: WorkoutDayInterface[];
    training_goal?: TrainingGoalInterface
    current_workout_day?: WorkoutDayInterface;
    assigned_users?: UserProfile[];
}
export default class CoachPlansStore {
    constructor() {
        makeObservable(this);
    }

    @observable plans: PlanInterface[] = [];

    @observable plansForClient: PlanInterface[] = [];

    @observable currentPlan: PlanInterface | null = null;

    @computed
    get activePlans(): PlanInterface[] {
        return this.plans.filter(plan => !plan.is_completed);
    }

    @computed
    get completedPlans(): PlanInterface[] {
        return this.plans.filter(plan => plan.is_completed);
    }

    @action
    setPlans(plans: PlanInterface[]): void {
        this.plans = plans;
    }

    @action
    addPlan(plan: PlanInterface): void {
        this.plans = [...this.plans, plan];
    }

    @action
    updatePlan(plan: PlanInterface):void  {
        const idx = this.plans.findIndex(p => p.id === plan.id);

        if (idx >= 0) {
            this.plans[idx] = plan;
        } else {
            this.plans.push(plan);
        }

        if (this.currentPlan?.id === plan.id) {
            this.currentPlan = plan;
        }
    }

    @action
    deletePlan(planId: number): void {
        this.plans = this.plans.filter(plan => plan.id !== planId);
    }

    @action
    setCurrentPlan(plan: PlanInterface | null): void {
        this.currentPlan = plan;
    }

    @action
    clearPlanForm(): void {
        this.currentPlan = null;
    }

    @action
    addWorkoutDayToPlan(planId: number, day: WorkoutDayInterface): void {
        const plan = this.plans.find(p => p.id === planId);

        if (plan) {
            if (!plan.workout_days) {
                plan.workout_days = [];
            }
            plan.workout_days.push(day);
        }

        if (this.currentPlan?.id === planId) {
            if (!this.currentPlan.workout_days) {
                this.currentPlan.workout_days = [];
            }
            this.currentPlan.workout_days.push(day);
        }
    }

    @action
    updateWorkoutDayInPlan(planId: number, updatedDay: WorkoutDayInterface): void {
        const plan = this.plans.find(p => p.id === planId);

        if (plan && plan.workout_days) {
            const index = plan.workout_days.findIndex(day => day.id === updatedDay.id);

            if (index !== -1) {
                plan.workout_days[index] = updatedDay;
            }
        }

        if (this.currentPlan?.id === planId && this.currentPlan.workout_days) {
            const index = this.currentPlan.workout_days.findIndex(day => day.id === updatedDay.id);

            if (index !== -1) {
                this.currentPlan.workout_days[index] = updatedDay;
            }
        }
    }

    @action
    removeWorkoutDayFromPlan(planId: number, dayId: number): void {
        const plan = this.plans.find(p => p.id === planId);

        if (plan && plan.workout_days) {
            plan.workout_days = plan.workout_days.filter(day => day.id !== dayId);
        }

        if (this.currentPlan?.id === planId && this.currentPlan.workout_days) {
            this.currentPlan.workout_days = this.currentPlan.workout_days.filter(day => day.id !== dayId);
        }
    }

    @action
    addPlanForClient(plan: PlanInterface): void {
        if (!this.plansForClient.find(w => w.id === plan.id)) {
            this.plansForClient.push(plan);
        }
    }

      @action
    removePlanForClient(planId: number): void {
        this.plansForClient = this.plansForClient.filter(w => w.id !== planId);
    }
}
