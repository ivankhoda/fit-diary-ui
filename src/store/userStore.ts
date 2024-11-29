/* eslint-disable no-magic-numbers */
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Workout } from '../components/User/Stats/WorkoutsStats/WorkoutProgressGrid/WorkoutProgressGrid';
import { Exercise } from '../components/User/Stats/WorkoutsStats/ExercisesStats/ExercisesStats';

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
    email: string;
}

export interface PermissionProfile{
    id?: string;
    instance: string;
    can_assign: boolean;
    can_access: boolean;
    to_user: string
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

    @action
    setUserProfile(profile: UserProfile): void {
        this.userProfile = profile;
    }

    @action
    setWorkoutsStats(workouts: Workout[]): void {
        this.workoutsStats = workouts;
    }

    @action
    setUserExerciseStats(exercises: Exercise[]): void {
        this.userExercisesStats = exercises;
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


        if (permissionIndex === -1) {
            console.log('Permission not found with id:', permissionId);
        } else {
            runInAction(() => {
                this.permissions.splice(permissionIndex, 1);
            });
        }
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
