/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, IOfflineQueueStrategy } from '../baseService';
import { ExerciseStrategy } from './exercisesStrategy';
import { WorkoutStrategy } from './workoutStrategy';
import { WorkoutExerciseStrategy } from './workoutExerciseStrategy';
import { PlanStrategy } from './planStrategy';
import { GoalStrategy } from './goalStrategy';
import { UserStrategy } from './userStrategy';
import { WorkoutSessionStrategy } from './workoutSessionStrategy';
import { SetStrategy } from './setStrategy';

export class OfflineQueueStrategyFactory {
  private strategies: Map<Entity, IOfflineQueueStrategy>;

  constructor() {
      this.strategies = new Map();
      this.initializeStrategies();
  }

  private initializeStrategies(): void {
      this.strategies.set('exercise', new ExerciseStrategy());
      this.strategies.set('workout', new WorkoutStrategy());
      this.strategies.set('workout_exercise', new WorkoutExerciseStrategy());
      this.strategies.set('plan', new PlanStrategy());
      this.strategies.set('goal', new GoalStrategy());
      this.strategies.set('user', new UserStrategy());
      this.strategies.set('workout_session', new WorkoutSessionStrategy());
      this.strategies.set('set', new SetStrategy());
  }

  getStrategy(entity: Entity): IOfflineQueueStrategy {
      const strategy = this.strategies.get(entity);

      if (!strategy) {
          throw new Error(`No strategy found for entity type: ${entity}`);
      }

      return strategy;
  }

  registerStrategy(entity: Entity, strategy: IOfflineQueueStrategy): void {
      this.strategies.set(entity, strategy);
  }
}

export const strategyFactory = new OfflineQueueStrategyFactory();
