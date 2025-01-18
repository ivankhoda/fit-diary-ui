import React, { useCallback } from 'react';
import './CurrentExercise.style.scss';
import { useTranslation } from 'react-i18next';
import { ExerciseInterface } from '../../../../../store/exercisesStore';
import { convertDurationToMMSS } from '../../../../Admin/utils/convertDurationToMMSS';
import { parseDurationInput } from '../../../../Admin/utils/paraseDurationInput';

interface CurrentExerciseProps {
  exercise: ExerciseInterface;
  exerciseDone: (exercise: ExerciseInterface) => void;
    handleWeightChange: (exercise: ExerciseInterface) => void;
    handleRepetitionsChange: (exercise: ExerciseInterface) => void;
    setDone: () => void;
    handleDurationChange: (exercise: ExerciseInterface) => void;
    handleDistanceChange: (exercise: ExerciseInterface) => void;

}

export const CurrentExercise: React.FC<CurrentExerciseProps> =({exercise,
    handleRepetitionsChange,
    handleWeightChange,
    handleDurationChange, handleDistanceChange, setDone}): React.JSX.Element => {
    const { type_of_measurement, repetitions, weight, duration, distance } = exercise;
    const { t, i18n } = useTranslation();

    const handleRepetitionsInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleRepetitionsChange({ ...exercise, repetitions: parseInt(e.target.value, 10) });
    }, [exercise, handleRepetitionsChange]);

    const handleWeightInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;

            if (/^\d*\.?\d*$/u.test(value)) {
                handleWeightChange({ ...exercise, weight: value || '' });
            }
        },
        [exercise, handleWeightChange]
    );

    const handleDurationInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const totalSeconds = parseDurationInput(e.target.value);
        handleDurationChange({ ...exercise, duration: totalSeconds });
    }, [exercise, handleDurationChange]);

    const handleSetDone = useCallback(() => {
        setDone();
    }, [setDone]);


    const handleDistanceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleDistanceChange({ ...exercise, distance: parseFloat(e.target.value).toString() });
    }, [exercise, handleDistanceChange]);
    return (


        <div className='current-exercise'>
            <h2>{exercise.name}</h2>
            <div className='exercise-small-table-data'>
                {type_of_measurement === 'weight_and_reps' && (

                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <input
                                type="text"
                                value={repetitions || ''}
                                min="0"
                                onChange={handleRepetitionsInputChange}
                            />
                        </div>
                        <div>
                            <label>{i18n.t('exercise.weight')}</label>
                            <input
                                type="text"
                                value={weight}
                                step="0.1"
                                min={'0.0'}
                                onChange={handleWeightInputChange}
                            />
                        </div>
                    </div>
                )}

                {type_of_measurement === 'reps' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <input
                                type="text"
                                value={repetitions || ''}
                                min="0"
                                onChange={handleRepetitionsInputChange}
                            />
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration' && (
                    <div className="exercise-fields">
                        <div>
                            <input
                                type="text"
                                value={duration ? convertDurationToMMSS(duration) : '00:00'}
                                onChange={handleDurationInputChange}
                                placeholder="MM:SS"
                            />
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration_and_reps' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <input
                                type="text"
                                value={duration ? convertDurationToMMSS(duration) : '00:00'}
                                onChange={handleDurationInputChange}
                                placeholder="MM:SS"
                            />
                        </div>
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <input
                                type="text"
                                value={repetitions || ''}
                                min="0"
                                onChange={handleRepetitionsInputChange}
                            />
                        </div>
                    </div>
                )}

                {type_of_measurement === 'cardio' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <input
                                type="text"
                                value={duration ? convertDurationToMMSS(duration) : '00:00'}
                                onChange={handleDurationInputChange}
                                placeholder="MM:SS"
                            />
                        </div>
                        <div>
                            <label>{i18n.t('exercise.distance')}</label>
                            <input
                                type="number"
                                value={distance || 0}
                                min="0"
                                step={'0,1'}
                                onChange={handleDistanceInputChange}

                            />
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration_and_distance' && (
                    <div className="exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <input
                                type="text"
                                value={duration ? convertDurationToMMSS(duration) : '00:00'}
                                onChange={handleDurationInputChange}
                                placeholder="MM:SS"

                            />
                        </div>
                        <div>
                            <label>{i18n.t('exercise.distance')}</label>
                            <input
                                type="number"
                                value={distance || 0}
                                min="0"
                                step={'0,1'}
                                onChange={handleDistanceInputChange}

                            />
                        </div>
                    </div>
                )}

                <button onClick={handleSetDone}>{t('workout.setDone')}</button>

            </div>
        </div>
    );
};
