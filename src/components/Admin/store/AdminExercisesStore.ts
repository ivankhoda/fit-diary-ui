/* eslint-disable no-magic-numbers */
import { action, makeObservable, observable } from 'mobx';

export interface AdminExerciseProfile {
    id?: number;
    exercise_id?: number;
    name?: string;
    category?: string;
    difficulty?: string;
    muscle_groups?: string[];
    duration?: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
    weight?: string;
    distance?: string;
    repetitions?: number;
    type_of_measurement?: string;
    sets?: number
    order?: string
    comment?: string;
}
const NOT_FOUND = -1;

export default class AdminExercisesStore {
    constructor() {
        makeObservable(this);
    }

    @observable exercises: AdminExerciseProfile[] = [];

    @observable exercise: AdminExerciseProfile | null = null;

    @observable workoutExercises: AdminExerciseProfile[] = [];

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

    @action
    addWorkoutExercise(exercise: AdminExerciseProfile): void {
        this.workoutExercises.push(exercise);
    }

    @action
    addWorkoutExercises(exercises: AdminExerciseProfile[]): void {
        if(exercises) {
            this.workoutExercises = [...this.workoutExercises,...exercises];
        }
    }

    @action
    removeWorkoutExercise(exerciseId: number): void {
        this.workoutExercises = this.workoutExercises.filter(
            exercise => exercise.id !== exerciseId
        );
    }
    @action
    updateOrAddDraftWorkoutExercise(newExercise: AdminExerciseProfile): void {
        if (this.workoutExercises) {
            const index = this.workoutExercises.findIndex(ex => ex.id === newExercise.id);

            if (index === NOT_FOUND) {
                this.workoutExercises = [...this.workoutExercises, newExercise];
            } else {
                this.workoutExercises[index] = newExercise;
            }
        }
    }
}
