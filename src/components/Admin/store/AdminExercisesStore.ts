/* eslint-disable no-magic-numbers */
import { action, makeObservable, observable } from 'mobx';

export interface AdminExerciseProfile {
    id?: number;
    name?: string;
    category?: string;
    difficulty: string;
    muscle_groups?: number[];
    duration?: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
    weight?: string;
    repetitions?: string;
    sets?: string
}


export default class AdminExercisesStore {
    constructor() {
        makeObservable(this);
    }

    @observable exercises: AdminExerciseProfile[] = [];

    @observable exercise: AdminExerciseProfile | null = null;

    @action
    setExercises(exercises: AdminExerciseProfile[]): void {
        this.exercises = exercises;
    }

    @action
    setExercise(exercise: AdminExerciseProfile): void {
        this.exercise = exercise;
    }

    @action
    addExercise(exercise: AdminExerciseProfile): void {
        this.exercises.push(exercise);
    }

    @action
    updateExercise(updatedExercise: AdminExerciseProfile): void {
        const index = this.exercises.findIndex(exercise => exercise.id === updatedExercise.id);

        if (index !== -1) {
            this.exercises[index] = updatedExercise;
        }
    }

    @action
    deleteExercise(id: number): void {
        this.exercises = this.exercises.filter(exercise => exercise.id !== id);
    }
}
