/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
import React from 'react';
import { t } from 'i18next';

interface PersonalBestsProps {
  personalBests: Record<string, any>;
  typeOfMeasurement: string;
}

export const PersonalBests: React.FC<PersonalBestsProps> = ({ personalBests, typeOfMeasurement }) => {
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

    const formatLocalDate = (utcDate: string) => {
        const date = new Date(utcDate);


        return date.toLocaleString('en-GB', { hour12: false });
    };

    return (
        <div className="personal-bests">
            {Object.entries(personalBests).map(([key, value]) => {
                const displayValue = value.value;
                return (
                    <div key={key}>
                        <span>{translationKeys[key]}</span>: {key === 'date' ? formatLocalDate(displayValue) : displayValue}
                    </div>
                );
            })}
        </div>
    );
};
