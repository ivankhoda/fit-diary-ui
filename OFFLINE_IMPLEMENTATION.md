# Offline Support Implementation Guide

## Overview

This fitness diary app now supports comprehensive offline functionality, allowing users to continue using the app without internet connection. All data operations are automatically queued and synchronized when connectivity is restored.

## Architecture

### 1. Service Worker (PWA)

- **File**: `src/service-worker.ts`
- **Purpose**: Caches static assets and API responses
- **Strategy**:
  - Static assets: Precached on install
  - API GET requests: NetworkFirst with 24h cache
  - Images: CacheFirst with 30-day expiration
  - Navigation: App shell pattern

### 2. Offline Queue System

- **File**: `src/services/cacheService.ts`
- **Storage**: IndexedDB via localforage
- **Features**:
  - Queues POST/PATCH/DELETE operations when offline
  - Automatic retry with exponential backoff (max 3 retries)
  - Conflict resolution strategies
  - Queue persistence across app restarts

### 3. Offline Execution Utility

- **File**: `src/utils/offlineQueue.ts`
- **Functions**:
  - `executeOrQueue()`: Wraps network requests with offline handling
  - `syncAllQueued()`: Synchronizes all pending operations
  - `getPendingCount()`: Returns number of pending operations

### 4. UI Components

- **File**: `src/components/Common/OfflineIndicator.tsx`
- **Features**:
  - Shows offline status
  - Displays pending operations count
  - Shows sync progress

## How It Works

### Online Flow

```
User Action → Controller → HTTP Request → Server → Update Store → UI Update
```

### Offline Flow

```
User Action → Controller → Queue Action → Optimistic Store Update → UI Update
[Later] Connection Restored → Sync Queue → Server → Confirm Store Update
```

## Implementation Guide

### Step 1: Install Dependencies

Already installed:

- `workbox-webpack-plugin` - Service worker generation
- `@capacitor/preferences` - Native storage (optional enhancement)

### Step 2: Build Configuration

Webpack production build generates service worker automatically:

```bash
npm run build
```

### Step 3: Controller Integration

For any POST/PATCH/DELETE operation in controllers:

```typescript
import { executeOrQueue } from '../utils/offlineQueue';

// Example: Create workout
async createWorkout(workoutData: any) {
    const result = await executeOrQueue(
        {
            type: 'CREATE',
            entityType: 'workout',
            endpoint: '/workouts',
            method: 'POST',
            body: workoutData,
        },
        // Online executor
        () => new Post({
            url: `${getApiBaseUrl()}/workouts`,
            body: workoutData,
        }).execute(),
        // Optimistic update
        () => {
            this.workoutsStore.addWorkout({
                ...workoutData,
                id: `temp-${Date.now()}`,
                _pending: true,
            });
        }
    );

    if (result.queued) {
        toast.info('Changes will sync when online');
    } else if (result.response?.ok) {
        const saved = await result.response.json();
        this.workoutsStore.updateWorkout(saved);
    }
}
```

### Step 4: Store Enhancement

Add pending state tracking to MobX stores:

```typescript
export interface WorkoutInterface {
    id: number | string;
    name: string;
    _pending?: boolean; // Flag for UI to show sync status
}

@observable
workouts: WorkoutInterface[] = [];

@action
addWorkout(workout: WorkoutInterface) {
    this.workouts.push(workout);
}

@action
updateWorkout(workout: WorkoutInterface) {
    const index = this.workouts.findIndex(w => w.id === workout.id);
    if (index !== -1) {
        this.workouts[index] = workout;
    }
}
```

### Step 5: UI Indicators

Show pending status in UI components:

```tsx
<div className={workout._pending ? "pending" : ""}>
  {workout.name}
  {workout._pending && <span className="sync-icon">⟳</span>}
</div>
```

## Features Implemented

### ✅ Core Infrastructure

- [x] Service worker with Workbox
- [x] Offline queue system
- [x] IndexedDB storage
- [x] Network status detection
- [x] Automatic sync on reconnection

### ✅ PWA Features

- [x] App manifest with proper metadata
- [x] Installable on mobile/desktop
- [x] Offline indicator UI
- [x] Pending operations counter

### ⏳ Controller Integration (Partial)

The offline queue utility is available for use in all controllers. Integration examples provided in:

- `src/utils/offlineQueueExamples.ts`

Controllers that need integration:

- [ ] WorkoutsController - workout CRUD operations
- [ ] WorkoutsController - workout session operations (start/finish workout, sets)
- [ ] PlansController - plan CRUD operations
- [ ] TrainingGoalsController - goal/milestone operations
- [ ] UserController - measurements and profile updates
- [ ] ExercisesController (already has partial implementation)

### ⏳ Store Enhancements (Partial)

- [ ] Add `_pending` flag to all entity interfaces
- [ ] Add optimistic update methods
- [ ] Add temporary ID handling for offline-created items

## Testing

### Test Offline Functionality

1. **Development Mode**:

   ```bash
   npm start
   ```

   Open DevTools → Network → Set to "Offline"

2. **Production Mode**:

   ```bash
   npm run build
   npx serve -s dist
   ```

   Test service worker caching

3. **Test Cases**:
   - Create workout while offline
   - Update workout while offline
   - Delete workout while offline
   - Go offline during active workout session
   - Record sets while offline
   - Verify sync after reconnection

### Network Simulation

In Chrome DevTools:

1. Network tab → Throttling dropdown
2. Select "Offline" or "Slow 3G"
3. Test all CRUD operations
4. Switch back to "Online"
5. Verify automatic sync

## Capacitor Native Apps

### iOS/Android Builds

The offline system works automatically in Capacitor apps:

```bash
# Sync web assets
npx cap sync

# Open in Xcode/Android Studio
npx cap open ios
npx cap open android
```

### Native Storage (Optional)

For critical data that must survive app uninstall, integrate Capacitor Preferences:

```typescript
import { Preferences } from "@capacitor/preferences";

// Save critical data
await Preferences.set({
  key: "active_workout_session",
  value: JSON.stringify(sessionData),
});

// Retrieve on app restart
const { value } = await Preferences.get({ key: "active_workout_session" });
```

## Configuration

### Service Worker Cache Strategy

Edit `src/service-worker.ts` to customize:

```typescript
// API cache duration
new NetworkFirst({
  cacheName: "api-cache",
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 24 * 60 * 60, // 24 hours
    }),
  ],
});
```

### Offline Queue Settings

Edit `src/services/cacheService.ts`:

```typescript
const MAX_RETRY_COUNT = 3; // Max retry attempts
const CACHE_TTL = 1000 * 60 * 60 * 24; // Cache expiration
```

## Events

### Listen for Sync Events

```typescript
// Listen for sync completion
window.addEventListener("offline-sync-complete", (event: CustomEvent) => {
  const result = event.detail;
  console.log(`Synced: ${result.syncedCount}, Failed: ${result.failedCount}`);
});

// Trigger manual sync
import { syncAllQueued } from "./utils/offlineQueue";
await syncAllQueued();
```

## Troubleshooting

### Service Worker Not Updating

Clear cache and hard reload:

- Chrome: DevTools → Application → Service Workers → "Unregister"
- Or: Shift + Cmd/Ctrl + R

### Queue Not Syncing

Check network listener:

```typescript
import { onNetworkChange } from "./utils/network";

onNetworkChange((connected) => {
  console.log("Network status:", connected);
});
```

### IndexedDB Quota Exceeded

Clear old cache:

```typescript
import { cacheService } from "./services/cacheService";
await cacheService.clearAll();
```

## Next Steps

### Priority: Critical Features

1. Integrate offline queue into WorkoutsController for workout sessions
2. Add optimistic updates to workoutStore
3. Test workout session offline → online flow
4. Add UI indicators for pending sets/exercises

### Enhancement: Additional Features

1. Background sync API for automatic retry
2. Differential sync (only send changes)
3. Conflict resolution UI for merge conflicts
4. Export/import offline data
5. Storage quota management

## Resources

- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [PWA Checklist](https://web.dev/pwa-checklist/)

## Files Modified

### New Files

- `src/service-worker.ts` - Service worker with Workbox
- `src/serviceWorkerRegistration.ts` - SW registration utility
- `src/utils/offlineQueue.ts` - Offline queue utilities
- `src/utils/offlineQueueExamples.ts` - Integration examples
- `src/components/Common/OfflineIndicator.tsx` - UI component
- `src/components/Common/OfflineIndicator.style.scss` - Styles

### Modified Files

- `webpack.production.js` - Added Workbox plugin
- `src/index.tsx` - Added SW registration
- `src/services/cacheService.ts` - Enhanced with queue system
- `src/components/App.tsx` - Added OfflineIndicator
- `public/manifest.json` - Enhanced PWA metadata
- `package.json` - Added dependencies

## Summary

The app now has a solid foundation for offline functionality:

- ✅ Service worker caches assets and API responses
- ✅ Offline queue system for mutations
- ✅ UI indicators for offline status and pending sync
- ✅ Automatic sync on reconnection
- ⏳ Ready for controller integration (examples provided)

To complete the implementation, integrate the offline queue into each controller's mutation methods using the patterns in `offlineQueueExamples.ts`.
