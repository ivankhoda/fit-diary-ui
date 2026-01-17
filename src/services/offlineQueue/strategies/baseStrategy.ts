/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOfflineQueueStrategy, OfflineQueueItem } from '../baseService';

export abstract class OfflineQueueBaseStrategy implements IOfflineQueueStrategy {
    async execute(item: OfflineQueueItem): Promise<void> {
        switch (item.type) {
        case 'create':
            return await this.handleCreate(item);
        case 'update':
            return this.handleUpdate(item);
        case 'delete':
            return this.handleDelete(item);
        default:
            throw new Error(`Unknown action type: ${item.type}`);
        }
    }

  protected abstract handleCreate(item: OfflineQueueItem): Promise<void>;

  protected abstract handleUpdate(item: OfflineQueueItem): Promise<void>;

  protected abstract handleDelete(item: OfflineQueueItem): Promise<void>;
}
