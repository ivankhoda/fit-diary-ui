/* eslint-disable max-lines-per-function */
/* eslint-disable sort-keys */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-bind */
// CreateWorkout.tsx

import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import i18n from 'i18next';
import AdminPanel from '../../AdminPanel';
import { adminUsersController } from '../../controllers/global';
import AdminWorkoutsStore from '../../store/AdminWorkoutsStore';
import AdminUsersStore, { AdminUserProfile } from '../../store/AdminUsersStore';
import AdminWorkoutsController from '../../controllers/AdminWorkoutsController';
import AdminExercisesStore, { AdminExerciseProfile } from '../../store/AdminExercisesStore';
import AdminExercisesController from '../../controllers/AdminExercisesController';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CreateWorkout.style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CreateWorkoutProps {
    adminWorkoutsStore?: AdminWorkoutsStore;
    adminUsersStore?: AdminUsersStore;
    adminWorkoutsController?: AdminWorkoutsController;
    adminExercisesStore?: AdminExercisesStore;
    adminExercisesController?: AdminExercisesController;
}

// eslint-disable-next-line max-statements
const CreateWorkout: React.FC<CreateWorkoutProps> = ({
    adminUsersStore,
    adminWorkoutsController,
    adminExercisesController,
    adminExercisesStore
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<AdminExerciseProfile[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<AdminUserProfile[]>([]);

    useEffect(() => {
        adminExercisesController.getExercises();
        adminUsersController.getUsers();
    }, [adminExercisesController, adminUsersController]);

    const handleExerciseClick = (exercise: AdminExerciseProfile) => {
        setSelectedExercises(prevSelected => {
            const isSelected = prevSelected.some(e => e.id === exercise.id);
            return isSelected ? prevSelected.filter(e => e.id !== exercise.id) : [...prevSelected, { ...exercise }];
        });
        setExerciseSearchTerm('');
    };

    const handleExerciseDetailChange = (id: number, field: 'sets' | 'reps' | 'weight', value: number) => {
        setSelectedExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === id ? { ...exercise, [field]: value } : exercise));
    };

    const handleUserSelect = (user: AdminUserProfile) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(user)
                ? prevSelected.filter(u => u.id !== user.id)
                : [...prevSelected, user]);
        setUserSearchTerm('');
    };

    const handleExerciseDelete = (exerciseId: number) => {
        setSelectedExercises(prevSelected => prevSelected.filter(exercise => exercise.id !== exerciseId));
    };

    const handleUserDelete = (userId: number) => {
        setSelectedUsers(prevSelected => prevSelected.filter(user => user.id !== userId));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !description || !selectedExercises.length) {
            alert(i18n.t('workoutData.fillAllFields'));
            return;
        }

        const newWorkout = {
            name,
            description,
            exercises: selectedExercises,
            users: selectedUsers.map(exercise => exercise.id),
        };

        try {
            await adminWorkoutsController?.createWorkout(newWorkout);
            alert(i18n.t('workoutData.workoutCreated'));
        } catch (error) {
            alert(i18n.t('workoutData.creationError'));
        }
    };

    const filteredExercises = adminExercisesStore.exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()));

    const filteredUsers = adminUsersStore.userProfiles?.filter(user =>
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) || [];

    return (
        <AdminPanel>
            <div className="create-workout">
                <h2>{i18n.t('workoutData.createNewWorkout')}</h2>

                <form onSubmit={e => handleSubmit(e)}>
                    <div>
                        <label>{i18n.t('workoutData.name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
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
                                        className={`exercise-item ${selectedExercises.some(e => e.id === exercise.id) ? 'selected' : ''}`}
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
                                                    value={exercise.sets}
                                                    min="1"
                                                    onChange={e => {
                                                        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
                                                        handleExerciseDetailChange(exercise.id, 'sets', value);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={exercise.repetitions}
                                                    min="1"
                                                    onChange={e => {
                                                        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
                                                        handleExerciseDetailChange(exercise.id, 'reps', value);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={exercise.weight}
                                                    min="0"
                                                    onChange={e => {
                                                        const value = Math.max(0, parseInt(e.target.value, 10) || 0);
                                                        handleExerciseDetailChange(exercise.id, 'weight', value);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button type="button" onClick={() => handleExerciseDelete(exercise.id)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Multi-Select Users */}
                    <div>
                        <label>{i18n.t('workoutData.assignUsers')}</label>
                        <input
                            type="text"
                            value={userSearchTerm}
                            onChange={e => setUserSearchTerm(e.target.value)}
                            placeholder={i18n.t('workoutData.searchUsers')}
                        />
                        {userSearchTerm && <div className="exercise-list">
                            {filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    className={`user-item ${selectedUsers.includes(user) ? 'selected' : ''}`}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    {user.email}
                                </div>
                            ))}
                        </div>}


                        {selectedUsers.length > 0 && (
                            <div>
                                <label>{i18n.t('workoutData.selectedUsers')}</label>
                                <table className="exercise-table">
                                    <thead>
                                        <tr>
                                            <th>{i18n.t('users.id')}</th>
                                            <th>{i18n.t('users.email')}</th>
                                            <th>{i18n.t('workoutData.delete')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <button type="button" onClick={() => handleUserDelete(user.id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div>
                        <button type="submit">{i18n.t('workoutData.createWorkoutButton')}</button>
                    </div>
                </form>
            </div>
        </AdminPanel>
    );
};

export default inject('adminWorkoutsStore',
    'adminUsersStore',
    'adminWorkoutsController',
    'adminExercisesStore',
    'adminExercisesController')(observer(CreateWorkout));
