/* eslint-disable sort-keys */
import { action } from 'mobx';
import { BaseController } from '../../../controllers/BaseController';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Post from '../../../utils/PostRequest';
import AdminExercisesStore, { AdminExerciseProfile } from '../store/AdminExercisesStore';
import Patch from '../../../utils/PatchRequest';

export default class AdminExercisesController extends BaseController {
    adminExercisesStore: AdminExercisesStore;

    constructor(adminExercisesStore: AdminExercisesStore) {
        super();
        this.adminExercisesStore = adminExercisesStore;
    }

    @action
    getExercises(): void {
        new Get({ url: 'http://localhost:3000/admin/exercises' }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.setExercises(res);
            });
    }

    @action
    getExerciseById(id: string): void {
        new Get({ url: `http://localhost:3000/admin/exercises/${id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.setExercise(res);
            });
    }

    @action
    addExercise(exercise: AdminExerciseProfile): void {
        new Post({ url: 'http://localhost:3000/admin/exercises', params: {exercise: JSON.stringify(exercise)} })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.addExercise(res);
            });
    }

    @action
    updateExercise(exercise: AdminExerciseProfile): void {
        new Patch({ url: `http://localhost:3000/admin/exercises/${exercise.id}`, params: {exercise} })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.updateExercise(res);
            });
    }

    @action
    createExercise(exercise: AdminExerciseProfile): void {
        new Post({ url: 'http://localhost:3000/admin/exercises', params: {exercise} })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.addExercise(res);
            });
    }

    @action
    deleteExercise(id: number): void {
        new Delete({ url: `http://localhost:3000/admin/exercises/${id}` }).execute()
            .then(() => {
                this.adminExercisesStore.deleteExercise(id);
            });
    }
}
