/* eslint-disable sort-keys */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
/* eslint-disable no-alert */
/* eslint-disable max-lines-per-function */
import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import i18n from 'i18next';
import { useParams } from 'react-router';
import './AdminCreateWorkout.style.scss';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import AdminExercisesController from '../../controllers/AdminExercisesController';
import AdminWorkoutsController from '../../controllers/AdminWorkoutsController';
import AdminExercisesStore, { AdminExerciseProfile } from '../../store/AdminExercisesStore';
import AdminUsersStore, { AdminUserProfile } from '../../store/AdminUsersStore';
import AdminWorkoutsStore from '../../store/AdminWorkoutsStore';
import AdminUsersController from '../../controllers/AdminUsersController';
import AdminSelectedExercise from './AdminSelectedExercise/AdminSelectedExercise';



interface AdminCreateWorkoutProps {
  adminWorkoutsStore?: AdminWorkoutsStore;
  adminExercisesStore?: AdminExercisesStore;
  adminWorkoutsController?: AdminWorkoutsController;
  adminExercisesController?: AdminExercisesController;
  adminUsersController?: AdminUsersController;
  adminUsersStore?: AdminUsersStore;
}

const AdminCreateWorkout: React.FC<AdminCreateWorkoutProps> = ({
    adminWorkoutsStore,
    adminExercisesStore,
    adminWorkoutsController,
    adminExercisesController,
    adminUsersController,
    adminUsersStore
}) => {
    const [workoutName, setWorkoutName] = useState('');
    const [description, setDescription] = useState('');
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<AdminExerciseProfile[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<AdminUserProfile[]>([]);

    const { workoutId } = useParams<{ workoutId: string }>();

    const isEditing = Boolean(workoutId);

    useEffect(() => {
        if (workoutId) {
            const fetchWorkoutData = async() => {
                await adminWorkoutsController?.getWorkoutById(workoutId);
            };
            fetchWorkoutData();
        }
        adminExercisesController?.getExercises();
        adminUsersController?.getUsers();
    }, [workoutId,
        adminWorkoutsController,
        adminExercisesController]);

    useEffect(() => {
        const draftWorkout = adminWorkoutsStore?.draftWorkout;
        adminExercisesStore?.addWorkoutExercises(draftWorkout?.exercises);
        if (draftWorkout) {
            setWorkoutName(draftWorkout.name || '');
            setDescription(draftWorkout.description || '');
            setSelectedExercises(prevExercises => {
                const updatedExercises = [...prevExercises];

                adminExercisesStore.workoutExercises.forEach(newExercise => {
                    if (!updatedExercises.some(exercise => exercise.id === newExercise.id)) {
                        updatedExercises.push(newExercise);
                    }
                });

                return updatedExercises.sort((a, b) => a.id - b.id);
            });
            setSelectedUsers(draftWorkout.users || []);
        }
    }, [adminWorkoutsStore?.draftWorkout, adminExercisesStore]);

    const handleExerciseClick = async(exercise: AdminExerciseProfile) => {
        try {
            const addedExercise = await adminExercisesController?.addWorkoutExercise(workoutId, exercise.id);

            if (addedExercise) {
                setSelectedExercises(prevExercises => {
                    if (!prevExercises.find(e => e.id === addedExercise.id)) {
                        return [...prevExercises, addedExercise];
                    }
                    return prevExercises;
                });
            }
            setExerciseSearchTerm('');
        } catch (error) {
            console.error('Failed to add exercise to workout:', error);
        }
    };

    const handleUserSelect = (user: AdminUserProfile) => {
        setSelectedUsers(prev =>
            prev.some(u => u.id === user.id) ? prev.filter(u => u.id !== user.id) : [...prev, user]);
        setUserSearchTerm('');
    };

    const handleExerciseDelete = (exerciseId: number) => {
        adminExercisesController?.deleteWorkoutExercise(exerciseId);
        setSelectedExercises(prev => prev.filter(exercise => exercise.id !== exerciseId));
    };

    const handleUserDelete = (userId: number) => {
        setSelectedUsers(prev => prev.filter(user => user.id !== userId));
    };

    const handleExerciseDetailChange = (id: number, field: string, value: string) => {
        if (!['sets',
            'repetitions',
            'weight',
            'duration',
            'distance'].includes(field)) {return;}

        setSelectedExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === id  ? { ...exercise, [field]: value } : exercise));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!workoutName) {
            alert(i18n.t('workoutData.fillAllFields'));
            return;
        }

        const newWorkout = {
            name: workoutName,
            description,
        };

        try {
            if (isEditing) {
                await adminWorkoutsController?.updateWorkout(workoutId, newWorkout);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = (updatedExercise: ExerciseInterface) => {
        adminWorkoutsController?.updateWorkoutExercise(updatedExercise);
    };

    const filteredExercises =
    adminExercisesStore?.exercises?.filter((exercise: ExerciseInterface) =>
        exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())) || [];

    const filteredUsers =
    adminUsersStore?.userProfiles?.filter((user: AdminUserProfile) =>
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) || [];

    return (
        <div className="admin-create-workout-section">
            <h2>
                {isEditing
                    ? i18n.t('workoutData.editWorkout')
                    : i18n.t('workoutData.createNewWorkout')}
            </h2>

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

                <div>
                    <label>{i18n.t('workoutData.selectedExercises')}</label>
                    { adminExercisesStore.workoutExercises.map(exercise => (
                        <AdminSelectedExercise
                            key={exercise.id}
                            exercise={exercise}
                            handleExerciseDelete={handleExerciseDelete}
                            editWorkoutExercise={handleUpdate}
                            handleExerciseDetailChange={handleExerciseDetailChange}
                            mode="edit"
                        />
                    ))}
                </div>

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
                                    <button type="button" onClick={() => handleUserDelete(user.id)}>
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
    'adminWorkoutsStore',
    'adminExercisesStore',
    'adminWorkoutsController',
    'adminExercisesController'
)(observer(AdminCreateWorkout));
