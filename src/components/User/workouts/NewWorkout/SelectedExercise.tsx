/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */

import React, { useCallback, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import i18n from 'i18next';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import './SelectedExercise.style.scss';
import { convertDurationToMMSS } from '../../../Admin/utils/convertDurationToMMSS';
import RepetitionsInput from '../../../Common/RepetitionsInput';
import WeightInput from '../../../Common/WeightInput';
import TimeInput from '../../../Common/TimeInput';
import DistanceInput from '../../../Common/DistanceInput';
import { useDrag, useDrop } from 'react-dnd';
import CommentInput from '../../../Common/CommentInput';

const ItemType = { EXERCISE: 'exercise' };

interface SelectedExerciseProps {
  exercise: ExerciseInterface;
  handleExerciseDetailChange?: (id: number, field: string, value: string) => void;
  handleExerciseDelete?: (exerciseId: number) => void;
  editWorkoutExercise?: (editedExercise: ExerciseInterface) => void;
  mode: 'edit' | 'view';
  onClick?: (exercise: ExerciseInterface) => void;
  index?: number
  moveExercise?: (id: number, atIndex: number) => void;
  length?: number;
}

const SelectedExercise: React.FC<SelectedExerciseProps> = ({
    exercise,
    handleExerciseDetailChange,
    handleExerciseDelete, editWorkoutExercise, mode, onClick, index, moveExercise, length
}) => {
    const { id, name, type_of_measurement, sets, repetitions, weight, duration, distance, order, comment } = exercise;

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
        handleUpdate('repetitions', r);
    }, [exercise]);

    const handleWeightChange = useCallback((w: string) => {
        handleExerciseDetailChange(id, 'weight', w);
        handleUpdate('weight', w);
    }, [exercise]);

    const handleDurationChange = useCallback((d: string) => {
        handleExerciseDetailChange(id, 'duration', d);
    }, []);

    const handleDistanceChange = useCallback((d: string) => {
        handleExerciseDetailChange(id, 'distance', d);
        handleUpdate('distance', d);
    }, [exercise]);

    const handleCommentChange = useCallback((d: string) => {
        handleExerciseDetailChange(id, 'comment', d);
    }, []);

    const handleBlur = useCallback((field: string, value: string | number | null) => {
        const updatedExercise = { ...exercise, [field]: value };
        editWorkoutExercise(updatedExercise);
    }, [exercise]);

    const handleUpdate = useCallback((field: string, value: string | number | null) => {
        const updatedExercise = { ...exercise, [field]: value };
        console.log('Updating exercise:', updatedExercise);
        editWorkoutExercise(updatedExercise);
    }, [exercise]);

    const handleClick = () => {
        if (onClick) {
            onClick(exercise);
        }
    };

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
    }, [index, moveExercise]);

    return (
        <div ref={mode ==='view' ? null : ref} className={`exercise-small-table ${mode === 'view'? '_mode': ''}`}
            onClick={mode === 'view' ?
                handleClick
                : null}
            role={mode === 'view' ? 'button' : null} tabIndex={mode === 'view' ? 0 : null}>
            <div>
                <strong>{order}. {name}</strong>
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
                            {repetitions ? `${i18n.t('exercise.reps')}: ${repetitions}` : null}
                            <b/>
                            {weight ? `${i18n.t('exercise.weight')}: ${weight}` : null}
                            <b/>
                            {sets ? `${i18n.t('workoutData.sets')}: ${sets}` : null}
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
                            {repetitions ? `${i18n.t('exercise.reps')}: ${repetitions}` : null}
                            <b/>
                            {sets ? `${i18n.t('workoutData.sets')}: ${sets}` : null}
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
                            {duration ? `${i18n.t('exercise.duration')}: ${convertDurationToMMSS(duration)}` : null}
                            <b/>
                            {sets ? `${i18n.t('workoutData.sets')}: ${sets}` : null}
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
                            {repetitions ? `${i18n.t('exercise.reps')}: ${repetitions}` : null}
                            <b/>
                            {duration ? `${i18n.t('exercise.duration')}: ${convertDurationToMMSS(duration)}` : null}
                            <b/>
                            {sets ? `${i18n.t('workoutData.sets')}: ${sets}` : null}
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
                            {duration ? `${i18n.t('exercise.duration')}: ${convertDurationToMMSS(duration)}` : null}
                            <b/>
                            {distance ? `${i18n.t('exercise.distance')}: ${distance}` : null}
                            <b/>
                            {sets ? `${i18n.t('workoutData.sets')}: ${sets}` : null}
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
                            {duration ? `${i18n.t('exercise.duration')}: ${convertDurationToMMSS(duration)}` : null}
                            <b/>
                            {distance ? `${i18n.t('exercise.distance')}: ${distance}` : null}
                            <b/>
                            {sets ? `${i18n.t('workoutData.sets')}: ${sets}` : null}
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

                        {<div className="move-buttons">
                            <button type="button" onClick={moveExerciseUp}>
                                <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                            <button type="button" onClick={moveExerciseDown}>
                                <FontAwesomeIcon icon={faArrowDown} />
                            </button>
                        </div>}

                    </div>

                    : null}
                {mode === 'edit' && (
                    <CommentInput
                        exercise={exercise}
                        onChange={handleCommentChange}
                        onBlur={handleBlur}
                    />

                )}
                {mode === 'view' && <div>
                    <span>{comment}</span>
                </div>}
            </div>
        </div>
    );
};

export default SelectedExercise;
