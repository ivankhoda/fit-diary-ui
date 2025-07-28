/* eslint-disable max-lines */
/* eslint-disable max-statements */

/* eslint-disable sort-keys */
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
import i18n from 'i18next';
import { toast } from 'react-toastify';

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
  getWorkoutsByCoach(): void {
      new Get({url: `${getApiBaseUrl()}/workouts/by_coach`}).execute()
          .then(r => r.json())
          .then(res => this.workoutsStore.setWorkouts(res));
  }

    @action
    getWorkout(id: string): void {
        new Get({url: `${getApiBaseUrl()}/workouts/${id}`}).execute()
            .then(r => r.json())
            .then(res => {
                this.workoutsStore.setDraftWorkout(res.workout);
                this.exerciseStore.setWorkoutExercises(res.workout.workout_exercises);});
    }

  @action
    getLastUserWorkouts(limit: number): void {
        try {
            new Get({url: `${getApiBaseUrl()}/workouts/last?limit=${limit}`}).execute()
                .then(r => r.json())
                .then(res => {
                    if(res.ok) {
                        this.workoutsStore.setLastWorkouts(res.data);
                    }});
        } catch (error) {
            console.error('Failed to fetch last workouts', error);
        }
    }

    @action
  copyWorkout(id: number, navigate: (path: string) => void): void {
      new Post({params: {workout: {id}}, url: `${getApiBaseUrl()}/workouts/duplicate`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.ok) {
                  this.workoutsStore.addWorkout(res.workout);
                  this.workoutsStore.setDraftWorkout(res.workout);
                  this.exerciseStore.setWorkoutExercises(res.workout.workout_exercises);

                  toast.success('Копия создана, вы можете её отредактировать');
                  navigate(`/workouts/${res.workout.id}/edit`);
              } else {
                  toast.error('Ошибка при копировании тренировки');
              }
          });
  }

  @action
    getUserWorkout(id?: string): void {
        new Get({url: `${getApiBaseUrl()}/user_workouts/${id}`}).execute()
            .then(r => r.json())
            .then(res => {
                if(res.status === 'ok') {
                    this.workoutsStore.setCurrentUserWorkout(res.user_workout);
                    this.exerciseStore.setCurrentUserExercise(res.user_workout.current_user_exercise);
                    this.exerciseStore.setCurrentExercise(res.user_workout.current_workout_exercise);
                    res.exercise && this.exerciseStore.setCurrentUserExerciseSets(res.exercise.number_of_sets);
                }});
    }
    @action
  getActiveUserWorkout(): void {
      new Get({url: `${getApiBaseUrl()}/user_workouts/active`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status === 'ok') {
                  this.workoutsStore.setCurrentUserWorkout(res.user_workout);
                  this.exerciseStore.setCurrentUserExercise(res.user_workout.current_user_exercise);
                  this.exerciseStore.setCurrentExercise(res.user_workout.current_workout_exercise);
                  res.exercise && this.exerciseStore.setCurrentUserExerciseSets(res.exercise.number_of_sets);
              }});
  }

    @action
    getUserSummaryWorkout(id?: string): void {
        new Get({url: `${getApiBaseUrl()}/user_workouts/${id}/summary`}).execute()
            .then(r => r.json())
            .then(res => {
                if(res.status === 'ok') {
                    this.workoutsStore.setSummaryWorkout(res.user_workout);
                }});
    }
    @action
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
    getArchivedUserWorkouts(): void {
        new Get({url: `${getApiBaseUrl()}/workouts/archived`}).execute()
            .then(r => r.json())
            .then(res => {
                if(res) {
                    this.workoutsStore.setArchivedUserWorkouts(res);
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
  finishWorkout(id?: number, navigate?: (path: string) => void ): void {
      new Post({params: {user_workout: {id}}, url: `${getApiBaseUrl()}/user_workouts/finish_workout`}).execute()
          .then(r => r.json())
          .then(res => {
              this.workoutsStore.updateUserWorkoutsDone(res.user_workout);
              this.workoutsStore.updateUserWorkoutsInProgress(res.user_workout.id);
              this.workoutsStore.setCurrentUserWorkout(null);
              this.workoutsStore.setSummaryWorkout(res.user_workout);
              navigate(`/workouts/${id}/summary`);
          });
  }

  @action
  updateUserWorkout(id: string, comment: string, navigate?: (path: string) => void ): void {
      new Patch({params: {user_workout: {id, comment}}, url: `${getApiBaseUrl()}/user_workouts/${id}`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.ok){
                  navigate('/');
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
  async createWorkout(navigate: (path: string) => void): Promise<void> {
      try {
          const response = await new Post({
              url: `${getApiBaseUrl()}/workouts`,
          }).execute();

          const result = await response.json();

          if (result.ok && result.workout.id) {
              this.workoutsStore.addWorkout(result.workout);
              toast.success(i18n.t('workoutData.workoutCreated'));
              navigate(`/workouts/${result.workout.id}/edit`);
          } else {
              console.error('No workout ID returned in response:', result);
          }
      } catch (error) {
          console.error('Failed to create workout:', error);
      }
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
          const response = await new Post({
              params: payload,
              url: `${getApiBaseUrl()}/workouts/save`,
          }).execute();

          const result = await response.json();

          this.workoutsStore.addWorkout(result);
          toast.success(i18n.t('workoutData.workoutCreated'));

          navigate(`/workouts/${result.id}/edit`);
      } catch (error) {
          console.error('Failed to save workout:', error);
      }
  }

  @action
  async updateWorkout(id: string, newWorkout: WorkoutInterface): Promise<void> {
      try {
          const { name, description } = newWorkout;

          const payload = {
              workout: {
                  id,
                  name,
                  description
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
  async reorderWorkoutExercises(workoutId: string, exercises: ExerciseInterface[]): Promise<void> {
      try {
          const payload = {
              workout: {
                  id: workoutId,
                  workout_exercises: exercises.map(ex => ({ id: ex.id, order: ex.order })),
              },
          };

          const response = await new Patch({
              params: payload,
              url: `${getApiBaseUrl()}/workouts/reorder_exercises`,
          }).execute();

          const result = await response.json();

          this.workoutsStore.updateWorkoutExercisesOrder(workoutId, result.exercises);
      } catch (error) {
          console.error('Ошибка при обновлении порядка упражнений:', error);
      }
  }

  @action
  archiveWorkout(id: number): void {
      new Post({params: {workout: {id}}, url: `${getApiBaseUrl()}/workouts/archive`}).execute()
          .then(r => r.json())
          .then(res => {
              this.workoutsStore.removeWorkout(res.workout.id);
              this.workoutsStore.updatArchivedWorkouts(res.workout);});
  }

  @action
  unarchiveWorkout(id: number): void {
      new Post({params: {workout: {id}}, url: `${getApiBaseUrl()}/workouts/unarchive`}).execute()
          .then(r => r.json())
          .then(res => {
              this.workoutsStore.unarchiveWorkouts(res.workout.id);
          });
  }

  @action
  startWorkout(id: number, plan_id?: number): void {
      new Post({params: {workout: {id, plan_id}}, url: `${getApiBaseUrl()}/workouts/start`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status ==='ok') {
                  this.workoutsStore.setCurrentUserWorkout(res.user_workout);

                  window.location.pathname = `/workout/${res.user_workout.id}`;
              }
          });
  }

  // eslint-disable-next-line max-params
  @action
  startOrResumeExercise(exercise_id: number, workout_id: number, id?: number): void {
      new Post({params: {user_workout: {exercise_id, workout_id, id }},
          url: `${getApiBaseUrl()}/user_workouts/start_exercise`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.ok){
                  this.workoutsStore.setCurrentUserWorkoutExercises(res.user_exercises);
                  this.exerciseStore.setCurrentUserExercise(res.user_exercise);
              }
          });
  }

  @action
  finishExercise(exercise_id: number, workout_id: number, exercise: ExerciseInterface): void {
      new Post({params: {user_workout: {exercise_id, workout_id, id: exercise.id, exercise }},
          url: `${getApiBaseUrl()}/user_workouts/finish_exercise`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.ok){
                  this.workoutsStore.setCurrentUserWorkoutExercises(res.user_exercises);
                  this.workoutsStore.updateCurrentWorkoutCompletionRate(res.workout_completion_rate);
                  this.exerciseStore.setCurrentUserExercise(null);
              }
          });
  }
  // eslint-disable-next-line max-params
  setDone(exercise: ExerciseInterface, p: {id: number, weight?: string, repetitions?: string, duration?: string, distance?: string}): void {
      const {type_of_measurement} = exercise;
      const params: { user_workout: { exercise_id: number; repetitions?: string; weight?: string; duration?: string; distance?: string } } = {
          user_workout: {
              exercise_id: p.id,
              repetitions: p.repetitions
          }
      };

      if (type_of_measurement === 'weight_and_reps') {
          params.user_workout.weight = p.weight;
          params.user_workout.repetitions = p.repetitions;
      } else if (type_of_measurement === 'reps') {
          params.user_workout.repetitions = p.repetitions;
      } else if (type_of_measurement === 'duration') {
          params.user_workout.duration = p.duration;
      }
      else if (type_of_measurement === 'duration_and_reps'){
          params.user_workout.duration = p.duration;
          params.user_workout.repetitions = p.repetitions;
      }
      else if (type_of_measurement === 'distance') {
          params.user_workout.distance = p.distance;
      } else if (type_of_measurement === 'duration_and_distance') {
          params.user_workout.duration = p.duration;
          params.user_workout.distance = p.distance;
      } else if (type_of_measurement === 'cardio') {
          params.user_workout.duration = p.duration;
          params.user_workout.distance = p.distance;
      }
      new Post({
          params,
          url: `${getApiBaseUrl()}/user_workouts/set_done`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.status) {
                  this.workoutsStore.setCurrentUserWorkoutSets(res.set);
              }
          });
  }

  startSet(exercise: ExerciseInterface, p: {id: number, weight?: string, repetitions?: string, duration?: string, distance?: string}): void {
      const { type_of_measurement } = exercise;
      const params: { user_workout: { exercise_id: number; repetitions?:
        string; weight?: string; duration?: string; distance?: string; } } = {
            user_workout: {
                exercise_id: p.id,
                repetitions: p.repetitions,
            }
        };

      if (type_of_measurement === 'weight_and_reps') {
          params.user_workout.weight = p.weight;
          params.user_workout.repetitions = p.repetitions;
      } else if (type_of_measurement === 'reps') {
          params.user_workout.repetitions = p.repetitions;
      } else if (type_of_measurement === 'duration') {
          params.user_workout.duration = p.duration;
      } else if (type_of_measurement === 'duration_and_reps') {
          params.user_workout.duration = p.duration;
          params.user_workout.repetitions = p.repetitions;
      } else if (type_of_measurement === 'distance') {
          params.user_workout.distance = p.distance;
      } else if (type_of_measurement === 'duration_and_distance') {
          params.user_workout.duration = p.duration;
          params.user_workout.distance = p.distance;
      } else if (type_of_measurement === 'cardio') {
          params.user_workout.duration = p.duration;
          params.user_workout.distance = p.distance;
      }

      new Post({
          params,
          url: `${getApiBaseUrl()}/user_workouts/start_set`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.status) {
                  this.workoutsStore.setCurrentUserWorkoutSets(res.set);
              }
          });
  }

  finishSet(exercise: ExerciseInterface, p: {id: number, weight?: string, repetitions?: string, duration?: string, distance?: string},
      set_id: string): void {
      const { type_of_measurement } = exercise;
      const params: { user_workout: { exercise_id: number; repetitions?: string;
        weight?: string; duration?: string; distance?: string; set_id?: string; } } = {
            user_workout: {
                exercise_id: p.id,
                repetitions: p.repetitions,
                set_id,
            }
        };

      if (type_of_measurement === 'weight_and_reps') {
          params.user_workout.weight = p.weight;
          params.user_workout.repetitions = p.repetitions;
      } else if (type_of_measurement === 'reps') {
          params.user_workout.repetitions = p.repetitions;
      } else if (type_of_measurement === 'duration') {
          params.user_workout.duration = p.duration;
      } else if (type_of_measurement === 'duration_and_reps') {
          params.user_workout.duration = p.duration;
          params.user_workout.repetitions = p.repetitions;
      } else if (type_of_measurement === 'distance') {
          params.user_workout.distance = p.distance;
      } else if (type_of_measurement === 'duration_and_distance') {
          params.user_workout.duration = p.duration;
          params.user_workout.distance = p.distance;
      } else if (type_of_measurement === 'cardio') {
          params.user_workout.duration = p.duration;
          params.user_workout.distance = p.distance;
      }

      new Post({
          params,
          url: `${getApiBaseUrl()}/user_workouts/finish_set`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.status) {
                  this.workoutsStore.setCurrentUserWorkoutSets(res.set);
              }
          });
  }

  @action
  deleteSet(setId: string, userExerciseId: number): void {
      new Post({params: {user_workout: {user_exercise_id: userExerciseId, set_id: setId  }},
          url: `${getApiBaseUrl()}/user_workouts/delete_set`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.status){
                  this.workoutsStore.deleteCurrentUserWorkoutSet(res.set_id, res.user_exercise_id);
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
