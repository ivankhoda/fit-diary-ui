/* eslint-disable sort-keys */
import { action } from 'mobx';
import { BaseController } from '../../../controllers/BaseController';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Post from '../../../utils/PostRequest';
import AdminExercisesStore, { AdminExerciseProfile } from '../store/AdminExercisesStore';
import Patch from '../../../utils/PatchRequest';
import getApiBaseUrl from '../../../utils/apiUrl';

export default class AdminExercisesController extends BaseController {
    adminExercisesStore: AdminExercisesStore;

    constructor(adminExercisesStore: AdminExercisesStore) {
        super();
        this.adminExercisesStore = adminExercisesStore;
    }

    @action
    getExercises(): void {
        new Get({ url: `${getApiBaseUrl()}/admin/exercises` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.setExercises(res);
            });
    }

    @action
    getExerciseById(id: string): void {
        new Get({ url: `${getApiBaseUrl()}/admin/exercises/${id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.setExercise(res);
            });
    }

    @action
    addExercise(exercise: AdminExerciseProfile): void {
        new Post({ url: `${getApiBaseUrl()}/admin/exercises`, params: {exercise: JSON.stringify(exercise)} })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.addExercise(res);
            });
    }

    @action
    updateExercise(exercise: AdminExerciseProfile): void {
        new Patch({ url: `${getApiBaseUrl()}/admin/exercises/${exercise.id}`, params: {exercise} })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.updateExercise(res);
            });
    }

    @action
    createExercise(exercise: AdminExerciseProfile): void {
        new Post({ url: `${getApiBaseUrl()}/admin/exercises`, params: {exercise} })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminExercisesStore.addExercise(res);
            });
    }

    @action
    deleteExercise(id: number): void {
        new Delete({ url: `${getApiBaseUrl()}/admin/exercises/${id}` }).execute()
            .then(() => {
                this.adminExercisesStore.deleteExercise(id);
            });
    }
    @action
    addWorkoutExercise(workout_id: string, exercise_id: number): Promise<AdminExerciseProfile | null> {
        return new Promise((resolve, reject) => {
            try {
                const params = {
                    exercise_id,
                    workout_id,
                };

                new Post({
                    params: { workout_exercise: params },
                    url: `${getApiBaseUrl()}/admin/workout_exercises`,
                }).execute()
                    .then(r => r.json())
                    .then(res => {
                        this.adminExercisesStore.addWorkoutExercise(res);
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .finally(() => {
                        console.log('addWorkoutExercise operation completed.');
                    });
            } catch (error) {
                reject(error);
            }
        });
    }

    @action
    deleteWorkoutExercise(workout_exercise_id: number): void {
        try {
            new Delete({
                url: `${getApiBaseUrl()}/admin/workout_exercises/${workout_exercise_id}`,
            })
                .execute()
                .then(response => {
                    if (response.ok) {
                        this.adminExercisesStore.removeWorkoutExercise(workout_exercise_id);
                    } else {
                        console.error(`Failed to delete workout exercise with ID ${workout_exercise_id}:`, response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Failed to delete workout exercise:', error);
                });
        } catch (error) {
            console.error('Error in deleteWorkoutExercise:', error);
        }
    }

    @action
    editWorkoutExercise(params: AdminExerciseProfile): void {
        try {
            new Patch({
                params: { workout_exercise: params },
                url: `${getApiBaseUrl()}/workout_exercises/${params.id}`,
            }).execute()
                .then((r: Response) => r.json())
                .then(res => {
                    this.adminExercisesStore.updateOrAddDraftWorkoutExercise(res);
                })
                .catch(error => {
                    console.error('Failed to edit workout exercise:', error);
                });
        } catch (error) {
            console.error('Error in editWorkoutExercise:', error);
        }
    }
}
