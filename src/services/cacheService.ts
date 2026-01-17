/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-statements */
/* eslint-disable require-await */
/* eslint-disable sort-keys */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-statements */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import localforage from 'localforage';

localforage.config({
    name: 'planka',
    storeName: 'cache',
});

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  version?: string;
}

export interface OfflineAction {
    id: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    entityType: 'workout' | 'exercise' | 'plan' | 'goal' | 'user' | 'workout_session' | 'set';
    endpoint: string;
    method: 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    timestamp: number;
    retryCount?: number;
    optimisticData?: unknown; // For storing optimistic updates
}

export interface SyncResult {
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors: Array<{ action: OfflineAction; error: string }>;
}

// eslint-disable-next-line no-magic-numbers
const CACHE_TTL = 1000 * 60 * 60 * 24;
const OFFLINE_QUEUE_KEY = 'offline_queue';
const MAX_RETRY_COUNT = 3;

export const cacheService = {
    async get<T>(key: string): Promise<T | null> {
        const item = await localforage.getItem<CacheItem<T>>(key);

        if (!item) {return null;}

        const isExpired = Date.now() - item.timestamp > CACHE_TTL;

        if (isExpired) {
            await localforage.removeItem(key);
            return null;
        }

        return item.data;
    },

    async getVersion(key: string): Promise<string | null> {
        const item = await localforage.getItem<CacheItem<unknown>>(key);

        if (!item || !item.version) {return null;}

        const isExpired = Date.now() - item.timestamp > CACHE_TTL;

        if (isExpired) {
            await localforage.removeItem(key);
            return null;
        }

        return item.version;
    },

    async set<T>(key: string, data: T, version?: string): Promise<void> {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            version,
        };
        await localforage.setItem(key, item);
    },

    async clear(key: string): Promise<void> {
        await localforage.removeItem(key);
    },

    async clearAll(): Promise<void> {
        await localforage.clear();
    },

    // Offline Queue Management
    async addToQueue(action: Omit<OfflineAction, 'id' | 'timestamp'>): Promise<string> {
        const queue = await this.getQueue();
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newAction: OfflineAction = {
            ...action,
            id,
            timestamp: Date.now(),
            retryCount: 0,
        };
        queue.push(newAction);
        await localforage.setItem(OFFLINE_QUEUE_KEY, queue);
        console.log('Added to offline queue:', newAction);
        return id;
    },

    async getQueue(): Promise<OfflineAction[]> {
        const queue = await localforage.getItem<OfflineAction[]>(OFFLINE_QUEUE_KEY);
        return queue || [];
    },

    async removeFromQueue(id: string): Promise<void> {
        const queue = await this.getQueue();
        const filteredQueue = queue.filter(action => action.id !== id);
        await localforage.setItem(OFFLINE_QUEUE_KEY, filteredQueue);
    },

    async updateQueueAction(id: string, updates: Partial<OfflineAction>): Promise<void> {
        const queue = await this.getQueue();
        const index = queue.findIndex(action => action.id === id);

        if (index !== -1) {
            queue[index] = { ...queue[index], ...updates };
            await localforage.setItem(OFFLINE_QUEUE_KEY, queue);
        }
    },

    async clearQueue(): Promise<void> {
        await localforage.removeItem(OFFLINE_QUEUE_KEY);
    },

    async getQueueCount(): Promise<number> {
        const queue = await this.getQueue();
        return queue.length;
    },

    // Sync offline queue with server
    async syncQueue(fetchFunction: (action: OfflineAction) => Promise<Response>): Promise<SyncResult> {
        const queue = await this.getQueue();

        if (queue.length === 0) {
            return { success: true, syncedCount: 0, failedCount: 0, errors: [] };
        }

        console.log(`Syncing ${queue.length} offline actions...`);

        const result: SyncResult = {
            success: true,
            syncedCount: 0,
            failedCount: 0,
            errors: [],
        };

        // Sort by timestamp to ensure correct order
        const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);

        for (const action of sortedQueue) {
            try {
                // Skip if max retries exceeded
                if (action.retryCount && action.retryCount >= MAX_RETRY_COUNT) {
                    console.warn(`Max retries exceeded for action ${action.id}`);
                    result.failedCount++;
                    result.errors.push({
                        action,
                        error: 'Max retries exceeded'
                    });
                    await this.removeFromQueue(action.id);
                    continue;
                }

                const response = await fetchFunction(action);

                if (response.ok) {
                    result.syncedCount++;
                    await this.removeFromQueue(action.id);
                    console.log(`Successfully synced action ${action.id}`);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Failed to sync action ${action.id}:`, error);
                result.failedCount++;
                result.errors.push({
                    action,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });

                // Increment retry count
                await this.updateQueueAction(action.id, {
                    retryCount: (action.retryCount || 0) + 1,
                });
            }
        }

        result.success = result.failedCount === 0;
        console.log('Sync completed:', result);

        return result;
    },

    // Conflict resolution - server data wins by default
    async resolveConflict<T>(
        localData: T,
        serverData: T,
        strategy: 'server-wins' | 'local-wins' | 'merge' = 'server-wins'
    ): Promise<T> {
        switch (strategy) {
        case 'local-wins':
            return localData;
        case 'merge':
            // Simple shallow merge - override for complex types
            return { ...serverData, ...localData };
        case 'server-wins':
        default:
            return serverData;
        }
    },
};

