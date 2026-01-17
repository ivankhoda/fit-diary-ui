/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-inline-comments */

import { queueProcessor } from './queueProcessor';
import { QueueItemResult } from './baseService';

class OfflineActionQueueService {
    async syncOfflineQueue(): Promise<QueueItemResult[]> {
        console.log('Starting offline queue synchronization...');

        try {
            const results = await queueProcessor.processQueue();

            const successCount = results.filter(r => r.success).length;
            const failedCount = results.filter(r => !r.success).length;

            return results;
        } catch (error) {
            console.error('Error during offline queue sync:', error);
            throw error;
        }
    }

    getQueueStats() {
        return queueProcessor.getQueueStats();
    }

    isProcessing(): boolean {
        return queueProcessor.isCurrentlyProcessing();
    }
}

export const offlineActionQueueService = new OfflineActionQueueService();

