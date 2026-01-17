/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineQueueItem } from '../baseService';
import { OfflineQueueBaseStrategy } from './baseStrategy';
import Post from '../../../utils/PostRequest';
import Patch from '../../../utils/PatchRequest';
import Delete from '../../../utils/DeleteRequest';
import getApiBaseUrl from '../../../utils/apiUrl';

export class WorkoutExerciseStrategy extends OfflineQueueBaseStrategy {
    protected async handleCreate(item: OfflineQueueItem): Promise<void> {
        const response = await new Post({
            params: { workout_exercise: item.data },
            url: `${getApiBaseUrl()}/workout_exercises`
        }).execute();

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create workout exercise: ${error}`);
        }
    }

    protected async handleUpdate(item: OfflineQueueItem): Promise<void> {
        const response = await new Patch({
            params: { workout_exercise: item.data },
            url: `${getApiBaseUrl()}/workout_exercises/${item.targetId}`,
        }).execute();

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to update workout exercise: ${error}`);
        }
    }

    protected async handleDelete(item: OfflineQueueItem): Promise<void> {
        const response = await new Delete({
            params: { workout_exercise: { id: item.targetId } },
            url: `${getApiBaseUrl()}/workout_exercises/${item.targetId}`,
        }).execute();

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to delete workout exercise: ${error}`);
        }
    }
}
