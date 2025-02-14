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
import { AdminExerciseProfile } from '../../../store/AdminExercisesStore';
import RepetitionsInput from '../../../../Common/RepetitionsInput';
import WeightInput from '../../../../Common/WeightInput';
import TimeInput from '../../../../Common/TimeInput';
import DistanceInput from '../../../../Common/DistanceInput';
import SetsInput from '../../../../Common/SetsInput';


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
    const { id, name, type_of_measurement} = exercise;



    const handleSetsChange = (s: string) => {
        handleExerciseDetailChange(id, 'sets', s);
    };


    const handleRepsChange = (r: string) => {
        handleExerciseDetailChange(id, 'repetitions', r);
    };

    const handleWeightChange = (w:string) => {
        handleExerciseDetailChange(id, 'weight', w);
    };

    const handleDurationChange = (d: string) => {
        handleExerciseDetailChange(id, 'duration', d);
    };

    const handleDistanceChange = (d: string) => {
        handleExerciseDetailChange(id, 'distance', d);
    };

    const handleBlur = (field: string, value: string | number | null) => {
        const updatedExercise = { ...exercise, [field]: value };
        editWorkoutExercise(updatedExercise);
    };


    const renderEditableFields = () => {
        switch (type_of_measurement) {
        case 'weight_and_reps':
            return (
                <div className="exercise-fields">
                    <div className='exercise-fields-column'>
                        <label>{i18n.t('exercise.reps')}</label>
                        <RepetitionsInput onChange={r => handleRepsChange(r)} onBlur={handleBlur} exercise={exercise}/>
                    </div>
                    <div className='exercise-fields-column'>
                        <label>{i18n.t('exercise.weight')}</label>
                        <WeightInput onChange={w => handleWeightChange(w)} onBlur={handleBlur} exercise={exercise}/>
                    </div>
                </div>
            );
        case 'reps':
            return (
                <div className="exercise-fields">
                    <div className='exercise-fields-column'>
                        <label>{i18n.t('exercise.reps')}</label>
                        <RepetitionsInput onChange={r => handleRepsChange(r)} onBlur={handleBlur} exercise={exercise}/>
                    </div>
                </div>
            );
        case 'duration':
            return (
                <div className="exercise-fields">
                    <div className='exercise-fields-column'>
                        <label>{i18n.t('exercise.duration')}</label>
                        <TimeInput  onChange={handleDurationChange} onBlur={handleBlur} exercise={exercise}/>
                    </div>
                </div>
            );
        case 'duration_and_reps':
            return (
                <div className="exercise-fields">
                    <div className='exercise-fields-column'>
                        <label>{i18n.t('exercise.reps')}</label>
                        <RepetitionsInput onChange={r => handleRepsChange(r)} onBlur={handleBlur} exercise={exercise}/>
                    </div>
                    <div className='exercise-fields-column'>
                        <label>{i18n.t('exercise.duration')}</label>
                        <TimeInput  onChange={handleDurationChange} onBlur={handleBlur} exercise={exercise}/>
                    </div>
                </div>
            );
        case 'cardio':
        case 'duration_and_distance':
            return (
                <div className="exercise-fields">
                    <div className='exercise-fields-column'>
                        <label>{i18n.t('exercise.duration')}</label>
                        <TimeInput  onChange={handleDurationChange} onBlur={handleBlur} exercise={exercise}/>
                    </div>
                    <div className='exercise-fields-column'>
                        <label>{i18n.t('exercise.distance')}</label>
                        <DistanceInput onChange={handleDistanceChange} onBlur={handleBlur} exercise={exercise}/>
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

                <>

                    <div className="exercise-fields">
                        {renderEditableFields()}
                        <div className='exercise-fields-column'>
                            <label>{i18n.t('workoutData.sets')}</label>
                            <SetsInput onChange={handleSetsChange} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                        <div className='exercise-fields-column'>
                            <button
                                type="button"
                                className="delete-btn"
                                aria-label="trash"
                                onClick={() => handleExerciseDelete(id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                </>

            </div>
        </div>
    );
};

export default AdminSelectedExercise;
