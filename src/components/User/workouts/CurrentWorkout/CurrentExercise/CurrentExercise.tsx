/* eslint-disable no-magic-numbers */
import React, { useCallback, useEffect, useState } from 'react';
import './CurrentExercise.style.scss';
import { useTranslation } from 'react-i18next';
import { ExerciseInterface } from '../../../../../store/exercisesStore';
import { TimeInput } from '../../../../Common/TimeInput';
import RepetitionsInput from '../../../../Common/RepetitionsInput';
import WeightInput from '../../../../Common/WeightInput';
import DistanceInput from '../../../../Common/DistanceInput';
import CommentInput from '../../../../Common/CommentInput';

export interface CurrentExerciseProps {
  exercise: ExerciseInterface;
  exerciseDone: (exercise: ExerciseInterface) => void;
    handleWeightChange: (weight: string, exercise: ExerciseInterface) => void;
    handleRepetitionsChange: (repetitions: string, exercise: ExerciseInterface) => void;
    setDone: () => void;
    handleDurationChange: (duration: string, exercise?: ExerciseInterface, ) => void;
    handleDistanceChange: (distance: string, exercise: ExerciseInterface) => void;
    finishExerciseClick?: (exercise?: ExerciseInterface) => void;
    startExerciseClick?: (exercise?: ExerciseInterface) => void;
    handleCommentChange: (comment: string, exercise: ExerciseInterface) => void;
    currentUserExercise?: ExerciseInterface;
}

export const CurrentExercise: React.FC<CurrentExerciseProps> =({exercise,
    handleRepetitionsChange,
    handleWeightChange, handleDistanceChange,
    setDone, handleDurationChange, startExerciseClick, finishExerciseClick, currentUserExercise,
    handleCommentChange}): React.JSX.Element => {
    if (!currentUserExercise){
        return <></>;
    }

    const { type_of_measurement} = currentUserExercise;
    const { t, i18n } = useTranslation();
    const [duration, setDuration] = useState<string>('00:00');

    const handleSetDone = useCallback(() => {
        setDone();
    }, [setDone]);

    const handleFinishExerciseClick = useCallback(() => {
        finishExerciseClick(exercise);
    }, [finishExerciseClick, exercise]);

    const handleStartExerciseClick = useCallback(() => {
        startExerciseClick(exercise);
    }, [startExerciseClick, exercise]);

    const formatDuration = (elapsed: number): string => {
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

        if (hours > 0) {
            return [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');
        }

        return [
            minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')
        ].join(':');
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined = null;

        if (currentUserExercise?.started_at) {
            const startTime = new Date(currentUserExercise.started_at).getTime();

            interval = setInterval(() => {
                const now = new Date().getTime();
                const elapsed = now - startTime;
                setDuration(formatDuration(elapsed));
            }, 1000);
        }

        return () => {
            if (interval) {clearInterval(interval);}
        };
    }, [currentUserExercise, exercise]);

    useEffect(() => {
        setDuration('00:00');
    }, [exercise.id]);

    return (
        <div className='current-exercise'>
            <div className='exercise-small-table-header'>
                <h2>{exercise.name}</h2>
                {currentUserExercise?.started_at && !currentUserExercise?.formatted_duration && <p>{duration}</p>}
            </div>

            <div className='exercise-small-table-data'>
                {type_of_measurement === 'weight_and_reps' && (

                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <RepetitionsInput onChange={handleRepetitionsChange} exercise={exercise}/>
                        </div>
                        <div>
                            <label>{i18n.t('exercise.weight')}</label>
                            <WeightInput onChange={handleWeightChange} exercise={exercise}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'reps' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <RepetitionsInput onChange={handleRepetitionsChange} exercise={exercise}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <TimeInput onChange={handleDurationChange} exercise={exercise}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration_and_reps' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <TimeInput onChange={handleDurationChange} exercise={exercise}/>
                        </div>
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <RepetitionsInput onChange={handleRepetitionsChange} exercise={exercise}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'cardio' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <TimeInput onChange={handleDurationChange} exercise={exercise}/>
                        </div>
                        <div>
                            <label>{i18n.t('exercise.distance')}</label>
                            <DistanceInput onChange={handleDistanceChange} exercise={exercise}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration_and_distance' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <TimeInput onChange={handleDurationChange} exercise={exercise}/>
                        </div>
                        <div>
                            <label>{i18n.t('exercise.distance')}</label>
                            <DistanceInput onChange={handleDistanceChange} exercise={exercise}/>
                        </div>
                    </div>
                )}
                <div className='button-group'>
                    {currentUserExercise && currentUserExercise?.started_at && <button onClick={handleFinishExerciseClick}>
                        {t('workout.finishExercise')}
                    </button>}
                    {currentUserExercise && currentUserExercise?.started_at && <button onClick={handleSetDone}>{t('workout.setDone')}</button>}
                    {currentUserExercise && !currentUserExercise?.started_at && <button onClick={handleStartExerciseClick}>
                        {t('workout.startExercise')}
                    </button>}

                    {currentUserExercise && currentUserExercise?.started_at && <CommentInput  exercise={currentUserExercise}
                        onChange={handleCommentChange}/>}
                </div>
            </div>
        </div>
    );
};
