import { SetInterface } from '../store/exercisesStore';

export const EXERCISE_STATS_REFRESH_DELAY_MS = 2000;

export class ExerciseStatsRefreshScheduler {
    private timeoutId: number | null = null;

    schedule(onStartRefresh: () => void, refetch: () => Promise<void> | void): void {
        onStartRefresh();

        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
        }

        this.timeoutId = window.setTimeout(() => {
            this.timeoutId = null;
            refetch();
        }, EXERCISE_STATS_REFRESH_DELAY_MS);
    }
}

export const handleSuccessfulSetSave = (
    savedSet: SetInterface,
    applySavedSet: (savedSet: SetInterface) => void,
    scheduleRefresh?: () => void,
): void => {
    applySavedSet(savedSet);
    scheduleRefresh?.();
};
