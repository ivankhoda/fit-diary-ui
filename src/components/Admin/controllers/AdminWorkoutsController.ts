/* eslint-disable sort-keys */
import { action } from 'mobx';
import { BaseController } from '../../../controllers/BaseController';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Post from '../../../utils/PostRequest';
import AdminWorkoutsStore, { AdminWorkoutProfile } from '../store/AdminWorkoutsStore';
import Patch from '../../../utils/PatchRequest';
import { AdminExerciseProfile } from '../store/AdminExercisesStore';
import getApiBaseUrl from '../../../utils/apiUrl';
import i18n from 'i18next';
import { toast } from 'react-toastify';

export default class AdminWorkoutsController extends BaseController {
    adminWorkoutsStore: AdminWorkoutsStore;

    constructor(adminWorkoutsStore: AdminWorkoutsStore) {
        super();
        this.adminWorkoutsStore = adminWorkoutsStore;
    }

    @action
    getWorkouts(): void {
        new Get({ url: `${getApiBaseUrl()}/admin/workouts` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminWorkoutsStore.setWorkouts(res);
            });
    }

    @action
    getWorkoutById(id: string): void {
        new Get({ url: `${getApiBaseUrl()}/admin/workouts/${id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminWorkoutsStore.setDraftWorkout(res);
            });
    }

    @action
    addWorkout(workout: AdminWorkoutProfile): void {
        new Post({ url: `${getApiBaseUrl()}/admin/workouts`, params: { workout: JSON.stringify(workout) } })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminWorkoutsStore.addWorkout(res);
            });
    }

    @action
    updateWorkout(id: string, workout: AdminWorkoutProfile): void {
        new Patch({ url: `${getApiBaseUrl()}/admin/workouts/${id}`, params: { workout } })
            .execute()
            .then(r => r.json())
            .then(res => {
                this.adminWorkoutsStore.updateDraftWorkout(res);
            });
    }

  @action
    async createWorkout(navigate: (path: string) => void): Promise<void> {
        try {
            const response = await new Post({
                url: `${getApiBaseUrl()}/admin/workouts`,
            }).execute();

            const result = await response.json();

            if (result.ok && result.workout.id) {
                this.adminWorkoutsStore.setCurrentWorkout(result.workout);
                toast.success(i18n.t('workoutData.workoutCreated'));
                navigate(`/admin/workouts/${result.workout.id}/edit`);
            } else {
                toast.error('Тренировка не найдена:', result);
            }
        } catch (error) {
            toast.error('Ошибка:', error);
        }
    }

    @action
  deleteWorkout(id: number): void {
      new Delete({ url: `${getApiBaseUrl()}/admin/workouts/${id}` }).execute()
          .then(() => {
              this.adminWorkoutsStore.deleteWorkout(id);
          });
  }

    @action
    updateWorkoutExercise(params: AdminExerciseProfile): void {
        try {
            new Patch({
                params: { workout_exercise: params },
                url: `${getApiBaseUrl()}/admin/workout_exercises/${params.id}`,
            }).execute()
                .then(r => r.json())
                .then(res => {
                    this.adminWorkoutsStore.updateOrAddDraftWorkoutExercise(res);
                })
                .catch(error => {
                    toast.error('Ошибка:', error);
                });
        } catch (error) {
            toast.error('Ошибка:', error);
        }
    }

    @action
    addWorkoutExercise(workout_id: string, exercise_id: number): void {
        try {
            const params = {
                exercise_id,
                workout_id,
            };
            new Post({
                params: { workout_exercise: params },
                url: `${getApiBaseUrl()}/admin/workout_exercises`,
            }).execute()
                .then(r => r.json())
                .then(res => {
                    this.adminWorkoutsStore.updateOrAddDraftWorkoutExercise(res);
                })
                .catch(error => {
                    toast.error('Ошибка:', error);
                });
        } catch (error) {
            toast.error('Ошибка:', error);
        }
    }
}
