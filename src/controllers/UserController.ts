import { PermissionProfile } from './../store/userStore';
import { action } from 'mobx';
import UserStore from '../store/userStore';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import Delete from '../utils/DeleteRequest';

export default class UserController extends BaseController {
    userStore: UserStore;

    constructor(userStore: UserStore) {
        super();
        this.userStore = userStore;
    }

    @action
    getUser(): void {
        new Get({ url: 'http://localhost:3000/api/users/current' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setUserProfile(res);
            });
    }


    @action
    updateUser(userData: { username?: string; email?: string }): void {
        new Patch({ params: { user: userData }, url: `http://localhost:3000/api/users/${this.userStore.userProfile.id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setUserProfile(res);
            });
    }


    @action
    getUserWorkoutStats(): void {
        new Get({ url: 'http://localhost:3000/api/users/users-statistics' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setWorkoutsStats(res);
            });
    }

    @action
    getUserExercisesStats(): void {
        new Get({ url: 'http://localhost:3000/api/users/exercise-statistics' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setUserExerciseStats(res);
            });
    }

    @action
    addWeightMeasurement(weight: number, recorded_at: string): void {
        const params = { recorded_at,  weight };
        new Post({ params: { measurement: params }, url: 'http://localhost:3000/api/users/user_measurements' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.addMeasurement(res);
            });
    }

    @action
    deleteWeightMeasurement(id: number): void {
        const params = { id};
        new Delete({ params: { measurement: params }, url: `http://localhost:3000/api/users/user_measurements/${id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.deleteMeasurement(res.id);
            });
    }


    @action
    getWeightMeasurements(): void {
        new Get({ url: 'http://localhost:3000/api/users/user_measurements' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setMeasurements(res);
            });
    }

    // Fetch exercise statistics
    @action
    getExerciseStatistics(): void {
        new Get({ url: 'http://localhost:3000/api/user_exercise_statistics' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setExerciseStatistics(res);
            });
    }

    @action
    getPermissions(): void {
        new Get({ url: 'http://localhost:3000/api/permissions' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setPermissions(res.res);
            });
    }

    @action
    getPermissionTypes(): void {
        new Get({ url: 'http://localhost:3000/api/permissions/types' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.setPermissionsTypes(res.res);
            });
    }

    @action
    createPermission(permission: PermissionProfile): void {
        new Post({ params: {permission} , url: 'http://localhost:3000/api/permissions' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.updatePermissions(res);
                window.location.href = '/me/permissions';
            });
    }

    @action
    updatePermission(permission: PermissionProfile): void {
        new Patch({ params: {permission} , url: 'http://localhost:3000/api/permissions' }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.updatePermissions(res);
            });
    }

    @action
    deletePermission(permission: PermissionProfile): void {
        new Delete({url: `http://localhost:3000/api/permissions/${permission.id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.userStore.deletePermission(res.res);
            });
    }
}
