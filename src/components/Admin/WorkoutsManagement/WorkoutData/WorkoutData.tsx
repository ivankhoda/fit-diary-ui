/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable sort-keys */
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AdminPanel from '../../AdminPanel';
import { adminExercisesController, adminUsersController, adminWorkoutsController } from '../../controllers/global';
import { adminWorkoutsStore, adminUsersStore, adminExercisesStore } from '../../store/global';
import { AdminWorkoutProfile } from '../../store/AdminWorkoutsStore';
import i18n from 'i18next';
import './WorkoutData.style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const WorkoutData: React.FC = () => {
    const { workoutId } = useParams<{ workoutId: string }>();
    const [currentWorkout, setCurrentWorkout] = useState<AdminWorkoutProfile | null>(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    const [formData, setFormData] = useState<AdminWorkoutProfile>({
        name: '',
        description: '',
        exercises: [],
        created_at: '',
        updated_at: '',
        creator: ''
    });

    const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');

    useEffect(() => {
        if (workoutId) {
            const fetchWorkoutData = async() => {
                await adminWorkoutsController?.getWorkoutById(workoutId);
            };
            adminExercisesController.getExercises();
            adminUsersController.getUsers();
            fetchWorkoutData();
        }
    }, [workoutId]);

    useEffect(() => {
        const fetchedWorkout = adminWorkoutsStore?.workout;


        if (fetchedWorkout) {
            setCurrentWorkout(fetchedWorkout);
            setFormData(fetchedWorkout);
            setSelectedExercises(fetchedWorkout.exercises);
            setSelectedUsers(fetchedWorkout.users);
        }
    }, [adminWorkoutsStore?.workout]);

    const handleToggleDetails = useCallback(() => {
        setIsDetailsVisible(prevState => !prevState);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    const handleExerciseChange = (id: string, field: string, value: number) => {
        setSelectedExercises(prevExercises =>
            prevExercises.map(exercise =>
                exercise.id === id ? { ...exercise, [field]: value } : exercise));
    };

    const handleExerciseDelete = (exerciseId: string) => {
        setSelectedExercises(prevExercises => prevExercises.filter(ex => ex.id !== exerciseId));
    };

    const handleUserDelete = (userId: string) => {
        setSelectedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    };

    const handleUserSelect = useCallback((user: any) => {
        setSelectedUsers(prevSelected => {
            const userExists = prevSelected.some(u => u.id === user.id);

            return userExists
                ? prevSelected.filter(u => u.id !== user.id)
                : [...prevSelected, user];
        });

        setUserSearchTerm('');
    }, [setSelectedUsers, setUserSearchTerm]);

    const handleExerciseSelect = (exercise: any) => {
        setSelectedExercises(prevSelected =>
            prevSelected.some(e => e.id === exercise.id)
                ? prevSelected.filter(e => e.id !== exercise.id)
                : [...prevSelected, exercise]);
        setExerciseSearchTerm('');
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !selectedExercises.length) {
            alert(i18n.t('workoutData.fillAllFields'));
            return;
        }

        const updatedWorkout = {
            ...formData,
            exercises: selectedExercises,
            users: selectedUsers.map(user => user.id)
        };


        try {
            console.log(currentWorkout);
            await adminWorkoutsController?.updateWorkout(workoutId, updatedWorkout);
            alert(i18n.t('workoutData.workoutUpdated'));
        } catch (error) {
            alert(i18n.t('workoutData.updateError'));
        }
    };

    const filteredExercises = adminExercisesStore?.exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()));

    const filteredUsers = adminUsersStore?.userProfiles.filter(user =>
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase()));

    return (
        <AdminPanel>
            <div className="workout-data-modal">
                <h2>{i18n.t('workoutData.editWorkout')}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="workout-details">
                        <h3 onClick={handleToggleDetails} className="toggle-details">
                            {i18n.t('workoutData.workoutInformation')} {isDetailsVisible ? '▼' : '▲'}
                        </h3>
                        {isDetailsVisible && (
                            <div className="workout-section">
                                <div>
                                    <label><strong>{i18n.t('workoutData.name')}:</strong></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData?.name || ''}
                                        onChange={handleInputChange}
                                        placeholder={i18n.t('workoutData.workoutNamePlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label><strong>{i18n.t('workoutData.description')}:</strong></label>
                                    <textarea
                                        name="description"
                                        value={formData?.description || ''}
                                        onChange={handleInputChange}
                                        placeholder={i18n.t('workoutData.workoutDescriptionPlaceholder')}
                                    />
                                </div>
                                <div className="dates">
                                    <p><strong>{i18n.t('workoutData.createdAt')}:</strong> {formData?.created_at || 'x'}</p>
                                    <p><strong>{i18n.t('workoutData.updatedAt')}:</strong> {formData?.updated_at || 'x'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Exercises Section */}
                    <div>
                        <label><strong>{i18n.t('workoutData.searchExercises')}:</strong></label>
                        <input
                            type="text"
                            value={exerciseSearchTerm}
                            onChange={e => setExerciseSearchTerm(e.target.value)}
                            placeholder={i18n.t('workoutData.searchExercises')}
                        />
                        {exerciseSearchTerm && (
                            <div className="exercise-list">
                                {filteredExercises?.map(exercise => (
                                    <div
                                        key={exercise.id}
                                        className={`exercise-item ${selectedExercises.some(e => e.id === exercise.id) ? 'selected' : ''}`}
                                        onClick={() => handleExerciseSelect(exercise)}
                                    >
                                        {exercise.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedExercises.length > 0 && (
                        <div>
                            <label><strong>{i18n.t('workoutData.selectedExercises')}:</strong></label>
                            <table className="exercise-table">
                                <thead>
                                    <tr>
                                        <th>{i18n.t('workoutData.exercise')}</th>
                                        <th>{i18n.t('workoutData.sets')}</th>
                                        <th>{i18n.t('workoutData.repetitions')}</th>
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
                                                    min="1"
                                                    value={exercise.sets || ''}
                                                    onChange={e => {
                                                        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
                                                        handleExerciseChange(exercise.id, 'sets', value);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={exercise.repetitions || ''}
                                                    min={'1'}
                                                    onChange={e => {
                                                        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
                                                        handleExerciseChange(exercise.id, 'repetitions', value);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={exercise.weight || ''}
                                                    min='0'
                                                    onChange={e => {
                                                        const value = Math.max(1, parseInt(e.target.value, 10) || 0);
                                                        handleExerciseChange(exercise.id, 'weight', value);
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

                    {/* Users Section */}
                    <div>
                        <label><strong>{i18n.t('workoutData.searchUsers')}:</strong></label>
                        <input
                            type="text"
                            value={userSearchTerm}
                            onChange={e => setUserSearchTerm(e.target.value)}
                            placeholder={i18n.t('workoutData.searchUsers')}
                        />
                        {userSearchTerm && (
                            <div className="user-list">
                                {filteredUsers?.map(user => (
                                    <div
                                        key={user.id}
                                        className={`user-item ${selectedUsers.some(u => u.id === user.id) ? 'selected' : ''}`}
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
                            <label><strong>{i18n.t('workoutData.selectedUsers')}:</strong></label>
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

                    <div>
                        <button type="submit">{i18n.t('workoutData.updateWorkoutButton')}</button>
                    </div>
                </form>
            </div>
        </AdminPanel>
    );
};

export default inject('adminWorkoutsStore', 'adminWorkoutsController', 'adminUsersStore', 'adminExercisesStore')(observer(WorkoutData));
