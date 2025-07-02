/* eslint-disable no-alert */
import { action } from 'mobx';
import { BaseController } from '../../../controllers/BaseController';
import  { ExerciseInterface } from '../../../store/exercisesStore';
import getApiBaseUrl from '../../../utils/apiUrl';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Patch from '../../../utils/PatchRequest';
import Post from '../../../utils/PostRequest';
import { ExerciseFormData } from '../../Auth/LoginModal/LoginModal';
import CoachExercisesStore from '../store/CoachExercisesStore';
import CoachWorkoutsStore from '../store/CoachWorkoutsStore';

export default class CoachExercisesController extends BaseController {
    // eslint-disable-next-line max-params
    coachExerciseStore: CoachExercisesStore;
    coachWorkoutsStore: CoachWorkoutsStore;
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(coachExerciseStore: CoachExercisesStore, coachWorkoutsStore: CoachWorkoutsStore) {
        super();
        this.coachExerciseStore = coachExerciseStore;
        this.coachWorkoutsStore = coachWorkoutsStore;
    }

    @action
    getExercises(): void {
        new Get({url: `${getApiBaseUrl()}/coach/exercises`}).execute()
            .then(r => r.json())
            .then(res =>{
                this.coachExerciseStore.setGeneralExercises(res.res);});
    }

    @action
    getExercise(id: string): void {
        new Get({url: `${getApiBaseUrl()}/coach/exercises/${id}`}).execute()
            .then(r => r.json())
            .then(res => this.coachExerciseStore.setGeneralExercise(res.res));
    }

    @action
    getWorkoutExercises(workout_id: number): void {
        new Get({params: {workout_id}, url: `${getApiBaseUrl()}/coach/workout_exercises`}).execute()
            .then(r => r.json())
            .then(res => this.coachExerciseStore.setWorkoutExercises(res));
    }

    @action
    getFilteredExercises(name: string): void {
        if(name.length > 0) {
            new Get({params: {name}, url: `${getApiBaseUrl()}/coach/exercises/search`}).execute()
                .then(r => r.json())
                .then(res => {
                    this.coachExerciseStore.setFilteredExercises(res);});
        }
    }

    @action
    createExercise(data?: ExerciseFormData): void {
        new Post({params: {exercise: data}, url: `${getApiBaseUrl()}/coach/exercises`}).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok){
                    this.coachExerciseStore.addGeneralExercise(res.res);}
            });
    }

    @action
    updateExercise(id: string, data?: ExerciseFormData): void {
        new Patch({params: {exercise: data}, url: `${getApiBaseUrl()}/coach/exercises/${id}`}).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok){
                    this.coachExerciseStore.updateGeneralExercise(res.res);}
            });
    }

    @action
    deleteExercise(id: number): void {
        new Delete({params: {exercise: {id}}, url: `${getApiBaseUrl()}/coach/exercises/${id}`}).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok){
                    this.coachExerciseStore.deleteGeneralExercise(res.res);}
            });
    }

    @action
    addWorkoutExercise(workout_id: string, exercise_id: number): Promise<ExerciseInterface | null> {
        return new Promise((resolve, reject) => {
            try {
                const params = {
                    exercise_id,
                    workout_id,
                };

                new Post({
                    params: { workout_exercise: params },
                    url: `${getApiBaseUrl()}/coach/workout_exercises`,
                }).execute()
                    .then(r => r.json())
                    .then(res => {
                        this.coachExerciseStore.addWorkoutExercise(res);
                        resolve(res);
                    })
                    .catch(error => {
                        console.error('Failed to add workout exercise:', error);
                        reject(error);
                    });
            } catch (error) {
                console.error('Error in addWorkoutExercise:', error);
                reject(error);
            }
        });
    }

    @action
    deleteWorkoutExercise(id: number): void {
        try {
            const workoutExerciseParams = {
                id,
            };

            new Delete({
                params: { workout_exercise: workoutExerciseParams },
                url: `${getApiBaseUrl()}/coach/workout_exercises/${id}`,
            }).execute()
                .then(r => r.json())
                .then(res => {
                    this.coachExerciseStore.deleteWorkoutExercise(res.id);
                })
                .catch(error => {
                    console.error('Failed to delete workout exercise:', error);
                });
        } catch (error) {
            console.error('Error in deleteWorkoutExercise:', error);
        }
    }

    @action
    editWorkoutExercise(params: ExerciseInterface): void {
        try {
            new Patch({
                params: { workout_exercise: params },
                url: `${getApiBaseUrl()}/coach/workout_exercises/${params.id}`,
            }).execute()
                .then(r => r.json())
                .then(res => {
                    this.coachWorkoutsStore.updateOrAddDraftWorkoutExercise(res);
                    this.coachExerciseStore.updateWorkoutExercise(res);
                })
                .catch(error => {
                    console.error('Failed to edit workout exercise:', error);
                });
        } catch (error) {
            console.error('Error in editWorkoutExercise:', error);
        }
    }
}
