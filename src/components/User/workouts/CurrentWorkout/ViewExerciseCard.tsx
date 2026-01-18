/* eslint-disable no-undefined */
/* eslint-disable complexity */
import React, { useCallback } from 'react';
import i18n from 'i18next';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import './ViewExerciseCard.style.scss';
import { convertDurationToMMSS } from '../../../Admin/utils/convertDurationToMMSS';

interface ViewExerciseCardProps {
  exercise: ExerciseInterface;
  onClick?: (exercise: ExerciseInterface) => void;
}

const ViewExerciseCard: React.FC<ViewExerciseCardProps> = ({ exercise, onClick }) => {
    const { name, type_of_measurement, sets, repetitions, weight, duration, distance, order, comment } = exercise;

    const handleClick = useCallback(() => {
        if (onClick) {
            onClick(exercise);
        }
    }, [onClick, exercise]);

    return (
        <div
            className="view-exercise-card"
            onClick={handleClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div className="view-exercise-header">
                <strong>{order}. {name}</strong>
            </div>

            <div className="view-exercise-content">
                {type_of_measurement === 'weight_and_reps' && (
                    <div className="view-exercise-data">
                        {repetitions ? <span>{i18n.t('exercise.reps')}: {repetitions}</span> : null}
                        {weight ? <span>{i18n.t('exercise.weight')}: {weight}</span> : null}
                        {sets ? <span>{i18n.t('workoutData.sets')}: {sets}</span> : null}
                    </div>
                )}

                {type_of_measurement === 'reps' && (
                    <div className="view-exercise-data">
                        {repetitions ? <span>{i18n.t('exercise.reps')}: {repetitions}</span> : null}
                        {sets ? <span>{i18n.t('workoutData.sets')}: {sets}</span> : null}
                    </div>
                )}

                {type_of_measurement === 'duration' && (
                    <div className="view-exercise-data">
                        {duration ? <span>{i18n.t('exercise.duration')}: {convertDurationToMMSS(duration)}</span> : null}
                        {sets ? <span>{i18n.t('workoutData.sets')}: {sets}</span> : null}
                    </div>
                )}

                {type_of_measurement === 'duration_and_reps' && (
                    <div className="view-exercise-data">
                        {repetitions ? <span>{i18n.t('exercise.reps')}: {repetitions}</span> : null}
                        {duration ? <span>{i18n.t('exercise.duration')}: {convertDurationToMMSS(duration)}</span> : null}
                        {sets ? <span>{i18n.t('workoutData.sets')}: {sets}</span> : null}
                    </div>
                )}

                {type_of_measurement === 'cardio' && (
                    <div className="view-exercise-data">
                        {duration ? <span>{i18n.t('exercise.duration')}: {convertDurationToMMSS(duration)}</span> : null}
                        {distance ? <span>{i18n.t('exercise.distance')}: {distance}</span> : null}
                        {sets ? <span>{i18n.t('workoutData.sets')}: {sets}</span> : null}
                    </div>
                )}

                {type_of_measurement === 'duration_and_distance' && (
                    <div className="view-exercise-data">
                        {duration ? <span>{i18n.t('exercise.duration')}: {convertDurationToMMSS(duration)}</span> : null}
                        {distance ? <span>{i18n.t('exercise.distance')}: {distance}</span> : null}
                        {sets ? <span>{i18n.t('workoutData.sets')}: {sets}</span> : null}
                    </div>
                )}

                {comment && (
                    <div className="view-exercise-comment">
                        <span>{comment}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewExerciseCard;
