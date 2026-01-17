/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-style */
/* eslint-disable sort-keys */
/* eslint-disable no-undefined */
// @ts-nocheck
import { cacheService, OfflineAction } from '../services/cacheService';
import { isOnline } from './network';
import HttpFetch from './httpFetch';

/**
 * Wrapper to handle online/offline request execution with automatic queuing
 */
export async function executeOrQueue(
    action: Omit<OfflineAction, 'id' | 'timestamp'>,
    onlineExecutor: () => Promise<Response>,
    optimisticUpdate?: () => void
): Promise<{ response?: Response; queued: boolean; queueId?: string }> {
    const online = await isOnline();

    if (online) {
        try {
            const response = await onlineExecutor();
            return { response, queued: false };
        } catch (error) {
            // Network error - queue it
            console.warn('Network error, queuing action:', error);
            if (optimisticUpdate) {
                optimisticUpdate();
            }

            const queueId = await cacheService.addToQueue(action);
            return { queued: true, queueId };
        }
    } else {
        // Offline - queue immediately
        if (optimisticUpdate) {
            optimisticUpdate();
        }

        const queueId = await cacheService.addToQueue(action);
        return { queued: true, queueId };
    }
}

/**
 * Execute a queued action
 */
export async function executeQueuedAction(action: OfflineAction): Promise<Response> {
    const httpFetch = new HttpFetch();

    const response = await httpFetch.execute({
        url: action.endpoint,
        method: action.method,
        body: action.body,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}

/**
 * Sync all queued actions
 */
export async function syncAllQueued(): Promise<void> {
    const online = await isOnline();

    if (!online) {
        console.log('Cannot sync: device is offline');
        return;
    }

    console.log('Starting offline queue sync...');
    const result = await cacheService.syncQueue(executeQueuedAction);

    console.log(`Sync complete: ${result.syncedCount} succeeded, ${result.failedCount} failed`);

    if (result.errors.length > 0) {
        console.error('Sync errors:', result.errors);
    }

    // Emit event for UI to update
    window.dispatchEvent(new CustomEvent('offline-sync-complete', {
        detail: result
    }));
}

/**
 * Get pending action count for UI display
 */
export async function getPendingCount(): Promise<number> {
    return await cacheService.getQueueCount();
}
