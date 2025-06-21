import React from 'react';
import { useTranslation } from 'react-i18next';

import './UserExerciseSets.style.scss';
import { SetInterface } from '../../../../../../store/exercisesStore';
import { convertDurationToMMSS } from '../../../../../Admin/utils/convertDurationToMMSS';

interface UserExerciseSetsProps {
  sets: SetInterface[];
  measurementType: string;
  deleteSet?: (setId: string, exerciseId: number) => void;
  exerciseId: number;
}

const MEASUREMENT_CONFIG: Record<string, string[]> = {
    cardio: ['distance', 'duration'],
    distance: ['distance'],
    duration: ['duration'],
    duration_and_distance: ['duration', 'distance'],
    duration_and_reps: ['duration', 'repetitions'],
    reps: ['repetitions'],
    weight_and_reps: ['repetitions', 'weight'],
};

export const UserExerciseSets: React.FC<UserExerciseSetsProps> = ({
    sets,
    measurementType,
    deleteSet,
    exerciseId,
}) => {
    const { t } = useTranslation();

    const fields = MEASUREMENT_CONFIG[measurementType] || ['reps'];
    // eslint-disable-next-line no-magic-numbers
    const columnCount = fields.length + 2;

    const gridClass = `columns-${columnCount}`;

    const renderHeaders = () => (
        <>
            <span>#</span>
            {fields.map(field => (
                <span key={field}>{t(`workoutData.${field}`)}</span>
            ))}
            <span />
        </>
    );

    const handleDeleteSet = (setId: string) => () => {
        if (deleteSet) {
            deleteSet(setId, exerciseId);
        }
    };

    const renderRow = (set: SetInterface, index: number) => {
        const cells = [
            <span key="index">{index + 1}</span>,
            ...fields.map(field => {
                let value: string | number | undefined = set[field as keyof SetInterface];
                if (field === 'duration' && typeof value === 'number') {
                    value = convertDurationToMMSS(value);
                }
                return <span key={field}>{value}</span>;
            }),
            <span key="delete">
                {deleteSet && (
                    <button
                        onClick={handleDeleteSet(set.id)}
                        className="delete-button"
                        aria-label={t('workoutData.deleteSet')}
                    >
                        X
                    </button>
                )}
            </span>,
        ];

        return (
            <div key={set.id} className={`user-set-row ${gridClass}`}>
                {cells}
            </div>
        );
    };

    return (
        <div className="user-set-details-table">
            <div className={`user-set-header ${gridClass}`}>{renderHeaders()}</div>
            {sets.map(renderRow)}
        </div>
    );
};
