/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-statements */
import { action } from 'mobx';
import ExercisesStore, { ExerciseInterface } from '../store/exercisesStore';
import WorkoutsStore from '../store/workoutStore';
import Delete from '../utils/DeleteRequest';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import getApiBaseUrl from '../utils/apiUrl';
import { ExerciseFormData } from '../components/User/Exercises/ExerciseModal/ExerciseModal';
import { cacheService } from '../services/cacheService';
import { Exercise } from '../components/User/Exercises/Exercises';
import { NOT_CHANGE_RESPONSE_CODE } from '../components/Common/constants';

interface OfflineAction {
    type: 'create' | 'update' | 'delete';
    entity: 'exercise';
    id?: number;
    data?: ExerciseFormData;
    timestamp: number;
}

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
        // Пытаемся создать на сервере
            const response = await new Post({
                params: { exercise: data },
                url: `${getApiBaseUrl()}/exercises`,
            }).execute();

            const json = await response.json();

            if (json.ok) {
            // Добавляем в стор
                this.exerciseStore.addGeneralExercise(json.res);

                // Сохраняем в кеш
                await cacheService.set(
                    'exercises',
                    JSON.parse(JSON.stringify(this.exerciseStore.generalExercises))
                );
            }
        } catch (err) {
            console.warn('Network offline, saving createExercise to offline queue', err);

            // Получаем текущую оффлайн-очередь
            let offlineQueue = await cacheService.get<OfflineAction[]>('offlineQueue');

            // Если что-то пошло не так, создаем новый массив
            if (!Array.isArray(offlineQueue)) {
                offlineQueue = [];
            }

            // Добавляем новое действие
            offlineQueue.push({
                type: 'create',
                entity: 'exercise',
                data,
                timestamp: Date.now(),
            });

            await cacheService.set('offlineQueue', offlineQueue);

            // Создаем временный объект Exercise с временным ID
            const tempId = Date.now();
            const tempExercise: Exercise & { temp?: boolean } = {
                id: tempId,
                uuid: `temp-${tempId}`,
                name: data?.name || 'Новое упражнение',
                category: (data?.category as 'strength' | 'cardio' | 'flexibility' | 'balance') || 'strength',
                difficulty: (data?.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
                muscle_groups: data?.muscle_groups || [],
                description: data?.description || '',
                duration: data?.duration || 0,
                temp: true,
            };

            // Добавляем в стор
            this.exerciseStore.addGeneralExercise(tempExercise);

            // Сохраняем стор в кеш
            await cacheService.set(
                'exercises',
                JSON.parse(JSON.stringify(this.exerciseStore.generalExercises))
            );
        }
    }

    @action
    async updateExercise(id: string, data?: ExerciseFormData): Promise<void> {
        try {
            const response = await new Patch({ params: { exercise: data }, url: `${getApiBaseUrl()}/exercises/${id}` }).execute();
            const json = await response.json();

            if (json.ok) {
                this.exerciseStore.updateGeneralExercise(json.res);
                await cacheService.set('exercises', this.exerciseStore.generalExercises);
            }
        } catch (err) {
            console.warn('Network offline, saving updateExercise to offline queue', err);
            const offlineQueue: OfflineAction[] = (await cacheService.get('offlineQueue')) || [];
            offlineQueue.push({ type: 'update', entity: 'exercise', id: Number(id), data, timestamp: Date.now() });
            await cacheService.set('offlineQueue', offlineQueue);

            // Обновляем локально
            this.exerciseStore.updateGeneralExercise({ id: Number(id), ...data } as any);
            await cacheService.set('exercises', this.exerciseStore.generalExercises);
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
            const offlineQueue: OfflineAction[] = (await cacheService.get('offlineQueue')) || [];
            offlineQueue.push({ type: 'delete', entity: 'exercise', id, timestamp: Date.now() });
            await cacheService.set('offlineQueue', offlineQueue);

            // Удаляем локально
            this.exerciseStore.deleteGeneralExercise({ id } as any);
            await cacheService.set('exercises', this.exerciseStore.generalExercises);
        }
    }

    @action
async addWorkoutExercise(workout_id: string, exercise_id: number): Promise<ExerciseInterface | null> {
    try {
        const params = { exercise_id, workout_id };
        const response = await new Post({ params: { workout_exercise: params }, url: `${getApiBaseUrl()}/workout_exercises` }).execute();
        const json = await response.json();
        this.exerciseStore.addWorkoutExercise(json);
        return json;
    } catch (err) {
        console.error('Failed to add workout exercise:', err);
        return null;
    }
}

    @action
    async deleteWorkoutExercise(id: number): Promise<void> {
        try {
            const response = await new Delete({ params: { workout_exercise: { id } }, url: `${getApiBaseUrl()}/workout_exercises/${id}` }).execute();
            const json = await response.json();
            this.exerciseStore.deleteWorkoutExercise(json.id);
        } catch (err) {
            console.error('Failed to delete workout exercise:', err);
        }
    }

    @action
    async editWorkoutExercise(params: ExerciseInterface): Promise<void> {
        try {
            const response = await new Patch({ params: { workout_exercise: params },
                url: `${getApiBaseUrl()}/workout_exercises/${params.id}` }).execute();
            const json = await response.json();
            this.workoutsStore.updateOrAddDraftWorkoutExercise(json);
            this.exerciseStore.updateWorkoutExercise(json);
        } catch (err) {
            console.error('Failed to edit workout exercise:', err);
        }
    }

    @action
    async syncOfflineQueue(): Promise<void> {
        let offlineQueue = await cacheService.get<OfflineAction[]>('offlineQueue');

        if (!Array.isArray(offlineQueue) || offlineQueue.length === 0) {
            console.log('Offline queue is empty, nothing to sync.');
            return;
        }

        const successfulActions: OfflineAction[] = [];
        console.log(`Syncing ${offlineQueue.length} offline actions...`);
        for (const action of offlineQueue) {
            try {
                switch (action.type) {
                case 'create':
                    if (action.entity === 'exercise' && action.data) {
                        const response = await new Post({
                            params: { exercise: action.data },
                            url: `${getApiBaseUrl()}/exercises`,
                        }).execute();

                        const json = await response.json();
                        console.log('Sync create exercise action response:', json);
                        if (json.ok) {
                            const tempExercise = this.exerciseStore.generalExercises.find(
                                e => e.uuid?.startsWith('temp-') && e.name === action.data?.name
                            );

                            if (tempExercise) {
                                this.exerciseStore.updateGeneralExercise(json.res);
                            } else {
                                this.exerciseStore.addGeneralExercise(json.res);
                            }

                            // Сохраняем в кэш
                            await cacheService.set(
                                'exercises',
                                JSON.parse(JSON.stringify(this.exerciseStore.generalExercises))
                            );

                            successfulActions.push(action);
                        }
                    }
                    break;

                // Можно добавить 'update' и 'delete' по аналогии
                default:
                    console.warn('Unknown offline action type', action.type);
                }
            } catch (err) {
                console.error('Failed to sync offline action', action, err);
            }
        }

        // Удаляем успешно выполненные действия из очереди
        offlineQueue = offlineQueue.filter(action => !successfulActions.includes(action));
        await cacheService.set('offlineQueue', offlineQueue);

        console.log('Offline queue sync completed');
    }
}
