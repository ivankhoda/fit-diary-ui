
import { action, makeObservable, observable } from 'mobx';
import { ExerciseInterface, SetInterface } from '../../../store/exercisesStore';
import { Exercise } from '../../User/Exercises/Exercises';

export interface CoachExercise  extends Exercise{
    public?: boolean
}

export default class CoachExercisesStore {
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
    addGeneralExercise(exercise: Exercise): void {
        this.generalExercises = [...this.generalExercises,exercise];
    }

    @action
    updateGeneralExercise(updatedExercise: Exercise): void {
        this.generalExercises = this.generalExercises.map(exercise =>
            exercise.id === updatedExercise.id ? updatedExercise : exercise);
    }

    @action
    deleteGeneralExercise(id: number): void {
        this.generalExercises = this.generalExercises.filter(exercise => exercise.id !== id);
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
    deleteWorkoutExercise(id: number): void {
        this.workoutExercises = this.workoutExercises.filter(e=> e.id !== id);
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
