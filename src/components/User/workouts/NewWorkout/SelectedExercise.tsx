/* eslint-disable max-lines-per-function */

/* eslint-disable complexity */

import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import i18n from 'i18next';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import './SelectedExercise.style.scss';
import { convertDurationToMMSS } from '../../../Admin/utils/convertDurationToMMSS';
import RepetitionsInput from '../../../Common/RepetitionsInput';
import WeightInput from '../../../Common/WeightInput';
import TimeInput from '../../../Common/TimeInput';
import DistanceInput from '../../../Common/DistanceInput';

interface SelectedExerciseProps {
  exercise: ExerciseInterface;
  handleExerciseDetailChange?: (id: number, field: string, value: string) => void;
  handleExerciseDelete?: (exerciseId: number) => void;
  editWorkoutExercise?: (editedExercise: ExerciseInterface) => void;
  mode: 'edit' | 'view';
  onClick?: (exercise: ExerciseInterface) => void;
}

const SelectedExercise: React.FC<SelectedExerciseProps> = ({
    exercise,
    handleExerciseDetailChange,
    handleExerciseDelete, editWorkoutExercise, mode, onClick
}) => {
    const { id, name, type_of_measurement, sets, repetitions, weight, duration, distance } = exercise;


    const handleSetsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        const parsedValue = String(parseInt(value, 10));
        handleExerciseDetailChange(id, 'sets', parsedValue);
    }, []);

    const handleSetsBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        handleBlur('sets', e.target.value);
    }, [exercise]);

    const handleDelete = useCallback(() => {
        handleExerciseDelete(id);
    }, []);

    const handleReps = useCallback((r: string) => {
        handleExerciseDetailChange(id, 'repetitions', r);
    }, []);

    const handleWeightChange = useCallback((w: string) => {
        handleExerciseDetailChange(id, 'weight', w);
    }, []);

    const handleDurationChange = useCallback((d: string) => {
        handleExerciseDetailChange(id, 'duration', d);
    }, []);

    const handleDistanceChange = useCallback((d: string) => {
        handleExerciseDetailChange(id, 'distance', d);
    }, []);

    const handleBlur = useCallback((field: string, value: string | number | null) => {
        const updatedExercise = { ...exercise, [field]: value };
        editWorkoutExercise(updatedExercise);
    }, [exercise]);


    const handleClick = () => {
        if (onClick) {
            onClick(exercise);
        }
    };

    return (
        <div className={`exercise-small-table ${mode === 'view'? '_mode': ''}`}
            onClick={mode === 'view' ?
                handleClick
                : null}
            role={mode === 'view' ? 'button' : null} tabIndex={mode === 'view' ? 0 : null}>
            <div>
                <strong>{name}</strong>
            </div>

            <div className='exercise-small-table-data'>
                {type_of_measurement === 'weight_and_reps' && (
                    mode === 'edit'
                        ? <div className="exercise-fields">
                            <div>
                                <label>{i18n.t('exercise.reps')}</label>
                                <RepetitionsInput onChange={handleReps} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{i18n.t('exercise.weight')}</label>
                                <WeightInput onChange={handleWeightChange} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                        </div>
                        :
                        <div className='exercise-fields_mode'>
                            {i18n.t('exercise.reps')}:  {repetitions}
                            <b/>
                            {i18n.t('exercise.weight')}: {weight}
                            <b/>
                            {i18n.t('workoutData.sets')}: {sets}
                        </div>
                )}

                {type_of_measurement === 'reps' && (
                    mode ==='edit'
                        ?<div className="exercise-fields">
                            <div>
                                <label>{i18n.t('exercise.reps')}</label>
                                <RepetitionsInput onChange={handleReps} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                        </div>
                        : <div className='exercise-fields_mode'>
                            {i18n.t('exercise.reps')}: {repetitions}
                            <b/>
                            {i18n.t('workoutData.sets')}: {sets}
                        </div>
                )}

                {type_of_measurement === 'duration' && (
                    mode==='edit'
                        ?<div className="exercise-fields">
                            <div>
                                <label>{i18n.t('exercise.duration')}</label>
                                <TimeInput onChange={handleDurationChange} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                        </div>
                        :
                        <div className='exercise-fields_mode'>
                            {i18n.t('exercise.duration')}: {duration ? convertDurationToMMSS(duration) : '00:00'}
                            <b/>
                            {i18n.t('workoutData.sets')}: {sets}
                        </div>
                )}

                {type_of_measurement === 'duration_and_reps' && (
                    mode === 'edit'
                        ?<div className="exercise-fields">
                            <div>
                                <label>{i18n.t('exercise.duration')}</label>
                                <TimeInput onChange={handleDurationChange} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{i18n.t('exercise.reps')}</label>
                                <RepetitionsInput onChange={handleReps} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                        </div>
                        : <div className={'exercise-fields_mode'}>
                            {i18n.t('exercise.reps')}: {repetitions}
                            <b/>
                            {i18n.t('exercise.duration')}: {duration ? convertDurationToMMSS(duration) : '00:00'}
                            <b/>
                            {i18n.t('workoutData.sets')}: {sets}
                        </div>
                )}

                {type_of_measurement === 'cardio' && (
                    mode ==='edit'
                        ? <div className="exercise-fields">
                            <div>
                                <label>{i18n.t('exercise.duration')}</label>
                                <TimeInput onChange={handleDurationChange} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{i18n.t('exercise.distance')}</label>
                                <DistanceInput onChange={handleDistanceChange} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                        </div>
                        :<div className='exercise-fields_mode'>
                            {i18n.t('exercise.duration')}: {duration ? convertDurationToMMSS(duration) : '00:00'}
                            <b/>
                            {i18n.t('exercise.distance')}: {distance}
                            <b/>
                            {i18n.t('workoutData.sets')}: {sets}
                        </div>

                )}

                {type_of_measurement === 'duration_and_distance' && (
                    mode==='edit'
                        ? <div className="exercise-fields">
                            <div>
                                <label>{i18n.t('exercise.duration')}</label>
                                <TimeInput onChange={handleDurationChange} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                            <div>
                                <label>{i18n.t('exercise.distance')}</label>
                                <DistanceInput onChange={handleDistanceChange} exercise={exercise} onBlur={handleBlur}/>
                            </div>
                        </div>
                        : <div className='exercise-fields_mode'>
                            {i18n.t('exercise.duration')}: {duration ? convertDurationToMMSS(duration) : '00:00'}
                            <b/>
                            {i18n.t('exercise.distance')}: {distance}
                            <b/>
                            {i18n.t('workoutData.sets')}: {sets}
                        </div>
                )}
                { mode === 'edit'
                    ? <div className='exercise-fields'>
                        <div>
                            <label>{i18n.t('workoutData.sets')}</label>
                            <input
                                type="number"
                                value={sets || 1}
                                min="1"
                                onChange={handleSetsChange}
                                onBlur={handleSetsBlur}
                            />
                        </div>

                        <button
                            type="button"
                            className="delete-btn"
                            onClick={handleDelete}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                    : null}
            </div>
        </div>
    );
};

export default SelectedExercise;
