/* eslint-disable no-magic-numbers */
import { action, computed, makeObservable, observable } from 'mobx';

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
    schedule_type?: string;
    workouts?: WorkoutInterface[];
    mode?: string;
    created_at?:string;
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
    current_workout_day?: WorkoutDayInterface;
    assigned_users?: UserProfile[];
}

export default class PublicPlansStore {
    constructor() {
        makeObservable(this);
    }

    @observable plans: PlanInterface[] = [];

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
    setCurrentPlan(plan: PlanInterface | null): void {
        this.currentPlan = plan;
    }
}
