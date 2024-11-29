import { action, makeObservable, observable } from 'mobx';
import { AdminWorkoutProfile } from './AdminWorkoutsStore';


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
    created_at: string;
}

export interface AdminUserProfile extends UserProfile {
    role: string;
}

export interface AdminPermissionProfile{
    id: string;
    instance: string;
    can_assign: boolean;
    can_access: boolean;
    to_user: string
}

export default class AdminUsersStore {
    constructor() {
        makeObservable(this);
    }

    @observable userProfiles: AdminUserProfile[] = [];

    @observable userProfile: AdminUserProfile = null;

    @observable userWorkouts: AdminWorkoutProfile[] = [];

    @observable permissions: AdminPermissionProfile[] =[];

    @action
    setUserProfiles(profiles: AdminUserProfile[]): void {
        this.userProfiles = profiles;
    }

    @action
    setUserProfile(profile: AdminUserProfile): void {
        this.userProfile = profile;
    }


    @action
    addUserProfile(profile: AdminUserProfile): void {
        this.userProfiles.push(profile);
    }

    @action
    updateUserProfile(updatedProfile: AdminUserProfile): void {
        const index = this.userProfiles.findIndex(profile => profile.id === updatedProfile.id);

        // eslint-disable-next-line no-magic-numbers
        if (index !== -1) {
            this.userProfiles[index] = updatedProfile;
        }
    }

    @action
    deleteUserProfile(id: number): void {
        this.userProfiles = this.userProfiles.filter(profile => profile.id !== id);
    }

    @action
    setWorkouts(workouts: AdminWorkoutProfile[]): void {
        this.userWorkouts = workouts;
    }

    @action
    setPermissons(permissions: AdminPermissionProfile[]): void {
        this.permissions = permissions;
    }
}
