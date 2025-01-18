/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SetInterface } from '../../../../../store/exercisesStore';
import { convertDurationToMMSS } from '../../../../Admin/utils/convertDurationToMMSS';

interface UserExerciseSetsProps {
  sets: SetInterface[];
  measurementType: string;
  deleteSet?: (setId: string, exerciseId: number) => void;
  exerciseId: number;
}

export const UserExerciseSets: React.FC<UserExerciseSetsProps> = ({ sets, measurementType, deleteSet, exerciseId }) => {
    const { t } = useTranslation();

    const renderSetDetails = (set: SetInterface, index: number) => {
        switch (measurementType) {
        case 'weight_and_reps':
            return (
                <p>
                    {index + 1} - {t('workoutData.repetitions')}: {set.repetitions}, {t('workoutData.weight')}: {set.weight}
                </p>
            );
        case 'reps':
            return (
                <p>
                    {index + 1} - {t('workoutData.repetitions')}: {set.repetitions}
                </p>
            );
        case 'duration':
            return (
                <p>
                    {index + 1} - {t('workoutData.duration')}: {convertDurationToMMSS(set.duration)}
                </p>
            );
        case 'duration_and_reps':
            return (
                <p>
                    {index + 1} - {t('workoutData.duration')}: {convertDurationToMMSS(set.duration)},
                    {t('workoutData.repetitions')}: {set.repetitions}
                </p>
            );
        case 'cardio':
            return (
                <p>
                    {index + 1} - {t('workoutData.duration')}: {convertDurationToMMSS(set.duration)},
                    {t('workoutData.distance')}: {set.distance}
                </p>
            );
        case 'duration_and_distance':
            return (
                <p>
                    {index + 1} - {t('workoutData.duration')}: {convertDurationToMMSS(set.duration)},
                    {t('workoutData.distance')}: {set.distance}
                </p>
            );
        default:
            return (
                <p>
                    {index + 1} - {t('workoutData.result')}: {set.repetitions}
                </p>
            );
        }
    };

    return (
        <div className="user-set-details">
            {sets.map((set, index) => (
                <div key={set.id}>
                    {renderSetDetails(set, index)}
                    {deleteSet && <button onClick={() => {deleteSet(set.id, exerciseId);}}>
                      X
                    </button>}
                </div>
            ))}
        </div>
    );
};
