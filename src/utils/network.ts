/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable require-await */
/* eslint-disable func-style */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable no-magic-numbers */
/* eslint-disable padding-line-between-statements */
/* eslint-disable require-atomic-updates */
import { Network } from '@capacitor/network';
import { syncAllQueued } from './offlineQueue';

let syncInProgress = false;
let retryTimeout: NodeJS.Timeout | null = null;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 60000; // 1 minute
let currentRetryDelay = INITIAL_RETRY_DELAY;

export const isOnline = async(): Promise<boolean> => {
    try {
        const status = await Network.getStatus();
        return status.connected;
    } catch (error) {
        console.error('Ошибка при проверке сети:', error);
        return false;
    }
};

export const onNetworkChange = async(callback: (connected: boolean) => void) => Network.addListener('networkStatusChange', status => {
    callback(status.connected);

    // Trigger sync when connection is restored
    if (status.connected) {
        console.log('Network connection restored, triggering sync...');
        triggerSyncWithRetry();
    } else {
        console.log('Network connection lost');
        // Reset retry delay when going offline
        currentRetryDelay = INITIAL_RETRY_DELAY;
        if (retryTimeout) {
            clearTimeout(retryTimeout);
            retryTimeout = null;
        }
    }
});

async function triggerSyncWithRetry() {
    if (syncInProgress) {
        console.log('Sync already in progress, skipping...');
        return;
    }

    try {
        syncInProgress = true;
        await syncAllQueued();

        // Reset retry delay on success
        currentRetryDelay = INITIAL_RETRY_DELAY;
        if (retryTimeout) {
            clearTimeout(retryTimeout);
            retryTimeout = null;
        }
    } catch (error) {
        console.error('Sync failed, will retry:', error);

        // Exponential backoff for retry
        retryTimeout = setTimeout(() => {
            const online = isOnline();
            if (online) {
                console.log(`Retrying sync after ${currentRetryDelay}ms...`);
                triggerSyncWithRetry();
            }
        }, currentRetryDelay);

        // Increase delay for next retry, up to max
        currentRetryDelay = Math.min(currentRetryDelay * 2, MAX_RETRY_DELAY);
    } finally {
        syncInProgress = false;
    }
}

// Listen for service worker sync events
if (typeof window !== 'undefined') {
    window.addEventListener('sw-sync-queue', () => {
        console.log('Service worker requested sync');
        triggerSyncWithRetry();
    });
}

