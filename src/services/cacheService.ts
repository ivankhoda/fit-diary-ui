/* eslint-disable sort-keys */
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

// eslint-disable-next-line no-magic-numbers
const CACHE_TTL = 1000 * 60 * 60 * 24;

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
};
