/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */

import { cacheService } from '../cacheService';

export type Entity =
  | 'workout'
  | 'exercise'
  | 'workout_exercise'
  | 'plan'
  | 'goal'
  | 'user'
  | 'workout_session'
  | 'set';

export type OfflineActionType = 'create' | 'update' | 'delete';

export interface OfflineQueueItem<T = any> {
  id: number;
  entity: Entity;
  type: OfflineActionType;
  data?: T;
  targetId?: number | string;
  timestamp: number;
  retries: number;
}

export interface IOfflineQueueStrategy {
  execute(item: OfflineQueueItem): Promise<void>;
}

export interface QueueItemResult {
  success: boolean;
  item: OfflineQueueItem;
  error?: string;
}

export class OfflineQueueService {
  private key = 'offlineQueue';

  async getQueue(): Promise<OfflineQueueItem[]> {
      return (await cacheService.get<OfflineQueueItem[]>(this.key)) || [];
  }

  async saveQueue(queue: OfflineQueueItem[]): Promise<void> {
      await cacheService.set(this.key, queue);
  }

  async add(item: Omit<OfflineQueueItem, 'retries'>): Promise<void> {
      const queue = await this.getQueue();
      queue.push({ ...item, retries: 0 });
      await this.saveQueue(queue);
  }

  async remove(id: number): Promise<void> {
      const queue = await this.getQueue();
      await this.saveQueue(queue.filter(i => i.id !== id));
  }

  async update(item: OfflineQueueItem): Promise<void> {
      const queue = await this.getQueue();
      const idx = queue.findIndex(i => i.id === item.id);

      if (idx !== -1) {queue[idx] = item;}
      await this.saveQueue(queue);
  }
}
