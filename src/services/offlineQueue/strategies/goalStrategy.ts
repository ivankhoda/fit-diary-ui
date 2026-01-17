/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineQueueItem } from '../baseService';
import { OfflineQueueBaseStrategy } from './baseStrategy';

/**
 * Strategy for handling goal entity offline actions
 */
export class GoalStrategy extends OfflineQueueBaseStrategy {
    protected async handleCreate(item: OfflineQueueItem): Promise<void> {
        await console.log('Creating goal:', item.data);
    }

    protected async handleUpdate(item: OfflineQueueItem): Promise<void> {
        await console.log('Updating goal:', item.targetId, item.data);
    }

    protected async handleDelete(item: OfflineQueueItem): Promise<void> {
        await console.log('Deleting goal:', item.targetId);
    }
}
