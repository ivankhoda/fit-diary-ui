/* eslint-disable max-params */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import i18n from 'i18next';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import './SelectedExercise.style.scss';
import { convertDurationToMMSS } from '../../../Admin/utils/convertDurationToMMSS';
import { parseDurationInput } from '../../../Admin/utils/paraseDurationInput';

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


    const handleSetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        const parsedValue = String(parseInt(value, 10));
        handleExerciseDetailChange(id, 'sets', parsedValue);
    };

    const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        const parsedValue = String(parseInt(value, 10));
        handleExerciseDetailChange(id, 'repetitions', parsedValue);
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let {value} = e.target;
        value = value.replace(',', '.');
        const isValid = /^(?:\d+(?:\.\d{0,2})?)?$/u.test(value);

        if (isValid || value === '') {
            handleExerciseDetailChange(id, 'weight', value);
        }
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const totalSeconds = parseDurationInput(e.target.value);
        handleExerciseDetailChange(id, 'duration', String(totalSeconds));
        e.target.value = convertDurationToMMSS(totalSeconds);
    };

    const handleBlur = (field: string, value: string | number | null) => {
        const updatedExercise = { ...exercise, [field]: value };
        editWorkoutExercise(updatedExercise);
    };

    const handleDurationBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const totalSeconds = parseDurationInput(e.target.value);
        const updatedExercise = { ...exercise, duration: totalSeconds };
        editWorkoutExercise(updatedExercise);
    };

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
                                <input
                                    type="number"
                                    value={repetitions|| 1}
                                    onChange={handleRepsChange}
                                    onBlur={e => handleBlur('repetitions', e.target.value)}
                                />
                            </div>
                            <div>
                                <label>{i18n.t('exercise.weight')}</label>
                                <input
                                    type="text"
                                    value={weight ?? '1'}
                                    step="0.1"
                                    onChange={handleWeightChange}
                                    onBlur={e => handleBlur('weight', e.target.value)}
                                />
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
                                <input
                                    type="number"
                                    value={repetitions || 1}
                                    min="1"
                                    onChange={handleRepsChange}
                                    onBlur={e => handleBlur('repetitions', e.target.value)}
                                />
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
                                <input
                                    type="text"
                                    value={duration ? convertDurationToMMSS(duration) : '00:00'}
                                    onChange={handleDurationChange}
                                    placeholder="MM:SS"
                                    onBlur={handleDurationBlur}
                                />
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
                                <input
                                    type="text"
                                    value={duration ? convertDurationToMMSS(duration) : '00:00'}
                                    onChange={handleDurationChange}
                                    placeholder="MM:SS"
                                    onBlur={handleDurationBlur}
                                />
                            </div>
                            <div>
                                <label>{i18n.t('exercise.reps')}</label>
                                <input
                                    type="number"
                                    value={repetitions || 1}
                                    min="1"
                                    onChange={handleRepsChange}
                                    onBlur={e => handleBlur('repetitions', e.target.value)}
                                />
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
                                <input
                                    type="text"
                                    value={duration ? convertDurationToMMSS(duration) : '00:00'}
                                    onChange={handleDurationChange}
                                    placeholder="MM:SS"
                                    onBlur={handleDurationBlur}
                                />
                            </div>
                            <div>
                                <label>{i18n.t('exercise.distance')}</label>
                                <input
                                    type="number"
                                    value={distance || 0}
                                    min="0"
                                    step={'0,1'}
                                    onChange={e => handleExerciseDetailChange(id, 'distance', String(parseFloat(e.target.value)))}
                                    onBlur={e => handleBlur('distance', e.target.value)}
                                />
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
                                <input
                                    type="text"
                                    value={duration ? convertDurationToMMSS(duration) : '00:00'}
                                    onChange={handleDurationChange}
                                    placeholder="MM:SS"
                                    onBlur={handleDurationBlur}
                                />
                            </div>
                            <div>
                                <label>{i18n.t('exercise.distance')}</label>
                                <input
                                    type="number"
                                    value={distance || 0}
                                    min="0"
                                    step={'0,1'}
                                    onChange={e => handleExerciseDetailChange(id, 'distance', String(parseFloat(e.target.value)))}
                                    onBlur={e => handleBlur('distance', e.target.value)}
                                />
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
                                onBlur={e => handleBlur('sets', e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleExerciseDelete(id)}
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
