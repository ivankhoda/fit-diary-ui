/* eslint-disable @typescript-eslint/no-explicit-any */
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
    first_name: string;
    last_name: string;
    telegram_username?: string;
    phone_number?: string;
    email: string;
    has_workouts: boolean;
    has_exercises: boolean;
    has_active_workout: boolean;
    active_plan: {
        has_active_plan: boolean;
        plan_id?: number;
    };
    has_coach_assigned_workouts: boolean;
    roles: string[];
    exercises?: any[];
    assigned_workouts?: any[];
    plans?: any[];
    [key: string]: any;
    training_goal?: TrainingGoalInterface
}

export interface CachedUserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  telegram_username?: string;
  phone_number?: string;
  email: string;
  has_workouts: boolean;
  has_exercises: boolean;
  has_active_workout: boolean;
  active_plan: {
    has_active_plan: boolean;
    plan_id?: number;
  };
  has_coach_assigned_workouts: boolean;
  roles: string[];
  exercises?: any[];
  assigned_workouts?: any[];
  plans?: any[];
  [key: string]: any;
}

export interface PermissionProfile{
    id?: string;
    instance: string;
    can_assign: boolean;
    can_access: boolean;
    to_user: string
}

type UserProfileLike = UserProfile | CachedUserProfile;

const normalizeUserRoles = <T extends UserProfileLike>(profile: T): T => {
    let rolesSource: unknown[] = [];

    if (Array.isArray(profile.roles)) {
        rolesSource = profile.roles;
    } else if (typeof profile.role === 'string') {
        rolesSource = [profile.role];
    }

    return {
        ...profile,
        roles: rolesSource.filter((role): role is string => typeof role === 'string' && role.length > 0),
    };
};

export type ExerciseMeasurementType =
    'weight_and_reps'
    | 'reps'
    | 'duration'
    | 'duration_and_reps'
    | 'cardio'
    | 'duration_and_distance';

export interface PersonalBestMetric {
    value: number | string;
}

export interface PersonalBests {
    [key: string]: PersonalBestMetric | undefined;
    date?: PersonalBestMetric;
    distance?: PersonalBestMetric;
    duration?: PersonalBestMetric;
    estimated_1rm?: PersonalBestMetric;
    max_speed?: PersonalBestMetric;
    reps?: PersonalBestMetric;
    weight?: PersonalBestMetric;
}

export interface Exercise {
    id: number;
    name: string;
    type_of_measurement: ExerciseMeasurementType;
    lastSession: {
        date: string;
        distance?: number;
        duration?: number;
        reps?: number;
        sets?: number;
        weight?: number;
    };
    progress: {
        date: string;
        progress_data: {
            distance?: number;
            duration?: number;
            reps?: number;
            weight?: number;
        };
    }[];
    personal_bests: PersonalBests;
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

    @observable currentUser: UserProfile | null = null;

    @observable measurements: UserMeasurement[] = [];

    @observable exerciseStatistics: ExerciseStatistic[] = [];

    @observable weight: number | null = null;

    @observable workoutsStats: Workout[] =null;

    @observable userExercisesStats: Exercise[] = null;

    @observable permissions: PermissionProfile[] =[];

    @observable permissionsTypes: string[] =[];

    @observable usersWithPermissions: UserProfile[] = [];

    @observable userConsistencyStats: ConsistencyMetrics | null = null;

    @observable exerciseStatsRefreshState: 'idle' | 'refreshing' = 'idle';

    @action
    setCurrentUser(profile: UserProfile): void {
        this.currentUser = normalizeUserRoles(profile);
    }

    @action
    setUserProfile(profile: UserProfile | null): void {
        this.userProfile = profile ? normalizeUserRoles(profile) : null;
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
    setExerciseStatsRefreshState(state: 'idle' | 'refreshing'): void {
        this.exerciseStatsRefreshState = state;
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
        this.currentUser = null;
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
