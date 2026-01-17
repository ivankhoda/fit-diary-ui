/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineQueueItem } from '../baseService';
import { OfflineQueueBaseStrategy } from './baseStrategy';

/**
 * Strategy for handling workout entity offline actions
 */
export class WorkoutStrategy extends OfflineQueueBaseStrategy {
    protected async handleCreate(item: OfflineQueueItem): Promise<void> {
        await console.log('Creating workout:', item.data);

    /*
     * TODO: Implement actual API call to create workout
     * Example:
     * const response = await fetch('/api/workouts', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(item.data)
     * });
     * if (!response.ok) throw new Error('Failed to create workout');
     */
    }

    protected async handleUpdate(item: OfflineQueueItem): Promise<void> {
        await console.log('Updating workout:', item.targetId, item.data);

    /*
     * TODO: Implement actual API call to update workout
     * Example:
     * const response = await fetch(`/api/workouts/${item.targetId}`, {
     *   method: 'PATCH',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(item.data)
     * });
     * if (!response.ok) throw new Error('Failed to update workout');
     */
    }

    protected async handleDelete(item: OfflineQueueItem): Promise<void> {
        await console.log('Deleting workout:', item.targetId);

    /*
     * TODO: Implement actual API call to delete workout
     * Example:
     * const response = await fetch(`/api/workouts/${item.targetId}`, {
     *   method: 'DELETE'
     * });
     * if (!response.ok) throw new Error('Failed to delete workout');
     */
    }
}
