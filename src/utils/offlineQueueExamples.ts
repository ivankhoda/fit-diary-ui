/* eslint-disable func-style */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Example: How to use offline queue in controllers
 *
 * This file demonstrates how to integrate offline queue support
 * into existing controller methods.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck - This is an example file with intentional incomplete types

import { executeOrQueue } from '../utils/offlineQueue';
import Post from '../utils/PostRequest';
import Patch from '../utils/PatchRequest';
import Delete from '../utils/DeleteRequest';
import getApiBaseUrl from '../utils/apiUrl';

/**
 * PATTERN 1: Create/POST operations
 *
 * Example: Creating a new workout
 */
export async function createWorkoutExample(workoutData: any, store: any) {
    const result = await executeOrQueue(
        {
            type: 'CREATE',
            entityType: 'workout',
            endpoint: '/workouts',
            method: 'POST',
            body: workoutData,
        },
        // Online executor - this runs when online
        () => new Post({
            url: `${getApiBaseUrl()}/workouts`,
            body: workoutData,
        }).execute(),
        // Optimistic update - immediately update UI
        () => {
            const optimisticWorkout = {
                ...workoutData,
                id: `temp-${Date.now()}`,
                _pending: true,
            };
            store.addWorkout(optimisticWorkout);
        }
    );

    if (result.queued) {
        console.log('Workout queued for offline sync');
        // Toast notification: "Workout will be saved when online"
    } else if (result.response?.ok) {
        const savedWorkout = await result.response.json();
        store.replaceWorkout(savedWorkout);
        console.log('Workout saved successfully');
    }
}

/**
 * PATTERN 2: Update/PATCH operations
 *
 * Example: Updating a workout
 */
export async function updateWorkoutExample(workoutId: number, updates: any, store: any) {
    const result = await executeOrQueue(
        {
            type: 'UPDATE',
            entityType: 'workout',
            endpoint: `/workouts/${workoutId}`,
            method: 'PATCH',
            body: updates,
        },
        () => new Patch({
            url: `${getApiBaseUrl()}/workouts/${workoutId}`,
            body: updates,
        }).execute(),
        () => {
            // Optimistically update the store
            store.updateWorkout(workoutId, { ...updates, _pending: true });
        }
    );

    if (result.queued) {
        console.log('Update queued for offline sync');
    } else if (result.response?.ok) {
        const updatedWorkout = await result.response.json();
        store.updateWorkout(workoutId, updatedWorkout);
    }
}

/**
 * PATTERN 3: Delete/DELETE operations
 *
 * Example: Deleting a workout
 */
export async function deleteWorkoutExample(workoutId: number, store: any) {
    const result = await executeOrQueue(
        {
            type: 'DELETE',
            entityType: 'workout',
            endpoint: `/workouts/${workoutId}`,
            method: 'DELETE',
        },
        () => new Delete({
            url: `${getApiBaseUrl()}/workouts/${workoutId}`,
        }).execute(),
        () => {
            // Mark as pending deletion in UI
            store.markWorkoutDeleted(workoutId);
        }
    );

    if (result.queued) {
        console.log('Deletion queued for offline sync');
    } else if (result.response?.ok) {
        store.removeWorkout(workoutId);
    }
}

/**
 * PATTERN 4: Complex nested operations (workout sessions)
 *
 * Example: Recording a set completion in an active workout
 */
export async function recordSetExample(setData: any, store: any) {
    const result = await executeOrQueue(
        {
            type: 'CREATE',
            entityType: 'set',
            endpoint: '/user_workouts/set_done',
            method: 'POST',
            body: setData,
        },
        () => new Post({
            url: `${getApiBaseUrl()}/user_workouts/set_done`,
            body: setData,
        }).execute(),
        () => {
            // Immediately update the active session in store
            store.addSetToCurrentSession({
                ...setData,
                id: `temp-${Date.now()}`,
                _pending: true,
            });
        }
    );

    if (result.queued) {
        // User can continue workout, data will sync later
        console.log('Set recorded offline');
    } else if (result.response?.ok) {
        const savedSet = await result.response.json();
        store.replaceSet(savedSet);
    }
}

/**
 * INTEGRATION GUIDE:
 *
 * 1. Import executeOrQueue in your controller:
 *    import { executeOrQueue } from '../utils/offlineQueue';
 *
 * 2. Wrap POST/PATCH/DELETE operations with executeOrQueue
 *
 * 3. Provide optimistic update function to immediately update UI
 *
 * 4. Handle both queued and immediate responses
 *
 * 5. Add _pending flag to items in store to show sync status in UI
 *
 * 6. Listen for 'offline-sync-complete' event to update UI after sync
 *
 * 7. For stores, add methods to handle optimistic updates:
 *    - addWorkout, updateWorkout, removeWorkout
 *    - markWorkoutDeleted, replaceWorkout
 *    - Add _pending property to interface
 */

/**
 * STORE PATTERNS:
 *
 * Add these methods to your MobX stores:
 */

import { action } from 'mobx';

export class ExampleStore {
    // Add pending items map
    items: any[] = [];
    pendingItems = new Map<string, any>();

    @action
    addItemOptimistically(item: any) {
        // Add with temporary ID and pending flag
        this.pendingItems.set(item.id, item);
    }

    @action
    replaceItemAfterSync(tempId: string, realItem: any) {
        // Replace temporary item with real one from server
        this.pendingItems.delete(tempId);
        // Add to main items list
    }

    @action
    markItemPending(id: string) {
        const item = this.items.find((i: any) => i.id === id);

        if (item) {
            item._pending = true;
        }
    }

    @action
    clearPendingFlag(id: string) {
        const item = this.items.find((i: any) => i.id === id);
    }
}
