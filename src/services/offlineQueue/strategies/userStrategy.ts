/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineQueueItem } from '../baseService';
import { OfflineQueueBaseStrategy } from './baseStrategy';

/**
 * Strategy for handling user entity offline actions
 */
export class UserStrategy extends OfflineQueueBaseStrategy {
    protected async handleCreate(item: OfflineQueueItem): Promise<void> {
        await console.log('Creating user:', item.data);
    }

    protected async handleUpdate(item: OfflineQueueItem): Promise<void> {
        await console.log('Updating user:', item.targetId, item.data);
    }

    protected async handleDelete(item: OfflineQueueItem): Promise<void> {
        await console.log('Deleting user:', item.targetId);
    }
}
