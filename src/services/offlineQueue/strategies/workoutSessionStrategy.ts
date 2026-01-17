/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineQueueItem } from '../baseService';
import { OfflineQueueBaseStrategy } from './baseStrategy';

export class WorkoutSessionStrategy extends OfflineQueueBaseStrategy {
    protected async handleCreate(item: OfflineQueueItem): Promise<void> {
        await console.log('Creating workout session:', item.data);
    }

    protected async handleUpdate(item: OfflineQueueItem): Promise<void> {
        await console.log('Updating workout session:', item.targetId, item.data);
    }

    protected async handleDelete(item: OfflineQueueItem): Promise<void> {
        await console.log('Deleting workout session:', item.targetId);
    }
}
