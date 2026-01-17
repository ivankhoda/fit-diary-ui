/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-statements */
/* eslint-disable no-await-in-loop */
/* eslint-disable sort-keys */
import { OfflineQueueItem, QueueItemResult, OfflineQueueService } from './baseService';
import { strategyFactory } from './strategies/strategyFactory';

export class QueueProcessor {
  private queueService: OfflineQueueService;
  private maxRetries: number;
  private isProcessing: boolean;

  constructor(maxRetries = 3) {
      this.queueService = new OfflineQueueService();
      this.maxRetries = maxRetries;
      this.isProcessing = false;
  }

  async processQueue(): Promise<QueueItemResult[]> {
      if (this.isProcessing) {
          return [];
      }

      this.isProcessing = true;
      const results: QueueItemResult[] = [];

      try {
          const queue = await this.queueService.getQueue();

          if (queue.length === 0) {
              return results;
          }

          for (const item of queue) {
              const result = await this.processItem(item);
              results.push(result);

              if (result.success) {
                  await this.queueService.remove(item.id);
              } else if (item.retries >= this.maxRetries) {
                  await this.queueService.remove(item.id);
              } else {
                  item.retries += 1;
                  await this.queueService.update(item);
              }
          }

          return results;
      } finally {
          this.isProcessing = false;
      }
  }
  async processItem(item: OfflineQueueItem): Promise<QueueItemResult> {
      try {
          const strategy = strategyFactory.getStrategy(item.entity);

          await strategy.execute(item);

          return {success: true,item,};
      } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          return {
              success: false,
              item,
              error: errorMessage,
          };
      }
  }

  async processEntityType(entityType: string): Promise<QueueItemResult[]> {
      const results: QueueItemResult[] = [];
      const queue = await this.queueService.getQueue();
      const filteredItems = queue.filter(item => item.entity === entityType);

      for (const item of filteredItems) {
          const result = await this.processItem(item);
          results.push(result);

          if (result.success) {
              await this.queueService.remove(item.id);
          }
      }

      return results;
  }

  isCurrentlyProcessing(): boolean {
      return this.isProcessing;
  }

  async getQueueStats(): Promise<{
    total: number;
    byEntity: Record<string, number>;
    byType: Record<string, number>;
  }> {
      const queue = await this.queueService.getQueue();

      const stats = {
          total: queue.length,
          byEntity: {} as Record<string, number>,
          byType: {} as Record<string, number>,
      };

      queue.forEach(item => {
          stats.byEntity[item.entity] = (stats.byEntity[item.entity] || 0) + 1;
          stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
      });

      return stats;
  }
}

export const queueProcessor = new QueueProcessor();
