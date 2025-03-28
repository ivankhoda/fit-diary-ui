import { action, makeObservable, observable } from 'mobx';
import { ExerciseInterface, SetInterface } from './exercisesStore';
import { UserProfile } from './userStore';
import { WorkoutSummaryProps } from '../components/User/workouts/WorkoutSummary/WorkoutSummary';

export interface WorkoutInterface {
    id?: number;
    name: string;
    description?: string;
    state?: string;
    date?: string;
    workout_exercises?: ExerciseInterface[];
    exercises?: ExerciseInterface[];
    user_exercises?: ExerciseInterface[];
    current_set?: SetInterface
    duration?: string
    users?: UserProfile[];
    creator_id?: number;
    created_at?: string;
    comment?: string;
  }

const NOT_FOUND = -1;
export default class WorkoutsStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    workouts: WorkoutInterface[] = [];

    @observable
    archivedWorkouts: WorkoutInterface[] = [];

    @observable
    draftWorkout: WorkoutInterface = null;

     @observable
    currentUserWorkout: WorkoutInterface = null;

    @observable
    summaryUserWorkout: WorkoutSummaryProps = null;

    @observable
    userWorkoutsDone: WorkoutInterface[] = [];

    @observable
    userWorkoutsInProgress: WorkoutInterface[] = [];

    @observable
    usersWithPermissions: UserProfile[] = null;

    @action
    setUsersWithPermissions(users: UserProfile[]): void {
        this.usersWithPermissions = users;
    }

    @action
    setUserWorkoutsDone(workouts: WorkoutInterface[]): void {
        this.userWorkoutsDone = workouts;
    }

    @action
    setUserWorkoutsInProgress(workouts: WorkoutInterface[]): void {
        this.userWorkoutsInProgress = workouts;
    }

    @action
    updateUserWorkoutsInProgress(id: number): void {
        const index = this.userWorkoutsInProgress.findIndex(workout => workout.id === id);
        const notFound = -1;

        if (index === notFound) {
            return;
        }
        this.userWorkoutsInProgress.splice(index, 1);
    }

    @action
    updateUserWorkoutsDone(updatedWorkout: WorkoutInterface): void {
        const index = this.userWorkoutsDone.findIndex(workout => workout.id === updatedWorkout.id);
        const notFound = -1;

        if (index === notFound) {
            return;
        }

        this.userWorkoutsDone[index] = updatedWorkout;
    }

    @action
    updateWorkouts(id: number): void {
        const index = this.workouts.findIndex(workout => workout.id === id);
        const notFound = -1;

        if (index === notFound) {
            return;
        }
        this.workouts.splice(index, 1);
    }

    @action
    updatArchivedWorkouts(updatedWorkout: WorkoutInterface): void {
        const index = this.userWorkoutsDone.findIndex(workout => workout.id === updatedWorkout.id);
        const notFound = -1;

        if (index === notFound) {
            return;
        }

        this.archivedWorkouts[index] = updatedWorkout;
    }

    @action
    setWorkouts(workouts: WorkoutInterface[]): void {
        this.workouts = workouts;
    }

     @action
    addWorkout(updatedWorkout: WorkoutInterface): void {
        const index = this.workouts.findIndex(workout => workout.id === updatedWorkout.id);
        const notFound = -1;

        if (index === notFound) {
            return;
        }
        this.workouts[index] = updatedWorkout;
    }

    @action
     setDraftWorkout(workout: WorkoutInterface): void {
         this.draftWorkout = workout;
     }

     @action
    setSummaryWorkout(workout: WorkoutSummaryProps): void {
        this.summaryUserWorkout = workout;
    }

     @action
     updateOrAddDraftWorkoutExercise(newExercise: ExerciseInterface): void {
         if (this.draftWorkout) {
             const index = this.draftWorkout.exercises.findIndex(ex => ex.id === newExercise.id);

             if (index === NOT_FOUND) {
                 this.draftWorkout.exercises = [...this.draftWorkout.exercises, newExercise];
             } else {
                 this.draftWorkout.exercises[index] = newExercise;
             }
         }
     }

    @action
     updateWorkoutExercisesOrder(workoutId: number | string, updatedExercises: ExerciseInterface[]): void {
         const workout = this.workouts.find(w => w.id === workoutId);

         if (!workout) {return;}

         workout.exercises = updatedExercises;
     }

    @action
    deleteDraftWorkoutExercise(exerciseId: number): void {
        if (this.draftWorkout) {
            this.draftWorkout.workout_exercises = this.draftWorkout.workout_exercises.filter(ex => ex.id !== exerciseId);
        }
    }

    @action
    changeDraftWorkoutName(name: string): void {
        this.draftWorkout.name = name;
    }

    @action
    setCurrentUserWorkout(workout: WorkoutInterface): void {
        this.currentUserWorkout = workout;
    }
    @action
    setCurrentUserWorkoutExercises(userExercises: ExerciseInterface[]): void {
        if (this.currentUserWorkout) {
            this.currentUserWorkout = {
                ...this.currentUserWorkout,
                user_exercises: userExercises
            };
        } else {
            console.error('No current user workout is set');
        }
    }

    @action
    setCurrentUserWorkoutSets(set: SetInterface): void {
        if (!this.currentUserWorkout) {
            console.error('No current user workout is set');
            return;
        }

        this.currentUserWorkout = {
            ...this.currentUserWorkout,
            user_exercises: this.currentUserWorkout.user_exercises.map(exercise => {
                if (exercise.id === set.user_exercise_id) {
                    return {
                        ...exercise,
                        number_of_sets: exercise.number_of_sets.some(s => s.id === set.id)
                            ? exercise.number_of_sets.map(s => s.id === set.id ? { ...s, ...set } : s)
                            : [...exercise.number_of_sets, set]
                    };
                }
                return exercise;
            })
        };

        this.currentUserWorkout.current_set = set;
    }

    @action
    deleteCurrentUserWorkoutSet(setId: string, userExerciseId: number): void {
        if (this.currentUserWorkout) {
            this.currentUserWorkout = {
                ...this.currentUserWorkout,
                user_exercises: this.currentUserWorkout.user_exercises.map(exercise => {
                    if (exercise.id === userExerciseId) {
                        return {
                            ...exercise,
                            number_of_sets: exercise.number_of_sets.filter(set => set.id !== setId)
                        };
                    }
                    return exercise;
                })
            };
        } else {
            console.error('No current user workout is set');
        }
    }
}
