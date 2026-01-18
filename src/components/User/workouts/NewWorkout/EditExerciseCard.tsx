/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */

import React, { useCallback, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import i18n from 'i18next';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import './EditExerciseCard.style.scss';
import RepetitionsInput from '../../../Common/RepetitionsInput';
import WeightInput from '../../../Common/WeightInput';
import TimeInput from '../../../Common/TimeInput';
import DistanceInput from '../../../Common/DistanceInput';
import { useDrag, useDrop } from 'react-dnd';
import CommentInput from '../../../Common/CommentInput';

const ItemType = { EXERCISE: 'exercise' };

interface EditExerciseCardProps {
  exercise: ExerciseInterface;
  handleExerciseDetailChange: (id: number, field: string, value: string) => void;
  handleExerciseDelete: (exerciseId: number) => void;
  editWorkoutExercise: (editedExercise: ExerciseInterface) => void;
  index: number;
  moveExercise: (id: number, atIndex: number) => void;
  length: number;
}

const EditExerciseCard: React.FC<EditExerciseCardProps> = ({
    exercise,
    handleExerciseDetailChange,
    handleExerciseDelete,
    editWorkoutExercise,
    index,
    moveExercise,
    length
}) => {
    const { id, name, type_of_measurement, sets, order } = exercise;

    const handleSetsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        const parsedValue = String(parseInt(value, 10));
        handleExerciseDetailChange(id, 'sets', parsedValue);
    }, [handleExerciseDetailChange, id]);

    const handleSetsBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        handleBlur('sets', e.target.value);
    }, [exercise]);

    const handleDelete = useCallback(() => {
        handleExerciseDelete(id);
    }, [handleExerciseDelete, id]);

    const handleReps = useCallback((r: string) => {
        handleExerciseDetailChange(id, 'repetitions', r);
        handleUpdate('repetitions', r);
    }, [exercise,
        handleExerciseDetailChange,
        id]);

    const handleWeightChange = useCallback((w: string) => {
        handleExerciseDetailChange(id, 'weight', w);
        handleUpdate('weight', w);
    }, [exercise,
        handleExerciseDetailChange,
        id]);

    const handleDurationChange = useCallback((d: string) => {
        handleExerciseDetailChange(id, 'duration', d);
    }, [handleExerciseDetailChange, id]);

    const handleDistanceChange = useCallback((d: string) => {
        handleExerciseDetailChange(id, 'distance', d);
        handleUpdate('distance', d);
    }, [exercise,
        handleExerciseDetailChange,
        id]);

    const handleCommentChange = useCallback((d: string) => {
        handleExerciseDetailChange(id, 'comment', d);
    }, [handleExerciseDetailChange, id]);

    const handleBlur = useCallback((field: string, value: string | number | null) => {
        const updatedExercise = { ...exercise, [field]: value };
        editWorkoutExercise(updatedExercise);
    }, [exercise, editWorkoutExercise]);

    const handleUpdate = useCallback((field: string, value: string | number | null) => {
        const updatedExercise = { ...exercise, [field]: value };
        console.log('Updating exercise:', updatedExercise);
        editWorkoutExercise(updatedExercise);
    }, [exercise, editWorkoutExercise]);

    const ref = useRef(null);

    const [, drag] = useDrag({
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        item: { id, index },
        type: ItemType.EXERCISE,
    });

    const [, drop] = useDrop({
        accept: ItemType.EXERCISE,
        hover: (draggedItem: { id: number; index: number }) => {
            if (draggedItem.index !== index) {
                moveExercise(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    useEffect(() => {
        drag(drop(ref));
        return () => {
            drag(null);
            drop(null);
        };
    }, [drag, drop]);

    const moveExerciseUp = useCallback(() => {
        if (index === 0) {return;}
        moveExercise(index, index - 1);
    }, [index, moveExercise]);

    const moveExerciseDown = useCallback(() => {
        if (index === length - 1) {return;}
        moveExercise(index, index + 1);
    }, [index,
        length,
        moveExercise]);

    return (
        <div ref={ref} className="edit-exercise-card">
            <div className="edit-exercise-header">
                <strong>{order}. {name}</strong>
            </div>

            <div className="edit-exercise-content">
                {type_of_measurement === 'weight_and_reps' && (
                    <div className="edit-exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <RepetitionsInput onChange={handleReps} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                        <div>
                            <label>{i18n.t('exercise.weight')}</label>
                            <WeightInput onChange={handleWeightChange} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'reps' && (
                    <div className="edit-exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <RepetitionsInput onChange={handleReps} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration' && (
                    <div className="edit-exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <TimeInput onChange={handleDurationChange} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration_and_reps' && (
                    <div className="edit-exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <TimeInput onChange={handleDurationChange} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                        <div>
                            <label>{i18n.t('exercise.reps')}</label>
                            <RepetitionsInput onChange={handleReps} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'cardio' && (
                    <div className="edit-exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <TimeInput onChange={handleDurationChange} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                        <div>
                            <label>{i18n.t('exercise.distance')}</label>
                            <DistanceInput onChange={handleDistanceChange} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                    </div>
                )}

                {type_of_measurement === 'duration_and_distance' && (
                    <div className="edit-exercise-fields">
                        <div>
                            <label>{i18n.t('exercise.duration')}</label>
                            <TimeInput onChange={handleDurationChange} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                        <div>
                            <label>{i18n.t('exercise.distance')}</label>
                            <DistanceInput onChange={handleDistanceChange} exercise={exercise} onBlur={handleBlur}/>
                        </div>
                    </div>
                )}

                <div className="edit-exercise-controls">
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
                        className="edit-exercise-delete-btn"
                        onClick={handleDelete}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>

                    <div className="edit-exercise-move-buttons">
                        <button type="button" onClick={moveExerciseUp}>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </button>
                        <button type="button" onClick={moveExerciseDown}>
                            <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                    </div>
                </div>

                <CommentInput
                    exercise={exercise}
                    onChange={handleCommentChange}
                    onBlur={handleBlur}
                />
            </div>
        </div>
    );
};

export default EditExerciseCard;
