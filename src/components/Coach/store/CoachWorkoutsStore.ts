// Store/coachWorkoutsStore.ts

import { makeObservable, observable, action } from 'mobx';
import { UserProfile } from '../../../store/userStore';
import { WorkoutInterface } from '../../../store/workoutStore';

export interface CoachWorkoutInterface extends WorkoutInterface {
  name: string;
  description?: string;
  users?: UserProfile[];
}

export default class CoachWorkoutsStore {
    constructor() {
        makeObservable(this);
    }

  @observable
  workouts: CoachWorkoutInterface[] = [];

  @observable
  selectedWorkout: CoachWorkoutInterface | null = null;

  @observable
  draftWorkout: CoachWorkoutInterface | null = null;

  @observable
  archivedWorkouts: CoachWorkoutInterface[] = [];

  @observable
  workoutsForClient: CoachWorkoutInterface[] = [];

  @action
  setWorkouts(workouts: CoachWorkoutInterface[]): void {
      this.workouts = workouts;
  }

  @action
  setArchivedWorkouts(workouts: CoachWorkoutInterface[]): void {
      this.archivedWorkouts = workouts;
  }

  @action
  setWorkoutsForClient(workouts: CoachWorkoutInterface[]): void {
      this.workoutsForClient = workouts;
  }

  @action
  addWorkoutForClient(workout: CoachWorkoutInterface): void {
      if (!this.workoutsForClient.find(w => w.id === workout.id)) {
          this.workoutsForClient.push(workout);
      }
  }

    @action
  removeWorkoutForClient(workoutId: number): void {
      this.workoutsForClient = this.workoutsForClient.filter(w => w.id !== workoutId);
  }

  @action
    setSelectedWorkout(workout: CoachWorkoutInterface): void {
        this.selectedWorkout = workout;
    }

  @action
  setDraftWorkout(workout: CoachWorkoutInterface): void {
      this.draftWorkout = workout;
  }

  @action
  addWorkout(workout: CoachWorkoutInterface): void {
      this.workouts.push(workout);
  }

  @action
  updateWorkout(updated: CoachWorkoutInterface): void {
      this.workouts = this.workouts.map(w => w.id === updated.id ? updated : w);
  }

  @action
  deleteWorkout(id: number): void {
      this.workouts = this.workouts.filter(w => w.id !== id);
  }

  @action
  archiveWorkout(workout: CoachWorkoutInterface): void {
      workout.deleted = true;
      this.archivedWorkouts.push(workout);
      this.workouts = this.workouts.filter(w => w.id !== workout.id);
  }

  @action
  unarchiveWorkout(id: number): void {
      const index = this.archivedWorkouts.findIndex(w => w.id === id);

      // eslint-disable-next-line no-magic-numbers
      if (index !== -1) {
          const [restored] = this.archivedWorkouts.splice(index, 1);
          restored.deleted = false;
          this.workouts.push(restored);
      }
  }

  @action
  changeDraftWorkoutName(name: string): void {
      if (this.draftWorkout) {
          this.draftWorkout.name = name;
      }
  }

  @action
  updateWorkoutExercisesOrder(workoutId: number | string, updatedExercises: WorkoutInterface['workout_exercises']): void {
      const workout = this.workouts.find(w => w.id === workoutId);

      if (!workout) {return;}
      workout.workout_exercises = updatedExercises;
  }

  @action
  updateOrAddDraftWorkoutExercise(newExercise: WorkoutInterface['workout_exercises'][number]): void {
      if (!this.draftWorkout) {return;}

      // eslint-disable-next-line no-magic-numbers
      const index = this.draftWorkout.workout_exercises?.findIndex(ex => ex.id === newExercise.id) ?? -1;

      // eslint-disable-next-line no-magic-numbers
      if (index === -1) {
          this.draftWorkout.workout_exercises = [...(this.draftWorkout.workout_exercises ?? []), newExercise];
      } else {
          this.draftWorkout.workout_exercises[index] = newExercise;
      }
  }

  @action
  deleteDraftWorkoutExercise(exerciseId: number): void {
      if (this.draftWorkout && this.draftWorkout.workout_exercises) {
          this.draftWorkout.workout_exercises = this.draftWorkout.workout_exercises.filter(ex => ex.id !== exerciseId);
      }
  }
}
