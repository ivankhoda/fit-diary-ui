/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
import React from 'react';
import { t } from 'i18next';
import { convertDurationToMMSS } from '../../../../../Admin/utils/convertDurationToMMSS';

interface PersonalBestsProps {
  personalBests: Record<string, any>;
  typeOfMeasurement: string;
}

export const PersonalBests: React.FC<PersonalBestsProps> = ({
    personalBests,
    typeOfMeasurement,
}) => {
    const getTranslationKeys = (): Record<string, string> => {
        switch (typeOfMeasurement) {
        case 'weight_and_reps':
            return {
                weight: t('exercise.weight'),
                reps: t('exercise.reps'),
                date: t('date'),
            };
        case 'cardio':
            return {
                distance: t('exercise.distance'),
                date: t('date'),
            };
        case 'duration':
            return {
                duration: t('exercise.duration'),
                date: t('date'),
            };
        case 'reps':
            return {
                reps: t('exercise.reps'),
                date: t('date'),
            };
        case 'duration_and_reps':
            return {
                duration: t('exercise.duration'),
                reps: t('exercise.reps'),
                date: t('date'),
            };
        case 'duration_and_distance':
            return {
                distance: t('exercise.distance'),
                duration: t('exercise.duration'),
                date: t('date'),
            };
        default:
            return {};
        }
    };

    const translationKeys = getTranslationKeys();

    const parseUTCStringToLocale = (dateStr: string) => {
        const isoString = dateStr.replace(' ', 'T').replace(' UTC', 'Z');
        const date = new Date(isoString);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString('en-GB', { hour12: false });
    };

    const formatLocalDate = (utcDate: string) => parseUTCStringToLocale(utcDate);

    return (
        <div className="personal-bests">
            {Object.entries(personalBests).map(([key, value]) => {
                const displayValue =
          // eslint-disable-next-line no-nested-ternary
          key === 'date'
              ? formatLocalDate(value.value)
              : key === 'duration'
                  ? convertDurationToMMSS(Number(value.value))
                  : value.value;

                return (
                    <div key={key}>
                        <span>{translationKeys[key]}</span>: {displayValue}
                    </div>
                );
            })}
        </div>
    );
};
