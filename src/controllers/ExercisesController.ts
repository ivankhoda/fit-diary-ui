import { action } from 'mobx';
import ExercisesStore, { ExerciseInterface } from '../store/exercisesStore';
import WorkoutsStore from '../store/workoutStore';
import Delete from '../utils/DeleteRequest';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import getApiBaseUrl from '../utils/apiUrl';
import { ExerciseFormData } from '../components/User/Exercises/ExerciseModal/ExerciseModal';

export default class ExercisesController extends BaseController {
    // eslint-disable-next-line max-params
    exerciseStore: ExercisesStore;
    workoutsStore: WorkoutsStore;
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(exerciseStore: ExercisesStore, workoutsStore: WorkoutsStore) {
        super();
        this.exerciseStore = exerciseStore;
        this.workoutsStore = workoutsStore;
    }

    @action
    getExercises(): void {
        new Get({url: `${getApiBaseUrl()}/exercises`}).execute()
            .then(r => r.json())
            .then(res =>{
                this.exerciseStore.setGeneralExercises(res.res);});
    }

      @action
    getPublicExercises(): void {
        new Get({url: `${getApiBaseUrl()}/exercises/public`}).execute()
            .then(r => r.json())
            .then(res =>{
                console.log('Public exercises fetched:', res);
                this.exerciseStore.setGeneralExercises(res.res);});
    }

    @action
      getExercise(id: string): void {
          new Get({url: `${getApiBaseUrl()}/exercises/${id}`}).execute()
              .then(r => r.json())
              .then(res => this.exerciseStore.setGeneralExercise(res.res));
      }

    @action
    getWorkoutExercises(workout_id: number): void {
        new Get({params: {workout_id}, url: `${getApiBaseUrl()}/workout_exercises`}).execute()
            .then(r => r.json())
            .then(res => this.exerciseStore.setWorkoutExercises(res));
    }

    @action
    getFilteredExercises(name: string): void {
        if(name.length > 0) {
            new Get({params: {name}, url: `${getApiBaseUrl()}/exercises/search`}).execute()
                .then(r => r.json())
                .then(res => {
                    this.exerciseStore.setFilteredExercises(res);});
        }
    }

    @action
    createExercise(data?: ExerciseFormData): void {
        new Post({params: {exercise: data}, url: `${getApiBaseUrl()}/exercises`}).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok){
                    this.exerciseStore.addGeneralExercise(res.res);}
            });
    }

    @action
    updateExercise(id: string, data?: ExerciseFormData): void {
        new Patch({params: {exercise: data}, url: `${getApiBaseUrl()}/exercises/${id}`}).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok){
                    this.exerciseStore.updateGeneralExercise(res.res);}
            });
    }

    @action
    deleteExercise(id: number): void {
        new Delete({params: {exercise: {id}}, url: `${getApiBaseUrl()}/exercises/${id}`}).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok){
                    this.exerciseStore.deleteGeneralExercise(res.res);}
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
                    url: `${getApiBaseUrl()}/workout_exercises`,
                }).execute()
                    .then(r => r.json())
                    .then(res => {
                        this.exerciseStore.addWorkoutExercise(res);
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
                url: `${getApiBaseUrl()}/workout_exercises/${id}`,
            }).execute()
                .then(r => r.json())
                .then(res => {
                    this.exerciseStore.deleteWorkoutExercise(res.id);
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
                url: `${getApiBaseUrl()}/workout_exercises/${params.id}`,
            }).execute()
                .then(r => r.json())
                .then(res => {
                    this.workoutsStore.updateOrAddDraftWorkoutExercise(res);
                    this.exerciseStore.updateWorkoutExercise(res);
                })
                .catch(error => {
                    console.error('Failed to edit workout exercise:', error);
                });
        } catch (error) {
            console.error('Error in editWorkoutExercise:', error);
        }
    }
}
