/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineQueueItem } from '../baseService';
import { OfflineQueueBaseStrategy } from './baseStrategy';

/**
 * Strategy for handling plan entity offline actions
 */
export class PlanStrategy extends OfflineQueueBaseStrategy {
    protected async handleCreate(item: OfflineQueueItem): Promise<void> {
        await console.log('Creating plan:', item.data);
    }

    protected async handleUpdate(item: OfflineQueueItem): Promise<void> {
        await console.log('Updating plan:', item.targetId, item.data);
    }

    protected async handleDelete(item: OfflineQueueItem): Promise<void> {
        await console.log('Deleting plan:', item.targetId);
    }
}
