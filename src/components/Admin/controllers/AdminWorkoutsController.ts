/* eslint-disable sort-keys */
import { action } from 'mobx';
import { BaseController } from '../../../controllers/BaseController';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Post from '../../../utils/PostRequest';
import AdminWorkoutsStore, { AdminWorkoutProfile } from '../store/AdminWorkoutsStore';
import Patch from '../../../utils/PatchRequest';
import { AdminExerciseProfile } from '../store/AdminExercisesStore';

export default class AdminWorkoutsController extends BaseController {
    adminWorkoutsStore: AdminWorkoutsStore;

    constructor(adminWorkoutsStore: AdminWorkoutsStore) {
        super();
        this.adminWorkoutsStore = adminWorkoutsStore;
    }

    @action
    getWorkouts(): void {
        new Get({ url: 'http://localhost:3000/admin/workouts' }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminWorkoutsStore.setWorkouts(res);
            });
    }

    @action
    getWorkoutById(id: string): void {
        new Get({ url: `http://localhost:3000/admin/workouts/${id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminWorkoutsStore.setWorkout(res);
            });
    }

    @action
    addWorkout(workout: AdminWorkoutProfile): void {
        new Post({ url: 'http://localhost:3000/admin/workouts', params: { workout: JSON.stringify(workout) } })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminWorkoutsStore.addWorkout(res);
            });
    }

    @action
    updateWorkout(id: string, workout: AdminWorkoutProfile): void {
        console.log(workout.description, 'workout params');
        new Patch({ url: `http://localhost:3000/admin/workouts/${id}`, params: { workout } })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminWorkoutsStore.updateWorkout(res);
            });
    }

    @action
    createWorkout(workout: {name: string, description: string, exercises: AdminExerciseProfile[], users: number[]}): void {
        new Post({ url: 'http://localhost:3000/admin/workouts', params: { workout } })
            .execute()
            .then(r => {console.log(r);
                return r.json();})
            .then(res => {
                this.adminWorkoutsStore.addWorkout(res);
            });
    }

    @action
    deleteWorkout(id: number): void {
        new Delete({ url: `http://localhost:3000/admin/workouts/${id}` }).execute()
            .then(() => {
                this.adminWorkoutsStore.deleteWorkout(id);
            });
    }
}
