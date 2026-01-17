/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
/* eslint-disable max-params */

import { OfflineQueueService, Entity, OfflineActionType } from '../baseService';

export class CreateOfflineQueueStrategy {
  private queueService: OfflineQueueService;

  constructor() {
      this.queueService = new OfflineQueueService();
  }
  async addCreateAction<T = any>(entity: Entity, data: T): Promise<void> {
      await this.queueService.add({
          id: Date.now(),
          entity,
          type: 'create',
          data,
          timestamp: Date.now(),
      });
  }

  async addUpdateAction<T = any>(entity: Entity,targetId: number | string,data: T): Promise<void> {
      await this.queueService.add({
          id: Date.now(),
          entity,
          type: 'update',
          targetId,
          data,
          timestamp: Date.now(),
      });
  }

  async addDeleteAction(entity: Entity, targetId: number | string): Promise<void> {
      await this.queueService.add({
          id: Date.now(),
          entity,
          type: 'delete',
          targetId,
          timestamp: Date.now(),
      });
  }

  async addAction<T = any>(
      entity: Entity,
      type: OfflineActionType,
      data?: T,
      targetId?: number | string
  ): Promise<void> {
      await this.queueService.add({
          id: Date.now(),
          entity,
          type,
          data,
          targetId,
          timestamp: Date.now(),
      });
  }
}

export const createOfflineQueueStrategy = new CreateOfflineQueueStrategy();

