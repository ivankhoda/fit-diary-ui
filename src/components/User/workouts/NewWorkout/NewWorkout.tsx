/* eslint-disable sort-keys */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
/* eslint-disable no-alert */
/* eslint-disable max-lines-per-function */
import React, { useState, useEffect, useCallback } from 'react';
import { observer, inject } from 'mobx-react';
import i18n from 'i18next';
import { useNavigate, useParams } from 'react-router';
import './NewWorkout.style.scss';
import WorkoutsStore from '../../../../store/workoutStore';
import ExercisesStore, { ExerciseInterface } from '../../../../store/exercisesStore';
import WorkoutsController from '../../../../controllers/WorkoutsController';
import ExercisesController from '../../../../controllers/ExercisesController';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserProfile } from '../../../../store/userStore';
import SelectedExercise from './SelectedExercise';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export interface NewWorkoutProps {
  workoutsStore?: WorkoutsStore;
  exercisesStore?: ExercisesStore;
  workoutsController?: WorkoutsController;
  exercisesController?: ExercisesController;
}

const NewWorkout: React.FC<NewWorkoutProps> = ({
    workoutsStore,
    exercisesStore,
    workoutsController,
    exercisesController,
}) => {
    const [workoutName, setWorkoutName] = useState('');
    const [description, setDescription] = useState('');
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<ExerciseInterface[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);

    const { workoutId } = useParams<{ workoutId: string }>();
    const navigate = useNavigate();

    const isEditing = Boolean(workoutId);

    useEffect(() => {
        if (workoutId) {
            const fetchWorkoutData = async() => {
                await workoutsController?.getWorkout(workoutId);
            };
            fetchWorkoutData();
        }
        exercisesController?.getExercises();
        workoutsController?.getUsersWithPermissions();
    }, [workoutId,
        workoutsController,
        exercisesController]);

    useEffect(() => {
        const fetchedWorkout = workoutsStore?.draftWorkout;

        if (fetchedWorkout) {
            setWorkoutName(fetchedWorkout.name || '');
            setDescription(fetchedWorkout.description || '');
            setSelectedExercises(
                (exercisesStore?.workoutExercises || []).sort((a, b) => {
                    if (a.order === b.order) {
                        return a.id - b.id;
                    }
                    return Number(a.order) - Number(b.order);
                })
            );

            setSelectedUsers(fetchedWorkout.users || []);
        }
    }, [workoutsStore?.draftWorkout]);

    const handleExerciseClick = async(exercise: ExerciseInterface) => {
        try {
            await exercisesController?.addWorkoutExercise(workoutId, exercise.id);

            setSelectedExercises(
                exercisesStore?.workoutExercises.sort((a, b) => {
                    if (a.order === b.order) {
                        return a.id - b.id;
                    }
                    return Number(a.order) - Number(b.order);
                }) || []
            );

            setExerciseSearchTerm('');
        } catch (error) {
            console.error('Failed to add exercise to workout:', error);
        }
    };

    const handleExerciseDetailChange = (id: number, field: string, value: string) => {
        if (!['sets',
            'repetitions',
            'weight',
            'duration',
            'distance'].includes(field)) {
            return;
        }

        setSelectedExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === id ? { ...exercise, [field]: value } : exercise));
    };

    const handleEditWorkoutExercise = (editedExercise: ExerciseInterface) => {
        exercisesController?.editWorkoutExercise(editedExercise);
        setSelectedExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === editedExercise.id ? editedExercise : exercise));
    };

    const handleExerciseDelete = (exerciseId: number) => {
        exercisesController?.deleteWorkoutExercise(exerciseId);
        setSelectedExercises(prevSelected =>
            prevSelected.filter(exercise => exercise.id !== exerciseId));
    };

    const handleUserDelete = (userId: number) => {
        setSelectedUsers(prevSelected =>
            prevSelected.filter(user => user.id !== userId));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!workoutName || !description) {
            alert(i18n.t('workoutData.fillAllFields'));
            return;
        }

        const newWorkout = {
            name: workoutName,
            description,
        };

        try {
            if (isEditing) {
                await workoutsController?.updateWorkout(workoutId, newWorkout);
            } else {
                await workoutsController?.saveWorkout(newWorkout, navigate);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filteredExercises =
    exercisesStore?.generalExercises?.filter(exercise =>
        exercise?.name?.toLowerCase().includes(exerciseSearchTerm.toLowerCase())) || [];

    const moveExercise = useCallback((dragIndex: number, hoverIndex: number) => {
        setSelectedExercises(prevExercises => {
            const updatedExercises = [...prevExercises];
            const [draggedItem] = updatedExercises.splice(dragIndex, 1);
            updatedExercises.splice(hoverIndex, 0, draggedItem);
            updatedExercises.forEach((exercise, index) => {
                exercise.order = (index + 1).toString();
            });
            workoutsController?.reorderWorkoutExercises(workoutId, updatedExercises);
            return updatedExercises;
        });
    }, [workoutsController, workoutId]);

    return (
        <div className="new-workout-section">
            <h2>{isEditing ? i18n.t('workoutData.editWorkout') : i18n.t('workoutData.createNewWorkout')}</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>{i18n.t('workoutData.name')}</label>
                    <input
                        type="text"
                        value={workoutName}
                        onChange={e => setWorkoutName(e.target.value)}
                        placeholder={i18n.t('workoutData.workoutNamePlaceholder')}
                    />
                </div>

                <div>
                    <label>{i18n.t('workoutData.description')}</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder={i18n.t('workoutData.workoutDescriptionPlaceholder')}
                    />
                </div>
                <button type="submit" className="save-button">
                    {isEditing ? i18n.t('workoutData.saveChanges') : i18n.t('workoutData.saveWorkout')}
                </button>

                <div>
                    <label>{i18n.t('workoutData.exercises')}</label>
                    <input
                        type="text"
                        value={exerciseSearchTerm}
                        onChange={e => setExerciseSearchTerm(e.target.value)}
                        placeholder={i18n.t('workoutData.searchExercises')}
                    />
                    {exerciseSearchTerm && (
                        <div className="exercise-list">
                            {filteredExercises.map(exercise => (
                                <div
                                    key={`${exercise.id}`}
                                    className={`exercise-item ${
                                        selectedExercises.some(e => e.id.toString() === exercise.id.toString()) ? 'selected' : ''
                                    }`}
                                    onClick={() => handleExerciseClick(exercise)}
                                >
                                    {exercise.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedExercises.length > 0 && (
                    <div>
                        <label>{i18n.t('workoutData.selectedExercises')}</label>
                    </div>
                )}
                <DndProvider backend={HTML5Backend}>
                    {selectedExercises.length > 0 &&
            selectedExercises.map((e, index) => (
                <div key={e.id} className="selected-exercise-container">
                    <SelectedExercise
                        index={index}
                        exercise={e}
                        handleExerciseDelete={handleExerciseDelete}
                        handleExerciseDetailChange={handleExerciseDetailChange}
                        editWorkoutExercise={handleEditWorkoutExercise}
                        moveExercise={moveExercise}
                        mode="edit"
                        length={selectedExercises.length}
                    />
                </div>
            ))}
                </DndProvider>

                {selectedUsers.length > 0 && (
                    <div>
                        <label>{i18n.t('workoutData.selectedUsers')}</label>
                        <ul>
                            {selectedUsers.map(user => (
                                <li key={user.id}>
                                    {user.email}
                                    <button type="button" onClick={() => handleUserDelete(user.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
        </div>
    );
};

export default inject(
    'workoutsStore',
    'exercisesStore',
    'workoutsController',
    'exercisesController'
)(observer(NewWorkout));
