/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineQueueItem } from '../baseService';
import { OfflineQueueBaseStrategy } from './baseStrategy';
import Post from '../../../utils/PostRequest';
import Patch from '../../../utils/PatchRequest';
import Delete from '../../../utils/DeleteRequest';
import getApiBaseUrl from '../../../utils/apiUrl';

export class ExerciseStrategy extends OfflineQueueBaseStrategy {
    protected async handleCreate(item: OfflineQueueItem): Promise<void> {
        const response = await new Post({
            params: { exercise: item.data },
            url: `${getApiBaseUrl()}/exercises`,
        }).execute();

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create exercise: ${error}`);
        }
    }

    protected async handleUpdate(item: OfflineQueueItem): Promise<void> {
        const response = await new Patch({
            params: { exercise: item.data },
            url: `${getApiBaseUrl()}/exercises/${item.targetId}`,
        }).execute();

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to update exercise: ${error}`);
        }
    }

    protected async handleDelete(item: OfflineQueueItem): Promise<void> {
        const response = await new Delete({
            params: { exercise: { id: item.targetId } },
            url: `${getApiBaseUrl()}/exercises/${item.targetId}`,
        }).execute();

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to delete exercise: ${error}`);
        }
    }
}
