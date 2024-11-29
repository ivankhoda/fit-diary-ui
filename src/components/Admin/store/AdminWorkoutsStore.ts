/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
import { action, makeObservable, observable } from 'mobx';
import { AdminExerciseProfile } from './AdminExercisesStore';

export interface AdminWorkoutProfile {
    id?: number;
    name: string;

    description?: string;
    exercises?: AdminExerciseProfile[];
    users?: string[];
    created_at?: string;
    updated_at?: string;
    creator?: string
}


export default class AdminWorkoutsStore {
    constructor() {
        makeObservable(this);
    }

    @observable workouts: AdminWorkoutProfile[] = [];

    @observable workout: AdminWorkoutProfile | null = null;

    @action
    setWorkouts(workouts: AdminWorkoutProfile[]): void {
        this.workouts = workouts;
    }

    @action
    setWorkout(workout: AdminWorkoutProfile): void {
        this.workout = workout;
    }

    @action
    addWorkout(workout: AdminWorkoutProfile): void {
        this.workouts.push(workout);
    }

    @action
    updateWorkout(updatedWorkout: AdminWorkoutProfile): void {
        const index = this.workouts.findIndex(workout => workout.id === updatedWorkout.id);

        if (index !== -1) {
            this.workouts[index] = updatedWorkout;
        }
    }

    @action
    deleteWorkout(id: number): void {
        this.workouts = this.workouts.filter(workout => workout.id !== id);
    }
}
