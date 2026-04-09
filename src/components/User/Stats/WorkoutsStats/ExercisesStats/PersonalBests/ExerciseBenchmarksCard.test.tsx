import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { t } from 'i18next';
import { ExerciseBenchmarksCard } from './ExerciseBenchmarksCard';
import { mapPersonalBestsToDisplayItems } from './mapPersonalBestsToDisplayItems';
import { PersonalBests } from '../../../../../../store/userStore';

const translations: Record<string, string> = {
    'exerciseStats.personalBests.achievedOn': 'Achieved on',
    'exerciseStats.personalBests.bestDistance': 'Best distance',
    'exerciseStats.personalBests.bestDuration': 'Best duration',
    'exerciseStats.personalBests.bestReps': 'Best reps',
    'exerciseStats.personalBests.bestWeight': 'Best weight',
    'exerciseStats.personalBests.distanceUnit': 'm',
    'exerciseStats.personalBests.empty': 'No personal bests yet',
    'exerciseStats.personalBests.refreshing': 'Refreshing after set save...',
    'exerciseStats.personalBests.repsUnit': 'reps',
    'exerciseStats.personalBests.title': 'Personal bests',
    'workoutData.kg': 'kg',
};

jest.mock('i18next', () => ({
    t: (key: string) => translations[key] ?? key,
}));

const renderBenchmarks = (personalBests: PersonalBests, isRefreshing = false) => {
    const items = mapPersonalBestsToDisplayItems(personalBests, t);

    return render(<ExerciseBenchmarksCard isRefreshing={isRefreshing} items={items} />);
};

describe('ExerciseBenchmarksCard', () => {
    it('renders weight_and_reps personal bests', () => {
        renderBenchmarks({
            date: { value: '2026-04-01T12:30:00Z' },
            reps: { value: 12 },
            weight: { value: 100 },
        });

        expect(screen.getByText('Personal bests')).toBeInTheDocument();
        expect(screen.getByText('Best weight')).toBeInTheDocument();
        expect(screen.getByText('100 kg')).toBeInTheDocument();
        expect(screen.getByText('Best reps')).toBeInTheDocument();
        expect(screen.getByText('12 reps')).toBeInTheDocument();
        expect(screen.getByText('Achieved on')).toBeInTheDocument();
        expect(screen.getByText(new Date('2026-04-01T12:30:00Z').toLocaleDateString())).toBeInTheDocument();
    });

    it('renders reps-only personal bests', () => {
        renderBenchmarks({
            reps: { value: 25 },
        });

        expect(screen.getByText('25 reps')).toBeInTheDocument();
        expect(screen.queryByText('Best weight')).not.toBeInTheDocument();
    });

    it('renders duration personal bests with formatted time', () => {
        renderBenchmarks({
            duration: { value: 125 },
        });

        expect(screen.getByText('Best duration')).toBeInTheDocument();
        expect(screen.getByText('02:05')).toBeInTheDocument();
    });

    it('renders cardio personal bests with distance and long duration', () => {
        renderBenchmarks({
            distance: { value: 1600 },
            duration: { value: 3605 },
        });

        expect(screen.getByText('Best distance')).toBeInTheDocument();
        expect(screen.getByText('1600 m')).toBeInTheDocument();
        expect(screen.getByText('01:00:05')).toBeInTheDocument();
    });

    it('renders empty state and refresh status', () => {
        renderBenchmarks({}, true);

        expect(screen.getByText('No personal bests yet')).toBeInTheDocument();
        expect(screen.getByText('Refreshing after set save...')).toBeInTheDocument();
    });
});
