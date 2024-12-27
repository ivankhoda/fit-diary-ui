
/* eslint-disable sort-keys */
/* eslint-disable no-alert */
import { action } from 'mobx';
import ExercisesStore, { ExerciseInterface } from '../store/exercisesStore';
import WorkoutsStore, { WorkoutInterface } from '../store/workoutStore';
import Get from '../utils/GetRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import Patch from '../utils/PatchRequest';
import Delete from '../utils/DeleteRequest';
import { UserProfile } from '../store/userStore';
import getApiBaseUrl from '../utils/apiUrl';



export interface AddExerciseParamsInterface {
    id?: number,
    repetitions: number,
    sets: number,
    weight: number,
    workout_id: number,
    exercise_id: number
}




export default class WorkoutController extends BaseController {
    // eslint-disable-next-line max-params
    workoutsStore: WorkoutsStore;
    exerciseStore: ExercisesStore;
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(workoutsStore: WorkoutsStore, exerciseStore: ExercisesStore) {
        super();
        this.workoutsStore = workoutsStore;
        this.exerciseStore = exerciseStore;
    }

  @action
    getWorkouts(): void {
        new Get({url: `${getApiBaseUrl()}/workouts`}).execute()
            .then(r => r.json())
            .then(res => this.workoutsStore.setWorkouts(res));
    }

    @action
  getWorkout(id: string): void {
      new Get({url: `${getApiBaseUrl()}/workouts/${id}`}).execute()
          .then(r => r.json())
          .then(res => {
              this.workoutsStore.setDraftWorkout(res.workout);});
  }

  @action
    getUserWorkout(id?: string): void {
        new Get({url: `${getApiBaseUrl()}/user_workouts/${id}`}).execute()
            .then(r => r.json())
            .then(res => {
                if(res.status === 'ok') {
                    this.workoutsStore.setCurrentUserWorkout(res.user_workout);
                    this.exerciseStore.setCurrentUserExercise(res.exercise);
                    res.exercise && this.exerciseStore.setCurrentUserExerciseSets(res.exercise.number_of_sets);
                }});
    }

  getUserWorkouts(): void {
      new Get({url: `${getApiBaseUrl()}/user_workouts`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status === 'ok') {
                  this.workoutsStore.setUserWorkoutsDone(res.user_workouts_done);
                  this.workoutsStore.setUserWorkoutsInProgress(res.user_workouts_in_progress);
              }});
  }


  @action
  initWorkout(name?: string): void {
      new Post({params: {workout: {name}}, url: `${getApiBaseUrl()}/workouts/initialize_draft`}).execute()
          .then(r => r.json())
          .then(res => {this.workoutsStore.setDraftWorkout(res);
              this.exerciseStore.setWorkoutExercises(res.exercises);});
  }

  @action
  deleteWorkout(id?: number): void {
      new Delete({params: {user_workout: {id}}, url: `${getApiBaseUrl()}/user_workouts/${id}`}).execute()
          .then(r => r.json())
          .then(res => {this.workoutsStore.updateUserWorkoutsInProgress(res.id);});
  }

  @action
  finishWorkout(id?: number): void {
      new Post({params: {user_workout: {id}}, url: `${getApiBaseUrl()}/user_workouts/finish_workout`}).execute()
          .then(r => r.json())
          .then(res => {
              this.workoutsStore.updateUserWorkoutsDone(res.user_workout);
              this.workoutsStore.updateUserWorkoutsInProgress(res.user_workout.id);
              this.workoutsStore.setCurrentUserWorkout(null);
          });
  }

  @action
  resumeWorkout(workout?: WorkoutInterface): void {
      new Post({params: {user_workout: {id: workout.id}}, url: `${getApiBaseUrl()}/user_workouts/resume_workout`}).execute()
          .then(r => r.json())
          .then(res => {
              this.workoutsStore.setCurrentUserWorkout(res.user_workout);
              if (window.location.pathname === '/me/workouts/in-progress') {
                  window.location.pathname = `/me/workout/${workout.id}`;
              }
          });
  }


  @action
  addExercise(params: AddExerciseParamsInterface): void {
      new Post({params: {workout_exercise: params}, url: `${getApiBaseUrl()}/workout_exercises`}).execute()
          .then(r => r.json())
          .then(res => this.exerciseStore.addWorkoutExercise(res));
  }

  @action
  saveWorkoutName(): void {
      const params = {
          id: this.workoutsStore.draftWorkout.id,
          name: this.workoutsStore.draftWorkout.name
      };
      new Post({params: {workout: params}, url: `${getApiBaseUrl()}/workouts/save`}).execute()
          .then(r => r.json())
          .then(res => {
              this.workoutsStore.addWorkout(res.workout);
              this.workoutsStore.setDraftWorkout(res.workout);
          });
  }



  @action
  async saveWorkout(newWorkout: {
    name: string;
    description?: string;
    exercises?: ExerciseInterface[];
    users?: UserProfile[];
  }, navigate: (path: string) => void): Promise<void> {
      try {
          const { name, description, exercises, users } = newWorkout;
          const payload = {
              workout: {
                  name,
                  description,
                  exercises: exercises || [],
                  users: users.map(user => user.id) || [],
              },
          };

          console.log(payload);
          const response = await new Post({
              params: payload,
              url: `${getApiBaseUrl()}/workouts/save`,
          }).execute();


          const result = await response.json();

          console.log(result);
          this.workoutsStore.addWorkout(result);


          navigate(`/me/workouts/${result.id}/edit`);
      } catch (error) {
          console.error('Failed to save workout:', error);
      }
  }


  @action
  async updateWorkout(id: string, newWorkout: WorkoutInterface): Promise<void> {
      try {
          const { name, description, exercises, users } = newWorkout;

          const payload = {
              workout: {
                  name,
                  description,
                  exercises: exercises || [],
                  users: users.map(user => user.id) || [],
              },
          };

          const response = await new Patch({
              params: payload,
              url: `${getApiBaseUrl()}/workouts/${id}`,
          }).execute();


          const result = await response.json();
          this.workoutsStore.addWorkout(result.workout);
          this.workoutsStore.setDraftWorkout(null);
      } catch (error) {
          console.error('Failed to update workout:', error);
      }
  }


  @action
  archiveWorkout(id: number): void {
      new Post({params: {workout: {id}}, url: `${getApiBaseUrl()}/workouts/archive`}).execute()
          .then(r => r.json())
          .then(res => {this.workoutsStore.updateWorkouts(res.id);
              this.workoutsStore.updatArchivedWorkouts(res);});
  }

  @action
  startWorkout(id: number): void {
      new Post({params: {workout: {id}}, url: `${getApiBaseUrl()}/workouts/start`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status ==='ok') {
                  this.workoutsStore.setCurrentUserWorkout(res.user_workout);


                  window.location.pathname = `/me/workout/${res.user_workout.id}`;
              }
          });
  }

  // eslint-disable-next-line max-params
  @action
  startOrResumeExercise(id: number, workout_id: number): void {
      new Post({params: {user_workout: {exercise_id: id, workout_id  }},
          url: `${getApiBaseUrl()}/user_workouts/start_exercise`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status){
                  this.workoutsStore.setCurrentUserWorkoutExercises(res.user_exercises);
              }
          });
  }
  @action
  setDone(id: number, weigth: string, repetitions: string): void {
      new Post({params: {user_workout: {exercise_id: id, repetitions, result: weigth,  }},
          url: `${getApiBaseUrl()}/user_workouts/set_done`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status){
                  this.workoutsStore.setCurrentUserWorkoutSets(res.set);
              }
          });
  }
  @action
  deleteSet(setId: string, userExerciseId: number): void {
      new Post({params: {user_workout: {exercise_id: userExerciseId, set_id: setId  }},
          url: `${getApiBaseUrl()}/user_workouts/delete_set`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status){
                  this.workoutsStore.deleteCurrentUserWorkoutSet(res.set_id, res.user_exercise_id);
              }
          });
  }


  @action
  exerciseDone(id: number): void {
      new Post({params: {user_workout: {exercise_id: id }},
          url: `${getApiBaseUrl()}/user_workouts/exercise_done`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status.ok && res.exercise) {
                  this.exerciseStore.setCurrentExercise(res.exercise);
                  this.exerciseStore.setCurrentUserExerciseSets(res.exercise.sets);
              }
              if(res.status.ok && !res.exercise){
                  window.location.hash = '/me/workouts';
                  this.exerciseStore.setCurrentExercise(null);
                  this.exerciseStore.setCurrentUserExerciseSets(null);
                  this.workoutsStore.setCurrentUserWorkout(null);
              }
          });
  }

  @action
  getUsersWithPermissions(): void {
      new Get({ url: `${getApiBaseUrl()}/workouts/permitted_users` }).execute()
          .then(r => r.json())
          .then(res => {
              this.workoutsStore.setUsersWithPermissions(res);
          });
  }
}
