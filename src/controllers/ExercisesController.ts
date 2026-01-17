/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-statements */
import { action } from 'mobx';
import ExercisesStore, { Exercise, ExerciseFormData, ExerciseInterface, WorkoutExerciseInterface } from '../store/exercisesStore';
import WorkoutsStore from '../store/workoutStore';
import Delete from '../utils/DeleteRequest';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import getApiBaseUrl from '../utils/apiUrl';
import { cacheService } from '../services/cacheService';
import { v4 as uuidv4 } from 'uuid';
import { NOT_CHANGE_RESPONSE_CODE } from '../components/Common/constants';
import { createOfflineQueueStrategy, offlineActionQueueService } from '../services/offlineQueue';

export default class ExercisesController extends BaseController {
    exerciseStore: ExercisesStore;
    workoutsStore: WorkoutsStore;

    constructor(exerciseStore: ExercisesStore, workoutsStore: WorkoutsStore) {
        super();
        this.exerciseStore = exerciseStore;
        this.workoutsStore = workoutsStore;
    }

    @action
    async getExercises(): Promise<Exercise[]> {
        try {
            const cachedEtag = await cacheService.getVersion('exercises');

            const response = await new Get({
                configurator: { headers: cachedEtag ? { 'If-None-Match': cachedEtag } : {} },
                url: `${getApiBaseUrl()}/exercises`,
            }).execute();

            if (response.status === NOT_CHANGE_RESPONSE_CODE) {
                const cached = await cacheService.get<Exercise[]>('exercises');

                if (cached) {
                    this.exerciseStore.setGeneralExercises(cached);
                    return cached;
                }
                throw new Error('No cached exercises available');
            }

            const json = await response.json();
            await cacheService.set('exercises', json.res, response.headers.get('etag') || null);
            this.exerciseStore.setGeneralExercises(json.res);
            return json.res;
        } catch (err) {
            console.warn('Failed to fetch exercises, using cache if available:', err);
            const cached = await cacheService.get<Exercise[]>('exercises');

            if (cached) {
                this.exerciseStore.setGeneralExercises(cached);
                return cached;
            }
            this.exerciseStore.setGeneralExercises([]);
            return [];
        }
    }

    @action
    async getPublicExercises(): Promise<Exercise[]> {
        try {
            const cachedEtag = await cacheService.getVersion('public_exercises');

            const response = await new Get({
                configurator: { headers: cachedEtag ? { 'If-None-Match': cachedEtag } : {} },
                url: `${getApiBaseUrl()}/exercises/public`,
            }).execute();

            if (response.status === NOT_CHANGE_RESPONSE_CODE) {
                const cached = await cacheService.get<Exercise[]>('public_exercises');

                if (cached) {
                    this.exerciseStore.setGeneralExercises(cached);
                    return cached;
                }
                throw new Error('No cached public exercises available');
            }

            const json = await response.json();
            await cacheService.set('public_exercises', json.res, response.headers.get('etag') || null);
            this.exerciseStore.setGeneralExercises(json.res);
            return json.res;
        } catch (err) {
            console.warn('Failed to fetch public exercises, using cache if available:', err);
            const cached = await cacheService.get<Exercise[]>('public_exercises');

            if (cached) {
                this.exerciseStore.setGeneralExercises(cached);
                return cached;
            }
            this.exerciseStore.setGeneralExercises([]);
            return [];
        }
    }

    @action
    async getExercise(id: string): Promise<ExerciseInterface | null> {
        try {
            const allExercises = await cacheService.get<Exercise[]>('exercises');
            const cached = allExercises?.find(ex => String(ex.id) === id);

            const cachedEtag = cached ? await cacheService.getVersion('exercises') : null;

            const response = await new Get({
                configurator: {
                    headers: cachedEtag ? { 'If-None-Match': cachedEtag } : {}
                },
                url: `${getApiBaseUrl()}/exercises/${id}`,
            }).execute();

            if (response.status === NOT_CHANGE_RESPONSE_CODE && cached) {
                this.exerciseStore.setGeneralExercise(cached);
                return cached;
            }
            if (response.ok) {
                const json = await response.json();

                if (allExercises) {
                    const index = allExercises.findIndex(ex => String(ex.id) === id);

                    if (index >= 0) {
                        allExercises[index] = json.res;
                    } else {
                        allExercises.push(json.res);
                    }
                    await cacheService.set('exercises', allExercises, response.headers.get('etag') || null);
                }
                this.exerciseStore.setGeneralExercise(json.res);
                return json.res;
            }
            if (cached) {
                this.exerciseStore.setGeneralExercise(cached);
                return cached;
            }

            return null;
        } catch (err) {
            const allExercises = await cacheService.get<Exercise[]>('exercises');
            const cached = allExercises?.find(ex => String(ex.id) === id);

            if (cached) {
                this.exerciseStore.setGeneralExercise(cached);
                return cached;
            }
            this.exerciseStore.setGeneralExercise(null);
            return null;
        }
    }

    @action
    async getWorkoutExercises(workout_id: number): Promise<ExerciseInterface[]> {
        try {
            const cacheKey = `workout_exercises_${workout_id}`;
            const cached = await cacheService.get<ExerciseInterface[]>(cacheKey);

            const response = await new Get({ params: { workout_id }, url: `${getApiBaseUrl()}/workout_exercises` }).execute();

            if (response.status === NOT_CHANGE_RESPONSE_CODE && cached) {
                this.exerciseStore.setWorkoutExercises(cached);
                return cached;
            }

            const json = await response.json();
            await cacheService.set(cacheKey, json, response.headers.get('etag') || null);
            this.exerciseStore.setWorkoutExercises(json);
            return json;
        } catch (err) {
            console.warn(`Failed to fetch workout exercises for ${workout_id}, using cache if available:`, err);
            const cached = await cacheService.get<ExerciseInterface[]>(`workout_exercises_${workout_id}`);

            if (cached) {
                this.exerciseStore.setWorkoutExercises(cached);
                return cached;
            }
            this.exerciseStore.setWorkoutExercises([]);
            return [];
        }
    }

    @action
    async getFilteredExercises(name: string): Promise<ExerciseInterface[]> {
        if (!name.length) {return [];}

        try {
            const response = await new Get({ params: { name }, url: `${getApiBaseUrl()}/exercises/search` }).execute();
            const json = await response.json();
            this.exerciseStore.setFilteredExercises(json);
            return json;
        } catch (err) {
            console.warn(`Failed to fetch filtered exercises for "${name}":`, err);
            return [];
        }
    }

    @action
    async createExercise(data?: ExerciseFormData): Promise<void> {
        try {
            const response = await new Post({
                params: { exercise: data },
                url: `${getApiBaseUrl()}/exercises`,
            }).execute();

            const json = await response.json();

            if (json.ok) {
                this.exerciseStore.addGeneralExercise(json.res);

                await cacheService.set('exercises',JSON.parse(JSON.stringify(this.exerciseStore.generalExercises)));
            }
        } catch (err) {
            const tempId = Date.now();
            const tempExercise: ExerciseFormData = {...data,
                id: tempId,
                uuid: uuidv4(),
                own: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                temp: true,
            };

            await createOfflineQueueStrategy.addCreateAction('exercise', tempExercise);
            this.exerciseStore.addGeneralExercise(tempExercise);
            await cacheService.set('exercises',JSON.parse(JSON.stringify(this.exerciseStore.generalExercises)));
        }
    }

    @action
    async updateExercise(id: number, data?: ExerciseFormData): Promise<void> {
        try {
            const response = await new Patch({ params: { exercise: data }, url: `${getApiBaseUrl()}/exercises/${id}` }).execute();
            const json = await response.json();

            if (json.ok) {
                this.exerciseStore.updateGeneralExercise(json.res);
                await cacheService.set('exercises', this.exerciseStore.generalExercises);
            }
        } catch (err) {
            await createOfflineQueueStrategy.addUpdateAction('exercise', id, data);
            this.exerciseStore.updateGeneralExercise({ id: Number(id), ...data } as any);
            await cacheService.set('exercises', JSON.parse(JSON.stringify(this.exerciseStore.generalExercises)));
        }
    }

@action
    async deleteExercise(id: number): Promise<void> {
        try {
            const response = await new Delete({ params: { exercise: { id } }, url: `${getApiBaseUrl()}/exercises/${id}` }).execute();
            const json = await response.json();

            if (json.ok) {
                this.exerciseStore.deleteGeneralExercise(json.res);
                await cacheService.set('exercises', this.exerciseStore.generalExercises);
            }
        } catch (err) {
            console.warn('Network offline, saving deleteExercise to offline queue', err);

            // Add to offline queue using strategy pattern
            await createOfflineQueueStrategy.addDeleteAction('exercise', id);

            // Удаляем локально
            this.exerciseStore.deleteGeneralExercise({ id } as any);
            await cacheService.set('exercises', JSON.parse(JSON.stringify(this.exerciseStore.generalExercises)));
        }
    }

    @action
async addWorkoutExercise(workout_id: string, exercise_id: number): Promise<ExerciseInterface | null> {
    const params = { exercise_id, workout_id };

    try {
        const response = await new Post({ params: { workout_exercise: params }, url: `${getApiBaseUrl()}/workout_exercises` }).execute();
        const json = await response.json();
        this.exerciseStore.addWorkoutExercise(json);

        const cacheKey = `workout_exercises_${workout_id}`;
        await cacheService.set(cacheKey, this.exerciseStore.workoutExercises);

        return json;
    } catch (err) {
        console.warn('Network offline, saving addWorkoutExercise to offline queue', err);

        const exercise_base = this.exerciseStore.generalExercises.find(ex => ex.id === exercise_id);
        const tempExercise: WorkoutExerciseInterface = {
            uuid: uuidv4(),
            name: exercise_base?.name,
            exercise_id: exercise_base?.id,
            type_of_measurement: exercise_base?.type_of_measurement,
            order: String(this.exerciseStore.workoutExercises.length + 1),
            workout_id: Number(workout_id),
            temp: true,
        };

        await createOfflineQueueStrategy.addCreateAction('workout_exercise', tempExercise);
        this.exerciseStore.addWorkoutExercise(tempExercise);

        const cacheKey = `workout_exercises_${workout_id}`;
        await cacheService.set(cacheKey, JSON.parse(JSON.stringify(this.exerciseStore.workoutExercises)));

        return tempExercise;
    }
}

    @action
    async deleteWorkoutExercise(id: number): Promise<void> {
        try {
            const response = await new Delete({ params: { workout_exercise: { id } }, url: `${getApiBaseUrl()}/workout_exercises/${id}` }).execute();
            const json = await response.json();
            this.exerciseStore.deleteWorkoutExercise(json.id);

            const workout_id = this.workoutsStore.draftWorkout?.id;

            if (workout_id) {
                const cacheKey = `workout_exercises_${workout_id}`;
                await cacheService.set(cacheKey, this.exerciseStore.workoutExercises);
            }
        } catch (err) {
            console.warn('Network offline, saving deleteWorkoutExercise to offline queue', err);

            await createOfflineQueueStrategy.addDeleteAction('workout_exercise', id);
            this.exerciseStore.deleteWorkoutExercise(id);

            const workout_id = this.workoutsStore.draftWorkout?.id;

            if (workout_id) {
                const cacheKey = `workout_exercises_${workout_id}`;
                await cacheService.set(cacheKey, JSON.parse(JSON.stringify(this.exerciseStore.workoutExercises)));
            }
        }
    }

    @action
    async editWorkoutExercise(params: ExerciseInterface): Promise<void> {
        try {
            const response = await new Patch({ params: { workout_exercise: params },
                url: `${getApiBaseUrl()}/workout_exercises/${params.uuid}` }).execute();
            const json = await response.json();
            this.workoutsStore.updateOrAddDraftWorkoutExercise(json);
            this.exerciseStore.updateWorkoutExercise(json);

            const workout_id = params.workout_id || this.workoutsStore.draftWorkout?.id;

            if (workout_id) {
                const cacheKey = `workout_exercises_${workout_id}`;
                await cacheService.set(cacheKey, this.exerciseStore.workoutExercises);
            }
        } catch (err) {
            console.warn('Network offline, saving editWorkoutExercise to offline queue', err);

            await createOfflineQueueStrategy.addUpdateAction('workout_exercise', params.uuid, params);
            this.workoutsStore.updateOrAddDraftWorkoutExercise(params);
            this.exerciseStore.updateWorkoutExercise(params);

            const workout_id = params.workout_id || this.workoutsStore.draftWorkout?.id;

            if (workout_id) {
                const cacheKey = `workout_exercises_${workout_id}`;
                await cacheService.set(cacheKey, JSON.parse(JSON.stringify(this.exerciseStore.workoutExercises)));
            }
        }
    }

    @action
    async syncOfflineQueue(): Promise<void> {
        try {
            const results = await offlineActionQueueService.syncOfflineQueue();

            const successCount = results.filter(r => r.success).length;
            const failedCount = results.filter(r => !r.success).length;

            console.log(`Sync completed: ${successCount} successful, ${failedCount} failed`);

            await this.getExercises();
        } catch (err) {
            console.error('Failed to sync offline queue:', err);
        }
    }
}
