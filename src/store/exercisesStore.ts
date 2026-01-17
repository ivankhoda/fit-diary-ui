
import { action, makeObservable, observable } from 'mobx';

export interface ExerciseInterface {
    exercise_id?: number
    id?: number;
    uuid?: string;
    name?: string;
    description?: string;
    sets?: number;
    repetitions?: number;
    weight?: string;
    image?: string;
    number_of_sets?: SetInterface[]
    type_of_measurement?: string;
    distance?: string;
    duration?: number;
    formatted_duration?: string;
    started_at?: string;
    ended_at?: string;
    order?: string
    workout_exercise_id?: number;
    workout_id?: number;
    comment?: string;
    own?: boolean
  }

export interface WorkoutExerciseInterface extends ExerciseInterface {
    name?: string;
    exercise_id?: number
    workout_id?: number;
    order?: string;
    temp?: boolean;
    type_of_measurement?: string;
  }

export interface Exercise {
      uuid?: string;
      instanceId?: string;
      id: number;
      name: string;
      category: 'strength' | 'cardio' | 'flexibility' | 'balance';
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      type_of_measurement?: string
      description: string;
      duration: number;
      muscle_groups: string[];
      own?: boolean;
      coach_owned?: boolean
  }

export interface ExerciseFormData extends Exercise {

    created_at?: string;
    description: string;

    duration: number;
    id: number;
    muscle_groups: string[];
    type_of_measurement: string;
    name: string;
    updated_at?: string;
    public?: boolean
    uuid?: string;
    own?: boolean;
    temp?: boolean;
  }

export interface SetInterface {
    id: string;
    result: string;
    duration?: number;
    weight?: number;
    distance?: string;
    repetitions: string;
    user_exercise_id: number;
    formatted_duration?: string;
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
