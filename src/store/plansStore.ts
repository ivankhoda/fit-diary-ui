/* eslint-disable no-magic-numbers */
import { action, computed, makeObservable, observable } from 'mobx';
import { WorkoutInterface } from './workoutStore';
import { TrainingGoalInterface } from './trainingGoalsStore';

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
    coach_plan?: boolean
}
export default class PlansStore {
    constructor() {
        makeObservable(this);
    }

    @observable plans: PlanInterface[] = [];

    @observable currentPlan: PlanInterface | null = null;

    @computed
    get activePlans(): PlanInterface[] {
        return this?.plans?.filter(plan => !plan.is_completed);
    }

     @computed
    get activeStatusPlans(): PlanInterface[] {
        return this?.plans?.filter(plan => plan.status ==='active');
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
    updatePlan(updatedPlan: PlanInterface): void {
        this.plans = this.plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan);
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
}
