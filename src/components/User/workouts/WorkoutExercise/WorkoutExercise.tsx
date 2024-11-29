/* eslint-disable max-statements */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useState, useCallback } from 'react';
import { exercisesController } from '../../../../controllers/global';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import './WorkoutExercise.style.scss';

// Import Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Props {
    exercise?: ExerciseInterface;
    form?: boolean;
    editedExercise?: ExerciseInterface;
}

const WorkoutExercise: React.FC<Props> = ({ exercise }) => {
    const [editing, setEditing] = useState(false);
    const [editedExercise, setEditedExercise] = useState<ExerciseInterface | undefined>(exercise);

    const toggleEditing = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setEditing(prevEditing => !prevEditing);
        setEditedExercise(exercise);
    }, [exercise]);

    const deleteExercise = useCallback(() => {
        event.preventDefault();
        if (exercise) {
            exercisesController.deleteWorkoutExercise(exercise.id);
        }
    }, [exercise]);

    const saveExercise = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (editedExercise) {
            exercisesController.editWorkoutExercise(editedExercise);
            setEditing(false);
        }
    }, [editedExercise]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setEditedExercise(prev => prev ? { ...prev, [name]: value } : null);
    }, []);

    if (!exercise) { return null; }

    return (
        <tr className="workout-exercise">
            <td>{exercise.name}</td>
            <td>
                {editing
                    ? <input
                        type="number"
                        className="edit-input"
                        name="repetitions"
                        value={editedExercise?.repetitions || ''}
                        placeholder="Repetitions..."
                        onChange={handleInputChange}
                    />
                    : exercise.repetitions
                }
            </td>
            <td>
                {editing
                    ? <input
                        type="number"
                        className="edit-input"
                        name="sets"
                        value={editedExercise?.sets || ''}
                        placeholder="Sets..."
                        onChange={handleInputChange}
                    />
                    : exercise.sets
                }
            </td>
            <td>
                {editing
                    ? <input
                        type="number"
                        className="edit-input"
                        name="weight"
                        value={editedExercise?.weight || ''}
                        placeholder="Weight..."
                        onChange={handleInputChange}
                    />
                    : exercise.weight
                }
            </td>
            <td className="exercise-actions">
                {editing
                    ? <>
                        <button className="icon-btn save-btn" onClick={saveExercise}>
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button className="icon-btn cancel-btn" onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </>
                    : <>
                        <button className="icon-btn edit-btn" onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={deleteExercise}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </>
                }
            </td>
        </tr>
    );
};

export default inject(
    'exercisesStore',
    'exercisesController',
    'workoutsStore'
)(observer(WorkoutExercise));
