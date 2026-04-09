import { TFunction } from 'i18next';
import { convertDurationToMMSS } from '../../../../../Admin/utils/convertDurationToMMSS';
import { PersonalBestMetric, PersonalBests } from '../../../../../../store/userStore';

const HOURS_IN_SECONDS = 3600;
const MILLISECONDS_IN_SECOND = 1000;
const ISO_TIME_END_INDEX = 19;
const ISO_TIME_START_INDEX = 11;

export interface ExerciseBenchmarkDisplayItem {
    key: string;
    label: string;
    value: string;
}

export interface ExerciseBenchmarkDisplayConfigItem {
    formatValue: (entry: PersonalBestMetric, translate: TFunction) => string;
    key: string;
    labelKey: string;
}

const formatDateValue = (rawValue: number | string): string => {
    if (typeof rawValue !== 'string') {
        return String(rawValue);
    }

    const normalizedValue = rawValue.replace(' ', 'T').replace(' UTC', 'Z');
    const parsedDate = new Date(normalizedValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return rawValue;
    }

    return parsedDate.toLocaleDateString();
};

const formatDurationValue = (rawValue: number | string): string => {
    const durationInSeconds = Number(rawValue);

    if (Number.isNaN(durationInSeconds)) {
        return String(rawValue);
    }

    if (durationInSeconds < HOURS_IN_SECONDS) {
        return convertDurationToMMSS(durationInSeconds);
    }

    const durationDate = new Date(durationInSeconds * MILLISECONDS_IN_SECOND);
    return durationDate.toISOString().slice(ISO_TIME_START_INDEX, ISO_TIME_END_INDEX);
};

export const DEFAULT_EXERCISE_BENCHMARK_CONFIG: ExerciseBenchmarkDisplayConfigItem[] = [
    {
        formatValue: (entry, translate) => `${entry.value} ${translate('workoutData.kg')}`,
        key: 'weight',
        labelKey: 'exerciseStats.personalBests.bestWeight',
    },
    {
        formatValue: (entry, translate) => `${entry.value} ${translate('exerciseStats.personalBests.repsUnit')}`,
        key: 'reps',
        labelKey: 'exerciseStats.personalBests.bestReps',
    },
    {
        formatValue: entry => formatDurationValue(entry.value),
        key: 'duration',
        labelKey: 'exerciseStats.personalBests.bestDuration',
    },
    {
        formatValue: (entry, translate) => `${entry.value} ${translate('exerciseStats.personalBests.distanceUnit')}`,
        key: 'distance',
        labelKey: 'exerciseStats.personalBests.bestDistance',
    },
    {
        formatValue: entry => formatDateValue(entry.value),
        key: 'date',
        labelKey: 'exerciseStats.personalBests.achievedOn',
    },
    {
        formatValue: entry => String(entry.value),
        key: 'estimated_1rm',
        labelKey: 'exerciseStats.personalBests.estimatedOneRepMax',
    },
    {
        formatValue: entry => String(entry.value),
        key: 'max_speed',
        labelKey: 'exerciseStats.personalBests.maxSpeed',
    },
];

export const mapPersonalBestsToDisplayItems = (
    personalBests: PersonalBests | null | undefined,
    translate: TFunction,
    config: ExerciseBenchmarkDisplayConfigItem[] = DEFAULT_EXERCISE_BENCHMARK_CONFIG,
): ExerciseBenchmarkDisplayItem[] => {
    if (!personalBests) {
        return [];
    }

    return config.reduce<ExerciseBenchmarkDisplayItem[]>((items, configItem) => {
        const metric = personalBests[configItem.key];

        if (!metric) {
            return items;
        }

        return [...items, {
            key: configItem.key,
            label: translate(configItem.labelKey),
            value: configItem.formatValue(metric, translate),
        }];
    }, []);
};
