import { action } from 'mobx';
import ExercisesStore, { ExerciseInterface } from '../store/exercisesStore';
import WorkoutsStore from '../store/workoutStore';
import Delete from '../utils/DeleteRequest';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';


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
        new Get({url: 'http://localhost:3000/exercises'}).execute()
            .then(r => r.json())
            .then(res =>{
                this.exerciseStore.setGeneralExercises(res.res);});
    }

    @action
    getExercise(id: string): void {
        new Get({url: `http://localhost:3000/exercises/${id}`}).execute()
            .then(r => r.json())
            .then(res => this.exerciseStore.setGeneralExercise(res.res));
    }

    @action
    getWorkoutExercises(workout_id: number): void {
        new Get({params: {workout_id}, url: 'http://localhost:3000/workout_exercises'}).execute()
            .then(r => r.json())
            .then(res => this.exerciseStore.setWorkoutExercises(res));
    }

    @action
    getFilteredExercises(name: string): void {
        if(name.length > 0) {
            new Get({params: {name}, url: 'http://localhost:3000/exercises/search'}).execute()
                .then(r => r.json())
                .then(res => {
                    this.exerciseStore.setFilteredExercises(res);});
        }
    }
    @action
    addWorkoutExercise(): void {
        const params = {exercise_id: this.exerciseStore.exerciseForWorkout.id,
            repetitions: this.exerciseStore.repetitions,
            sets: this.exerciseStore.sets,
            weight: this.exerciseStore.weight,
            workout_id: this.workoutsStore.draftWorkout.id};
        new Post({params: {workout_exercise: params}, url: 'http://localhost:3000/workout_exercises'}).execute()
            .then(r => r.json())
            .then(res => {
                this.exerciseStore.addWorkoutExercise(res);
                this.workoutsStore.updateOrAddDraftWorkoutExercise(res);
                this.exerciseStore.clearExerciseForm();
            });
    }

    @action
    deleteWorkoutExercise(id: number): void {
        new Delete({params: {workout_exercise: {id}}, url: `http://localhost:3000/workout_exercises/${id}`}).execute()
            .then(r => r.json())
            .then(res => {
                console.log(res);
                this.exerciseStore.deleteWorkoutExercise(res.workout_exercise);
                this.workoutsStore.deleteDraftWorkoutExercise(res.workout_exercise.id);});
    }

    @action
    editWorkoutExercise(params: ExerciseInterface): void {
        new Patch({params: {workout_exercise: params},
            url: `http://localhost:3000/workout_exercises/${params.id}`}).execute()
            .then(r => r.json())
            .then(res => this.workoutsStore.updateOrAddDraftWorkoutExercise(res));
    }
}
