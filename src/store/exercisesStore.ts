

import { action, makeObservable, observable } from 'mobx';
import { Exercise } from '../components/User/Exercises/Exercises';

export interface ExerciseInterface {
    id: number;
    name?: string;
    description?: string;
    sets?: number;
    repetitions?: number;
    weight?: number;
    image?: string;
    number_of_sets?: SetInterface[]
  }

export interface SetInterface {
    id: string;
    result: string
    repetitions: string;
    user_exercise_id: number;
  }


export default class ExercisesStore {
    constructor() {
        makeObservable(this);
    }

    @observable exercises: ExerciseInterface[] = [];

    @observable workoutExercises: ExerciseInterface[] = [];

    @observable filteredExercises: ExerciseInterface[] = [];

    @observable exerciseForWorkout: ExerciseInterface = null;

    @observable currentExercise: ExerciseInterface = null;

    @observable currentUserExercise: ExerciseInterface = null;

    @observable currentUserExerciseSets: SetInterface[] = [];


    @observable repetitions: number = null;

    @observable sets: number = null;

    @observable weight: number = null;

    @observable generalExercises: Exercise[] = [];
    @observable generalExercise: Exercise = null;

    @action
    setGeneralExercises(exercises: Exercise[]): void {
        this.generalExercises = exercises;
    }

    @action
    setGeneralExercise(exercise: Exercise): void {
        this.generalExercise = exercise;
    }



    @action
    setExercises(exercises: ExerciseInterface[]): void {
        this.exercises = exercises;
    }

    @action
    setWorkoutExercises(exercises: ExerciseInterface[]): void {
        this.workoutExercises = exercises;
    }

    @action
    addWorkoutExercise(exercise: ExerciseInterface): void {
        this.workoutExercises.push(exercise);
    }

    @action
    setCurrentExercise(exercise: ExerciseInterface): void {
        this.currentExercise = exercise;
    }

    @action
    setCurrentUserExercise(exercise: ExerciseInterface): void {
        this.currentUserExercise = exercise;
    }

    @action
    setCurrentUserExerciseSets(sets: SetInterface[]): void {
        this.currentUserExerciseSets = sets;
    }

    @action
    addCurrentUserExerciseSet(set: SetInterface): void {
        this.currentUserExerciseSets.push(set);
    }

    @action
    deleteWorkoutExercise(exercise: ExerciseInterface): void {
        this.workoutExercises = this.workoutExercises.filter(e=> e.id !== exercise.id);
    }

    @action
    updateWorkoutExercise(exercise: ExerciseInterface): void {
        this.workoutExercises = this.workoutExercises.map(e => e.id === exercise.id ? exercise : e);
    }


    @action
    setFilteredExercises(exercises: ExerciseInterface[]): void {
        this.filteredExercises = exercises;
    }
    @action
    setExerciseForWorkout(exercise: ExerciseInterface): void {
        this.exerciseForWorkout = exercise;
        this.filteredExercises =[];
    }

    @action
    setRepetitions(repetitions: number): void {
        this.repetitions = repetitions;
    }

    @action
    setSets(sets: number): void {
        this.sets = sets;
    }

    @action
    setWeight(weight: number): void {
        this.weight = weight;
    }

    @action
    clearExerciseForm(): void {
        this.exerciseForWorkout = null;
        this.setRepetitions(0);
        this.setSets(0);
        this.setWeight(0);
    }
}
