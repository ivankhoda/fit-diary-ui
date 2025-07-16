/* eslint-disable no-magic-numbers */
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Workout } from '../components/User/Stats/WorkoutsStats/WorkoutProgressGrid/WorkoutProgressGrid';
import { TrainingGoalInterface } from './trainingGoalsStore';

export interface UserMeasurement {
    id: number;
    weight: number;
    recorded_at: string;
}

export interface ExerciseStatistic {
    id: number;
    exerciseId: number;
    maxWeight: number;
    maxRepetitions: number;
    recordedAt: string;
}

export interface UserProfile {
    id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    telegram_username: string;
    phone_number: string;
    email: string;
    has_workouts: boolean;
    has_exercises: boolean;
    has_active_workout: boolean;
    active_plan: {
        has_active_plan: number;
        plan_id: number
    }
    has_coach_assigned_workouts: boolean;
    roles: string[];
    training_goal: TrainingGoalInterface
}

export interface PermissionProfile{
    id?: string;
    instance: string;
    can_assign: boolean;
    can_access: boolean;
    to_user: string
}

export interface Exercise {
    id: number;
    name: string;
    type_of_measurement: string;
    lastSession: {
        weight?: number;
        reps?: number;
        sets?: number;
        duration?: number;
        distance?: number;
        date: string;
    };
    progress: {
        date: string;
        progress_data: {
            weight?: number;
            reps?: number;
            duration?: number;
            distance?: number;
        };
    }[];
    personal_bests: {
        max_weight?: number;
        max_reps?: number;
        max_distance?: number;
        max_duration?: number;
    };
}

export interface ConsistencyMetrics {
    days_exercised_this_week: number;
    workout_streak: number;
}

export default class UserStore {
    constructor() {
        makeObservable(this);
    }

    @observable userProfile: UserProfile | null = null;

    @observable measurements: UserMeasurement[] = [];

    @observable exerciseStatistics: ExerciseStatistic[] = [];

    @observable weight: number | null = null;

    @observable workoutsStats: Workout[] =null;

    @observable userExercisesStats: Exercise[] = null;

    @observable permissions: PermissionProfile[] =[];

    @observable permissionsTypes: string[] =[];

    @observable usersWithPermissions: UserProfile[] = [];

    @observable userConsistencyStats: ConsistencyMetrics | null = null;
    @action
    setUserProfile(profile: UserProfile): void {
        this.userProfile = profile;
    }

    @action
    setWorkoutsStats(workouts: Workout[]): void {
        this.workoutsStats = workouts;
    }

    @action
    setUserExerciseStats(exercises: Exercise[], consistency: ConsistencyMetrics): void {
        this.userExercisesStats = exercises;
        this.userConsistencyStats = consistency;
    }

    @action
    addMeasurement(measurement: UserMeasurement): void {
        this.measurements.unshift(measurement);
    }

    @action
    deleteMeasurement(id: number): void {
        this.measurements = this.measurements.filter(m => m.id !== id);
    }

    @action
    setMeasurements(measurements: UserMeasurement[]): void {
        this.measurements = measurements;
    }

    @action
    addExerciseStatistic(statistic: ExerciseStatistic): void {
        this.exerciseStatistics.push(statistic);
    }

    @action
    setExerciseStatistics(statistics: ExerciseStatistic[]): void {
        this.exerciseStatistics = statistics;
    }

    @action
    setWeight(weight: number): void {
        this.weight = weight;
    }

    @action
    clearUserProfile(): void {
        this.userProfile = null;
    }

    @action
    clearMeasurements(): void {
        this.measurements = [];
    }

    @action
    clearExerciseStatistics(): void {
        this.exerciseStatistics = [];
    }

    @action
    clearUserData(): void {
        this.clearUserProfile();
        this.clearMeasurements();
        this.clearExerciseStatistics();
        this.weight = null;
    }

    @action
    setPermissions(permissions: PermissionProfile[]): void {
        this.permissions = permissions;
    }
    @action
    updatePermissions(permission: PermissionProfile): void {
        const permissionIndex = this.permissions.findIndex(p => p.id === permission.id);

        if (permissionIndex === -1) {
            this.addNewPermission(permission);
        } else {
            runInAction(() => {
                this.permissions[permissionIndex] = permission;
            });
        }
    }

    deletePermission(permissionId: string): void {
        const permissionIndex = this.permissions.findIndex(p => String(p.id) === String(permissionId));

        runInAction(() => {
            this.permissions.splice(permissionIndex, 1);
        });
    }

    @action
    addNewPermission(permission: PermissionProfile): void {
        this.permissions.push(permission);
    }

    @action
    setPermissionsTypes(types: string[]): void {
        this.permissionsTypes = types;
    }
}
