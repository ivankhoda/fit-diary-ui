# Strategy Pattern Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Offline Queue System                             │
└─────────────────────────────────────────────────────────────────────────┘

                           ┌──────────────────┐
                           │  Controllers     │
                           │  (User Actions)  │
                           └────────┬─────────┘
                                    │
                                    │ Add items to queue
                                    ▼
                  ┌─────────────────────────────────┐
                  │  CreateOfflineQueueStrategy     │
                  │  - addCreateAction()             │
                  │  - addUpdateAction()             │
                  │  - addDeleteAction()             │
                  └─────────────┬───────────────────┘
                                │
                                │ Uses
                                ▼
                  ┌──────────────────────────────────┐
                  │    OfflineQueueService           │
                  │    - add()                       │
                  │    - remove()                    │
                  │    - update()                    │
                  │    - getQueue()                  │
                  └────────────┬─────────────────────┘
                               │
                               │ Stores in
                               ▼
                  ┌──────────────────────────────────┐
                  │      CacheService                │
                  │      (LocalForage)               │
                  └──────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │                  Processing Flow                         │
    └──────────────────────────────────────────────────────────┘

                ┌─────────────────────────────┐
                │ OfflineActionQueueService   │
                │ - syncOfflineQueue()        │
                │ - getQueueStats()           │
                │ - isProcessing()            │
                └──────────┬──────────────────┘
                           │
                           │ Delegates to
                           ▼
                ┌─────────────────────────────┐
                │    QueueProcessor           │
                │    - processQueue()         │
                │    - processItem()          │
                │    - getQueueStats()        │
                └──────────┬──────────────────┘
                           │
                           │ For each item
                           ▼
                ┌─────────────────────────────┐
                │  StrategyFactory            │
                │  - getStrategy(entity)      │
                │  - registerStrategy()       │
                └──────────┬──────────────────┘
                           │
                           │ Returns appropriate strategy
                           ▼
          ┌────────────────────────────────────────────┐
          │         IOfflineQueueStrategy              │
          │         - execute(item)                    │
          └────────────────┬───────────────────────────┘
                           │
                           │ Implemented by
                           │
          ┌────────────────┴───────────────────────────┐
          │                                             │
          ▼                                             ▼
┌─────────────────────┐                    ┌──────────────────────┐
│ OfflineQueueBase    │                    │   Concrete           │
│ Strategy (Abstract) │◄───────────────────┤   Strategies         │
│ - execute()         │                    │                      │
│ - handleCreate()    │                    │  - ExerciseStrategy  │
│ - handleUpdate()    │                    │  - WorkoutStrategy   │
│ - handleDelete()    │                    │  - PlanStrategy      │
└─────────────────────┘                    │  - GoalStrategy      │
                                            │  - UserStrategy      │
                                            │  - WorkoutSession    │
                                            │  - SetStrategy       │
                                            └──────────────────────┘
                                                     │
                                                     │ Makes API calls
                                                     ▼
                                            ┌──────────────────────┐
                                            │   Backend API        │
                                            │   - POST /workouts   │
                                            │   - PATCH /exercises │
                                            │   - DELETE /plans    │
                                            └──────────────────────┘

═══════════════════════════════════════════════════════════════════════
                            Data Flow
═══════════════════════════════════════════════════════════════════════

1. User Action (Offline)
   └─> CreateOfflineQueueStrategy.addCreateAction()
       └─> OfflineQueueService.add()
           └─> CacheService.set() → LocalForage

2. Connection Restored
   └─> OfflineActionQueueService.syncOfflineQueue()
       └─> QueueProcessor.processQueue()
           └─> For each item:
               ├─> StrategyFactory.getStrategy(entity)
               ├─> Strategy.execute(item)
               │   └─> handleCreate/Update/Delete()
               │       └─> fetch() API call
               └─> If success: remove from queue
                   If failure: increment retry count

═══════════════════════════════════════════════════════════════════════
                        Design Patterns Used
═══════════════════════════════════════════════════════════════════════

1. Strategy Pattern
   - Different strategies for each entity type
   - Common interface (IOfflineQueueStrategy)
   - Runtime strategy selection

2. Factory Pattern
   - StrategyFactory creates and manages strategies
   - Centralized strategy instantiation

3. Singleton Pattern
   - Single instances of services
   - Shared state management

4. Facade Pattern
   - OfflineActionQueueService provides simple interface
   - Hides complexity of queue processing
```
