// Controllers/CoachWorkoutController.ts

import { action } from 'mobx';
import getApiBaseUrl from '../../../utils/apiUrl';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Patch from '../../../utils/PatchRequest';
import Post from '../../../utils/PostRequest';
import CoachWorkoutsStore, { CoachWorkoutInterface } from '../store/CoachWorkoutsStore';
import { ExerciseInterface } from '../../../store/exercisesStore';
import { UserProfile } from '../../../store/userStore';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import CoachExercisesStore from '../store/CoachExercisesStore';

export default class CoachWorkoutController {
  coachWorkoutsStore: CoachWorkoutsStore;
  coachExercisesStore: CoachExercisesStore;

  constructor(coachWorkoutsStore: CoachWorkoutsStore, coachExercisesStore: CoachExercisesStore) {
      this.coachWorkoutsStore = coachWorkoutsStore;
      this.coachExercisesStore = coachExercisesStore;
  }

  @action
  getWorkouts(): void {
      new Get({ url: `${getApiBaseUrl()}/coach/workouts` })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.coachWorkoutsStore.setWorkouts(res.workouts);
              }
          });
  }

  @action
  getWorkoutsForClient(clientId: number): void {
      new Get({ url: `${getApiBaseUrl()}/coach/clients/${clientId}/workouts` })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.coachWorkoutsStore.setWorkoutsForClient(res.workouts);
              }
          });
  }

  @action
  assignWorkoutToClient(userId: number, workoutId: number, date?: string): void {
      new Post({
          params: {
              assignment: {
                  date,
                  user_id: userId,
                  workout_id: workoutId,
              },
          },
          url: `${getApiBaseUrl()}/coach/workout_assignments`,
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.coachWorkoutsStore.updateWorkout(res.workout);
              }
              else {
                  console.error('Не удалось назначить тренировку:', res.errors);
              }
          });
  }

  @action
  getWorkout(workoutId: string): void {
      new Get({ url: `${getApiBaseUrl()}/coach/workouts/${workoutId}` })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.status === 'ok') {
                  this.coachWorkoutsStore.setSelectedWorkout(res.workout);
                  this.coachExercisesStore.setWorkoutExercises(res.workout.workout_exercises);
              }
          });
  }

  @action
  async createWorkout(navigate: (path: string) => void): Promise<void> {
      try {
          const response = await new Post({
              url: `${getApiBaseUrl()}/coach/workouts`,
          }).execute();

          const result = await response.json();

          if (result.ok && result.workout.id) {
              this.coachWorkoutsStore.addWorkout(result.workout);
              // eslint-disable-next-line no-alert
              alert(i18n.t('workoutData.workoutCreated'));
              navigate(`/workouts/${result.workout.id}/edit`);
          } else {
              console.error('No workout ID returned in response:', result);
          }
      } catch (error) {
          console.error('Failed to create workout:', error);
      }
  }

      @action
  copyWorkout(id: number, navigate: (path: string) => void): void {
      new Post({params: {workout: {id}}, url: `${getApiBaseUrl()}/coach/workouts/duplicate`}).execute()
          .then(r => r.json())
          .then(res => {
              if(res.ok) {
                  this.coachWorkoutsStore.addWorkout(res.workout);

                  toast.success('Копия создана, вы можете её отредактировать');
                  navigate(`/workouts/${res.workout.id}/edit`);
              } else {
                  toast.error('Ошибка при копировании тренировки');
              }
          });
  }

  @action
      updateWorkout(workoutId: string, workout: Partial<CoachWorkoutInterface>): void {
          const { name, description } = workout;

          const wo = {

              description,
              id: workoutId,
              name,

          };
          new Patch({ params: { workout: wo }, url: `${getApiBaseUrl()}/coach/workouts/${workoutId}` })
              .execute()
              .then(r => r.json())
              .then(res => {
                  if (res.ok) {
                      this.coachWorkoutsStore.updateWorkout(res.workout);
                  }
              });
      }

  @action
  deleteWorkout(workoutId: number): void {
      new Delete({ url: `${getApiBaseUrl()}/coach/workouts/${workoutId}` })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.status === 'ok') {
                  this.coachWorkoutsStore.deleteWorkout(workoutId);
              }
          });
  }

    @action
  archiveWorkout(workoutId: number): void {
      new Post({
          params: { workout: { id: workoutId } },
          url: `${getApiBaseUrl()}/coach/workouts/archive`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.status === 'ok') {
                  this.coachWorkoutsStore.updatArchivedWorkouts(res.workout);
                  this.coachWorkoutsStore.deleteWorkout(res.workout.id);
              }
          });
  }

  @action
    unarchiveWorkout(workoutId: number): void {
        new Post({
            params: { workout: { id: workoutId } },
            url: `${getApiBaseUrl()}/coach/workouts/unarchive`
        })
            .execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.coachWorkoutsStore.unarchiveWorkout(res.workout.id);
                }
            });
    }

  @action
  getArchivedWorkouts(): void {
      new Get({ url: `${getApiBaseUrl()}/coach/workouts/archived` })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.coachWorkoutsStore.setArchivedWorkouts(res.workouts);
              }
          });
  }

  @action
  repeatWorkoutForClient(userId: number, workoutId: number): void {
      new Post({
          params: {
              assignment: {
                  user_id: userId,
                  workout_id: workoutId
              }
          },
          url: `${getApiBaseUrl()}/coach/workout_assignments/repeat`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.status !== 'ok') {
                  console.error('Не удалось повторить тренировку:', res.errors);
              }
          });
  }

  @action
  reorderWorkoutExercises(workoutId: string, exercises: ExerciseInterface[]): void {
      new Patch({
          params: {
              workout: {
                  id: workoutId,
                  workout_exercises: exercises
              }
          },
          url: `${getApiBaseUrl()}/coach/workouts/reorder_exercises`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.status === 'ok') {
                  this.coachWorkoutsStore.updateWorkoutExercisesOrder(workoutId, res.exercises);
              }
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
                  // eslint-disable-next-line sort-keys
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

          this.coachWorkoutsStore.addWorkout(result);
          // eslint-disable-next-line no-alert
          alert(i18n.t('workoutData.workoutCreated'));

          navigate(`/workouts/${result.id}/edit`);
      } catch (error) {
          console.error('Failed to save workout:', error);
      }
  }

  @action
  startClientWorkout(userId: number, workoutId: number): void {
      new Post({
          params: {
              workout: {
                  user_id: userId,
                  workout_id: workoutId
              }
          },
          url: `${getApiBaseUrl()}/coach/user_workouts/start`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.status === 'ok') {
                  console.log('Тренировка начата:', res.user_workout);
              } else {
                  console.error('Ошибка запуска тренировки:', res.errors);
              }
          });
  }

  @action
  finishClientWorkout(userWorkoutId: number): void {
      new Post({
          params: {
              user_workout: {
                  id: userWorkoutId
              }
          },
          url: `${getApiBaseUrl()}/coach/user_workouts/finish`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.status === 'ok') {
                  console.log('Тренировка завершена:', res.user_workout);
              } else {
                  console.error('Ошибка завершения тренировки:', res.errors);
              }
          });
  }

  @action
  assignWorkout(clientId: number, workoutId: number): void {
      new Post({
          params: {
              assignment: {
                  client_id: clientId,
                  workout_id: workoutId
              }
          },
          url: `${getApiBaseUrl()}/coach/workout_assignments`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.coachWorkoutsStore.updateWorkout(res.workout);
                  this.coachWorkoutsStore.addWorkoutForClient(res.workout);
              } else {
                  console.error('Ошибка назначения тренировки:', res.errors);
              }
          });
  }

  @action
  addWorkoutForClient(clientId: number, workoutId: number): void {
      new Post({
          params: {
              assignment: {
                  client_id: clientId,
                  workout_id: workoutId
              }
          },
          url: `${getApiBaseUrl()}/coach/workout_assignments`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.coachWorkoutsStore.addWorkoutForClient(res.workout);
              } else {
                  console.error('Ошибка назначения тренировки:', res.errors);
              }
          });
  }

  @action
  unassignWorkout(clientId: number, workoutId: number): void {
      new Delete({
          params: {
              assignment: {
                  client_id: clientId,
                  workout_id: workoutId,
              }
          },
          url: `${getApiBaseUrl()}/coach/workout_assignments/destroy_by_assignment`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.coachWorkoutsStore.updateWorkout(res.workout);
                  this.coachWorkoutsStore.removeWorkoutForClient(workoutId);
              } else {
                  console.error('Ошибка удаления назначения:', res.errors);
              }
          });
  }

   @action
  removeWorkoutForClient(clientId: number, workoutId: number): void {
      new Delete({
          params: {
              assignment: {
                  client_id: clientId,
                  workout_id: workoutId,
              }
          },
          url: `${getApiBaseUrl()}/coach/workout_assignments/destroy_by_assignment`
      })
          .execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.coachWorkoutsStore.removeWorkoutForClient(workoutId);
              } else {
                  console.error('Ошибка удаления назначения:', res.errors);
              }
          });
  }
}
