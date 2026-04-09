import {
    EXERCISE_STATS_REFRESH_DELAY_MS,
    ExerciseStatsRefreshScheduler,
    handleSuccessfulSetSave,
} from './exerciseStatsRefresh';

describe('exercise stats refresh orchestration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('applies the saved set and triggers delayed statistics refetch', () => {
        const applySavedSet = jest.fn();
        const markRefreshing = jest.fn();
        const refetchExerciseStats = jest.fn();
        const scheduler = new ExerciseStatsRefreshScheduler();
        const savedSet = {
            id: 'set-1',
            repetitions: '10',
            result: 'done',
            user_exercise_id: 99,
        };

        handleSuccessfulSetSave(savedSet, applySavedSet, () => {
            scheduler.schedule(markRefreshing, refetchExerciseStats);
        });

        expect(applySavedSet).toHaveBeenCalledWith(savedSet);
        expect(markRefreshing).toHaveBeenCalledTimes(1);
        expect(refetchExerciseStats).not.toHaveBeenCalled();

        jest.advanceTimersByTime(EXERCISE_STATS_REFRESH_DELAY_MS);

        expect(refetchExerciseStats).toHaveBeenCalledTimes(1);
    });
});
