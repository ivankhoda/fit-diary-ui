/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
import { action, makeObservable, observable } from 'mobx';
import { AdminExerciseProfile } from './AdminExercisesStore';
import { AdminUserProfile } from './AdminUsersStore';

export interface AdminWorkoutProfile {
    id?: number;
    name: string;

    description?: string;
    exercises?: AdminExerciseProfile[];
    users?: AdminUserProfile[];
    created_at?: string;
    updated_at?: string;
    creator?: string
}

const NOT_FOUND = -1;

export default class AdminWorkoutsStore {
    constructor() {
        makeObservable(this);
    }

    @observable workouts: AdminWorkoutProfile[] = [];

    @observable workout: AdminWorkoutProfile | null = null;

    @observable draftWorkout: AdminWorkoutProfile | null = null;

    @observable currentWorkout: AdminWorkoutProfile = null;

    @action
    setWorkouts(workouts: AdminWorkoutProfile[]): void {
        this.workouts = workouts;
    }

    @action
    setWorkout(workout: AdminWorkoutProfile): void {
        this.workout = workout;
    }

    @action
    setCurrentWorkout(workout: AdminWorkoutProfile): void {
        this.currentWorkout = workout;
    }

    @action
    setDraftWorkout(workout: AdminWorkoutProfile): void {
        this.draftWorkout = workout;
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

      @action
    updateOrAddDraftWorkoutExercise(newExercise: AdminExerciseProfile): void {
        if (this.workout) {
            const index = this.workout.exercises.findIndex(ex => ex.id === newExercise.id);

            if (index === NOT_FOUND) {
                this.draftWorkout.exercises = [...this.workout.exercises, newExercise];
            } else {
                this.draftWorkout.exercises[index] = newExercise;
            }
        }
    }

    @action
      updateDraftWorkout(updatedWorkout: AdminWorkoutProfile): void {
          if (this.draftWorkout && this.draftWorkout.id === updatedWorkout.id) {
              this.draftWorkout = updatedWorkout;
          }
      }
}
