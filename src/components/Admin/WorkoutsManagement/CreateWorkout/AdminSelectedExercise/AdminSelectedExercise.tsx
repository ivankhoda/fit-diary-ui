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
import { convertDurationToMMSS } from '../../../utils/convertDurationToMMSS';
import { parseDurationInput } from '../../../utils/paraseDurationInput';
import { AdminExerciseProfile } from '../../../store/AdminExercisesStore';
import { DurationInput, NumericInput, TextInput } from '../../../../Common/ControlledInput';


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
                    <NumericInput
                        label={i18n.t('exercise.reps')}
                        id={'reps-input'}
                        value={repetitions || 1}
                        onChange={(value: string) => handleRepsChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                        onBlur={e => handleBlur('repetitions', e.target.value)}
                    />
                    <TextInput
                        label={i18n.t('exercise.weight')}
                        id={'weight-input'}
                        value={weight ?? '1'}
                        onChange={(value: string) => handleWeightChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                        onBlur={e => handleBlur('weight', e)}
                    />
                </div>
            );
        case 'reps':
            return (
                <div className="exercise-fields">
                    <NumericInput
                        label={i18n.t('exercise.reps')}
                        id={'reps-input'}
                        value={repetitions || 1}
                        onChange={(value: string) => handleRepsChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                        onBlur={e => handleBlur('repetitions', e.target.value)}
                    />
                </div>
            );
        case 'duration':
            return (
                <div className="exercise-fields">
                    <DurationInput
                        label={i18n.t('exercise.duration')}
                        id={'duration-input'}
                        value={duration ? duration : 0}
                        onChange={(value: string) => handleDurationChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                        onBlur={e => handleDurationBlur(e as unknown as React.FocusEvent<HTMLInputElement>)}
                    />
                </div>
            );
        case 'duration_and_reps':
            return (
                <div className="exercise-fields">
                    <NumericInput
                        label={i18n.t('exercise.reps')}
                        id={'reps-input'}
                        value={repetitions || 1}
                        onChange={(value: string) => handleRepsChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                        onBlur={e => handleBlur('repetitions', e.target.value)}
                    />
                    <DurationInput
                        label={i18n.t('exercise.duration')}
                        id={'duration-input'}
                        value={duration ? duration : 0}
                        onChange={(value: string) => handleDurationChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                        onBlur={e => handleDurationBlur(e as unknown as React.FocusEvent<HTMLInputElement>)}
                    />
                </div>
            );
        case 'cardio':
        case 'duration_and_distance':
            return (
                <div className="exercise-fields">
                    <DurationInput
                        label={i18n.t('exercise.duration')}
                        id={'duration-input'}
                        value={duration ? duration : 0}
                        onChange={(value: string) => handleDurationChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                        onBlur={e => handleDurationBlur(e as unknown as React.FocusEvent<HTMLInputElement>)}
                    />

                    <NumericInput
                        label={i18n.t('exercise.distance')}
                        id={'distance-input'}
                        value={distance || 0}
                        onChange={(value: string) => {
                            const parsedValue = String(parseFloat(value));
                            handleExerciseDetailChange(id, 'distance', parsedValue);
                        }}
                        onBlur={e => handleBlur('distance', e.target.value)}
                    />
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
                                    aria-label="trash"
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
