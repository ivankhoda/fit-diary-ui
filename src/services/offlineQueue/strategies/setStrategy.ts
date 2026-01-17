/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineQueueItem } from '../baseService';
import { OfflineQueueBaseStrategy } from './baseStrategy';

/**
 * Strategy for handling set entity offline actions
 */
export class SetStrategy extends OfflineQueueBaseStrategy {
    protected async handleCreate(item: OfflineQueueItem): Promise<void> {
        await console.log('Creating set:', item.data);
    }

    protected async handleUpdate(item: OfflineQueueItem): Promise<void> {
        await console.log('Updating set:', item.targetId, item.data);
    }

    protected async handleDelete(item: OfflineQueueItem): Promise<void> {
        await console.log('Deleting set:', item.targetId);
    }
}
