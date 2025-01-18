/* eslint-disable max-params */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import i18n from 'i18next';

import './AdminSelectedExercise.style.scss';
import { convertDurationToMMSS } from '../../../Admin/utils/convertDurationToMMSS';
import { parseDurationInput } from '../../../Admin/utils/paraseDurationInput';
import { AdminExerciseProfile } from '../../store/AdminExercisesStore';

interface AdminSelectedExerciseProps {
  exercise: AdminExerciseProfile;
  handleExerciseDetailChange: (id: number, field: string, value: string) => void;
  handleExerciseDelete: (exerciseId: number) => void;
  editWorkoutExercise: (editedExercise: AdminExerciseProfile) => void;
  mode: 'edit' | 'view';
}

const AdminSelectedExercise: React.FC<AdminSelectedExerciseProps> = ({
    exercise,
    handleExerciseDetailChange,
    handleExerciseDelete,
    editWorkoutExercise,
    mode,
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

    const renderEditableFields = () => {
        switch (type_of_measurement) {
        case 'weight_and_reps':
            return (
                <div className="exercise-fields">
                    <div>
                        <label>{i18n.t('exercise.reps')}</label>
                        <input
                            type="number"
                            value={repetitions || 1}
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
            );
        case 'reps':
            return (
                <div className="exercise-fields">
                    <div>
                        <label>{i18n.t('exercise.reps')}</label>
                        <input
                            type="number"
                            value={repetitions || 1}
                            onChange={handleRepsChange}
                            onBlur={e => handleBlur('repetitions', e.target.value)}
                        />
                    </div>
                </div>
            );
        case 'duration':
            return (
                <div className="exercise-fields">

                    <div>
                        <label>{i18n.t('exercise.duration')}</label>
                        <input
                            type="text"
                            value={duration ? convertDurationToMMSS(duration) : '00:00'}
                            onChange={handleDurationChange}
                            onBlur={handleDurationBlur}
                        />
                    </div>
                </div>
            );
        case 'duration_and_reps':
            return (
                <div className="exercise-fields">
                    <div>
                        <label>{i18n.t('exercise.reps')}</label>
                        <input
                            type="number"
                            value={repetitions || 1}
                            onChange={handleRepsChange}
                            onBlur={e => handleBlur('repetitions', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>{i18n.t('exercise.duration')}</label>
                        <input
                            type="text"
                            value={duration ? convertDurationToMMSS(duration) : '00:00'}
                            onChange={handleDurationChange}
                            onBlur={handleDurationBlur}
                        />
                    </div>
                </div>
            );
        case 'cardio':
        case 'duration_and_distance':
            return (
                <div className="exercise-fields">
                    <div>
                        <label>{i18n.t('exercise.duration')}</label>
                        <input
                            type="text"
                            value={duration ? convertDurationToMMSS(duration) : '00:00'}
                            onChange={handleDurationChange}
                            onBlur={handleDurationBlur}
                        />
                    </div>
                    <div>
                        <label>{i18n.t('exercise.distance')}</label>
                        <input
                            type="number"
                            value={distance || 0}
                            min="0"
                            onChange={e => handleExerciseDetailChange(id, 'distance', String(parseFloat(e.target.value)))}
                            onBlur={e => handleBlur('repetitions', e.target.value)}
                        />
                    </div>
                </div>
            );
        default:
            return null;
        }
    };

    return (
        <div className={`exercise-admin-small-table ${mode === 'view' ? '_mode' : ''}`}>
            <div>
                <strong>{name}</strong>
            </div>
            <div className="exercise-admin-small-table-data">
                {mode === 'edit'
                    ? (
                        <>
                            {renderEditableFields()}
                            <div className="exercise-fields">
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
                        </>
                    )
                    : (
                        <div className="exercise-fields_mode">
                            {type_of_measurement === 'weight_and_reps' && (
                                <>
                                    {i18n.t('exercise.reps')}: {repetitions}
                                    <b />
                                    {i18n.t('exercise.weight')}: {weight}
                                    <b />
                                    {i18n.t('workoutData.sets')}: {sets}
                                </>
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default AdminSelectedExercise;
