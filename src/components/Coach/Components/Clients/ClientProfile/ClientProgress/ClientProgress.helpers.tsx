import React from 'react';

import {
    ClientProgressData,
    Exercise,
    ExerciseSortOption,
    ExerciseStatItem,
    ExerciseType,
    SummaryCardItem,
} from './ClientProgress.types';

export const ITEMS_PER_PAGE = 5;
export const FIRST_PAGE = 1;
export const INCREMENT_STEP = 1;
export const ZERO_VALUE = 0;
export const PERCENT_MULTIPLIER = 100;
export const EMPTY_TEXT = 'Нет данных';
export const EXERCISES_EMPTY_TEXT = 'Упражнения не найдены';
export const HISTORY_EMPTY_TEXT = 'История и заметки пока не добавлены.';
export const ACTIVITY_EMPTY_TEXT = 'Данных для графика активности пока нет.';
export const LOAD_ERROR_TEXT = 'Не удалось загрузить прогресс клиента.';
export const LAST_UPDATE_FALLBACK = 'Обновлений пока не было';

export const TYPES: ExerciseType[] = [
    'weight_and_reps',
    'reps',
    'duration',
    'duration_and_reps',
    'cardio',
    'duration_and_distance',
];

export const TYPE_LABELS: Record<ExerciseType, string> = {
    cardio: 'Кардио',
    duration: 'Время',
    duration_and_distance: 'Время и дистанция',
    duration_and_reps: 'Время и повторы',
    reps: 'Повторы',
    weight_and_reps: 'Вес и повторы',
};

export const SORT_OPTIONS: Array<{ label: string; value: ExerciseSortOption }> = [
    {
        label: 'По названию',
        value: 'name',
    }, {
        label: 'По типу упражнения',
        value: 'type',
    },
];

export const EMPTY_PROGRESS_DATA: ClientProgressData = {
    activityGraphData: [],
    clientEmail: '',
    clientId: '',
    clientName: '',
    exercises: [],
    historyNotes: [],
    lastUpdate: '',
    summary: {
        avgActivity: '',
        avgStrengthGrowth: '',
        workoutsCount: ZERO_VALUE,
    },
};

const isMissingNumber = (value?: number): boolean => typeof value !== 'number';

const formatNumericValue = (value?: number, unit?: string): string => {
    if (isMissingNumber(value)) {
        return EMPTY_TEXT;
    }

    if (!unit) {
        return String(value);
    }

    return `${value} ${unit}`;
};

const formatRange = (from?: number, to?: number, unit?: string): string => {
    if (isMissingNumber(from) && isMissingNumber(to)) {
        return EMPTY_TEXT;
    }

    return `${formatNumericValue(from, unit)} -> ${formatNumericValue(to, unit)}`;
};

export const createExerciseTypeCounts = (): Record<ExerciseType, number> => ({
    cardio: ZERO_VALUE,
    duration: ZERO_VALUE,
    duration_and_distance: ZERO_VALUE,
    duration_and_reps: ZERO_VALUE,
    reps: ZERO_VALUE,
    weight_and_reps: ZERO_VALUE,
});

const getExerciseStatItems = (exercise: Exercise): ExerciseStatItem[] => {
    switch (exercise.type) {
    case 'weight_and_reps':
        return [
            {
                label: 'Вес',
                value: formatRange(exercise.stats.weightFrom, exercise.stats.weightTo, 'кг'),
            }, {
                label: 'Повторы',
                value: formatRange(exercise.stats.repsFrom, exercise.stats.repsTo),
            },
        ];
    case 'reps':
        return [
            {
                label: 'Повторы',
                value: formatRange(exercise.stats.repsFrom, exercise.stats.repsTo),
            },
        ];
    case 'duration':
    case 'cardio':
        return [
            {
                label: 'Время',
                value: formatRange(exercise.stats.durationFrom, exercise.stats.durationTo, 'мин'),
            },
        ];
    case 'duration_and_reps':
        return [
            {
                label: 'Время',
                value: formatRange(exercise.stats.durationFrom, exercise.stats.durationTo, 'мин'),
            }, {
                label: 'Повторы',
                value: formatRange(exercise.stats.repsFrom, exercise.stats.repsTo),
            },
        ];
    case 'duration_and_distance':
        return [
            {
                label: 'Дистанция',
                value: formatRange(exercise.stats.distanceFrom, exercise.stats.distanceTo, 'км'),
            }, {
                label: 'Время',
                value: formatRange(exercise.stats.durationFrom, exercise.stats.durationTo, 'мин'),
            },
        ];
    default:
        return [];
    }
};

export const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
    const statItems = getExerciseStatItems(exercise);

    return (
        <article className="client-progress__exercise-card">
            <div className="client-progress__exercise-header">
                <div>
                    <h3 className="client-progress__exercise-title">{exercise.name}</h3>
                    <p className="client-progress__exercise-subtitle">Изменения по ключевым метрикам упражнения</p>
                </div>
                <span className="client-progress__exercise-type">{TYPE_LABELS[exercise.type]}</span>
            </div>

            <div className="client-progress__stats-grid">
                {statItems.map(statItem => (
                    <div key={statItem.label} className="client-progress__stat-card">
                        <span className="client-progress__stat-label">{statItem.label}</span>
                        <strong className="client-progress__stat-value">{statItem.value}</strong>
                    </div>
                ))}
            </div>
        </article>
    );
};

export const SummaryCard: React.FC<SummaryCardItem> = ({ hint, label, value }) => (
    <article className="client-progress__summary-card">
        <span className="client-progress__summary-label">{label}</span>
        <strong className="client-progress__summary-value">{value}</strong>
        <span className="client-progress__summary-hint">{hint}</span>
    </article>
);
