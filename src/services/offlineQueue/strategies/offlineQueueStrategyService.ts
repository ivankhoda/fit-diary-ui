/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, OfflineQueueItem, IOfflineQueueStrategy } from '../baseService';
import { strategyFactory } from './strategyFactory';

/**
 * Service for executing offline queue strategies
 * This class acts as a facade for the strategy pattern implementation
 */
export class OfflineQueueStrategyService {
    /**
     * Execute an offline queue item using the appropriate strategy
     * @param item The queue item to execute
     */
    async execute(item: OfflineQueueItem): Promise<void> {
        const strategy = strategyFactory.getStrategy(item.entity);
        await strategy.execute(item);
    }

    /**
     * Get the strategy for a specific entity type
     * @param entity The entity type
     * @returns The strategy instance
     */
    getStrategy(entity: Entity): IOfflineQueueStrategy {
        return strategyFactory.getStrategy(entity);
    }

    /**
     * Register a custom strategy for an entity type
     * @param entity The entity type
     * @param strategy The strategy instance
     */
    registerCustomStrategy(entity: Entity, strategy: IOfflineQueueStrategy): void {
        strategyFactory.registerStrategy(entity, strategy);
    }
}

// Export singleton instance
export const offlineQueueStrategyService = new OfflineQueueStrategyService();

