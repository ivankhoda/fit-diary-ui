/* eslint-disable sort-keys */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
/* eslint-disable no-alert */
/* eslint-disable max-lines-per-function */
import React, { useState, useEffect } from 'react';
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

interface NewWorkoutProps {
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
    const [userSearchTerm, setUserSearchTerm] = useState('');
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
            // Fetch exercises and users irrespective of workoutId
            exercisesController?.getExercises();
            workoutsController?.getUsersWithPermissions();
            fetchWorkoutData();
        }
    }, [workoutId,
        workoutsController,
        exercisesController]);

    useEffect(() => {
        const fetchedWorkout = workoutsStore?.draftWorkout;

        if (fetchedWorkout) {
            setWorkoutName(fetchedWorkout.name || '');
            setDescription(fetchedWorkout.description || '');
            setSelectedExercises(fetchedWorkout.exercises || []);
            setSelectedUsers(fetchedWorkout.users || []);
        }
    }, [workoutsStore?.draftWorkout]);





    const handleExerciseClick = (exercise: ExerciseInterface) => {
        setSelectedExercises(prevSelected => {
            const isSelected = prevSelected.some(e => e.id === exercise.id);
            const updatedExercises = isSelected
                ? prevSelected.filter(e => e.id !== exercise.id)
                : [...prevSelected, { ...exercise, sets: 1, repetitions: 1, weight: 0 }];
            return updatedExercises;
        });

        setExerciseSearchTerm('');
    };

    const handleExerciseDetailChange = (id: number, field: string, value: number) => {
        if (!['sets',
            'repetitions',
            'weight'].includes(field)) {return;}
        setSelectedExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === id ? { ...exercise, [field]: value } : exercise));
    };

    const handleUserSelect = (user: UserProfile) => {
        setSelectedUsers(prevSelected =>
            prevSelected.some(u => u.id === user.id)
                ? prevSelected.filter(u => u.id !== user.id)
                : [...prevSelected, user]);
        setUserSearchTerm('');
    };

    const handleExerciseDelete = (exerciseId: number) => {
        setSelectedExercises(prevSelected =>
            prevSelected.filter(exercise => exercise.id !== exerciseId));
    };

    const handleUserDelete = (userId: number) => {
        setSelectedUsers(prevSelected =>
            prevSelected.filter(user => user.id !== userId));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!workoutName || !description || !selectedExercises.length) {
            alert(i18n.t('workoutData.fillAllFields'));
            return;
        }

        const newWorkout = {
            name: workoutName,
            description,
            exercises: selectedExercises,
            users: selectedUsers,
        };

        try {
            if (isEditing) {
                await workoutsController?.updateWorkout(workoutId, newWorkout);
                alert(i18n.t('workoutData.workoutUpdated'));
            } else {
                await workoutsController?.saveWorkout(newWorkout, navigate);
                alert(i18n.t('workoutData.workoutCreated'));
            }
        } catch (error) {
            alert(i18n.t('workoutData.creationError'));
        }
    };

    const filteredExercises =
    exercisesStore?.generalExercises?.filter(exercise =>
        exercise?.name?.toLowerCase().includes(exerciseSearchTerm.toLowerCase())) || [];

    const filteredUsers =
    workoutsStore?.usersWithPermissions?.filter(user =>
        user?.email?.toLowerCase().includes(userSearchTerm.toLowerCase())) || [];

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
                                    key={exercise.id}
                                    className={`exercise-item ${
                                        selectedExercises.some(e => e.id === exercise.id) ? 'selected' : ''
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
                        <div className="exercise-table-container">
                            <table className="exercise-table">
                                <thead>
                                    <tr>
                                        <th>{i18n.t('workoutData.exercise')}</th>
                                        <th>{i18n.t('workoutData.sets')}</th>
                                        <th>{i18n.t('workoutData.reps')}</th>
                                        <th>{i18n.t('workoutData.weight')}</th>
                                        <th>{i18n.t('workoutData.delete')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedExercises.map(exercise => (
                                        <tr key={exercise.id}>
                                            <td>{exercise.name}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={exercise.sets || 1}
                                                    min="1"
                                                    onChange={e =>
                                                        handleExerciseDetailChange(
                                                            exercise.id,
                                                            'sets',
                                                            parseInt(e.target.value, 10)
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={exercise.repetitions || 1}
                                                    min="1"
                                                    onChange={e =>
                                                        handleExerciseDetailChange(
                                                            exercise.id,
                                                            'repetitions',
                                                            parseInt(e.target.value, 10)
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={exercise.weight || 0}
                                                    min="0"
                                                    onChange={e =>
                                                        handleExerciseDetailChange(
                                                            exercise.id,
                                                            'weight',
                                                            parseInt(e.target.value, 10)
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleExerciseDelete(exercise.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div>
                    <label>{i18n.t('workoutData.assignUsers')}</label>
                    <input
                        type="text"
                        value={userSearchTerm}
                        onChange={e => setUserSearchTerm(e.target.value)}
                        placeholder={i18n.t('workoutData.searchUsers')}
                    />
                    {userSearchTerm && (
                        <div className="user-list">
                            {filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    className={`user-item ${
                                        selectedUsers.some(u => u.id === user.id) ? 'selected' : ''
                                    }`}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    {user.email}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedUsers.length > 0 && (
                    <div>
                        <label>{i18n.t('workoutData.selectedUsers')}</label>
                        <ul>
                            {selectedUsers.map(user => (
                                <li key={user.id}>
                                    {user.email}
                                    <button
                                        type="button"
                                        onClick={() => handleUserDelete(user.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button type="submit">
                    {isEditing ? i18n.t('workoutData.saveChanges') : i18n.t('workoutData.saveWorkout')}
                </button>
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
