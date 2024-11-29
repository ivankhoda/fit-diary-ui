/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AdminPanel from '../../AdminPanel';
import { adminExercisesController } from '../../controllers/global';
import { adminExercisesStore } from '../../store/global';
import i18n from 'i18next';
import { AdminExerciseProfile } from '../../store/AdminExercisesStore';


const ExerciseData: React.FC = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>();
    const [currentExercise, setCurrentExercise] = useState<AdminExerciseProfile | null>(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<AdminExerciseProfile | null>(null);

    const categoryMap = {
        strength: i18n.t('strength'),
        cardio: i18n.t('cardio'),
        flexibility: i18n.t('flexibility'),
        balance: i18n.t('balance')
    };
    const difficultyMap = {
        beginner: i18n.t('beginner'),
        intermediate: i18n.t('intermediate'),
        advanced: i18n.t('advanced')
    };
    const muscleGroups = [
        { id: 0, name: i18n.t('muscleGroups.chest') },
        { id: 1, name: i18n.t('muscleGroups.biceps') },
        { id: 2, name: i18n.t('muscleGroups.triceps') },
        { id: 3, name: i18n.t('muscleGroups.back') },
        { id: 4, name: i18n.t('muscleGroups.upper_back') },
        { id: 5, name: i18n.t('muscleGroups.lats') },
        { id: 6, name: i18n.t('muscleGroups.shoulders') },
        { id: 7, name: i18n.t('muscleGroups.forearms') },
        { id: 8, name: i18n.t('muscleGroups.abs') },
        { id: 9, name: i18n.t('muscleGroups.obliques') },
        { id: 10, name: i18n.t('muscleGroups.lower_back') },
        { id: 11, name: i18n.t('muscleGroups.quads') },
        { id: 12, name: i18n.t('muscleGroups.hamstrings') },
        { id: 13, name: i18n.t('muscleGroups.calves') },
        { id: 14, name: i18n.t('muscleGroups.glutes') },
        { id: 15, name: i18n.t('muscleGroups.hip_flexors') },
        { id: 16, name: i18n.t('muscleGroups.adductors') },
        { id: 17, name: i18n.t('muscleGroups.abductors') }
    ];

    useEffect(() => {
        if (exerciseId) {
            adminExercisesController.getExerciseById(exerciseId);
        }
    }, [exerciseId]);

    useEffect(() => {
        const fetchedExercise = adminExercisesStore?.exercise;

        if (fetchedExercise) {
            setCurrentExercise(fetchedExercise);
            setFormData(fetchedExercise);
        }
    }, [adminExercisesStore?.exercise]);

    const handleToggleDetails = useCallback(() => {
        setIsDetailsVisible(prev => !prev);
    }, []);

    const handleEditToggle = useCallback(() => {
        setIsEditing(prev => !prev);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (formData) {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'duration' ? parseInt(value, 10) : value
            }));
        }
    }, [formData]);

    const handleGroupClick = useCallback((groupId: number) => () => {
        if (formData) {
            const updatedGroups = formData.muscle_groups.includes(groupId)
                ? formData.muscle_groups.filter(id => id !== groupId)
                : [...formData.muscle_groups, groupId];

            setFormData(prev => ({ ...prev, muscle_groups: updatedGroups }));
        }
    }, [formData]);



    const handleUpdateExercise = useCallback(() => {
        if (formData) {
            adminExercisesController.updateExercise(formData);
            setIsEditing(false);
            setCurrentExercise(formData);
        }
    }, [formData]);

    const handleCloseEdit = useCallback(() => {
        setIsEditing(false);
        setFormData(currentExercise);
    }, [currentExercise]);

    return (
        <AdminPanel>
            <div className="exercise-data-modal">
                <h2>{i18n.t('exerciseDetails')}</h2>
                <div className="exercise-details">
                    <h3 onClick={handleToggleDetails}>
                        {i18n.t('exerciseInformation')} {isDetailsVisible ? '▼' : '▲'}
                    </h3>
                    {isDetailsVisible && (
                        <div className="exercise-section">
                            {isEditing
                                ? (
                                    <>
                                        <div>
                                            <strong>{i18n.t('name')}</strong>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData?.name || ''}
                                                onChange={handleInputChange}
                                                placeholder={i18n.t('name')}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <strong>{i18n.t('description')}</strong>
                                            <textarea
                                                name="description"
                                                value={formData?.description || ''}
                                                onChange={handleInputChange}
                                                placeholder={i18n.t('description')}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <strong>{i18n.t('category')}</strong>
                                            <select
                                                name="category"
                                                value={formData?.category || ''}
                                                onChange={handleInputChange}
                                            >
                                                {Object.entries(categoryMap).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <strong>{i18n.t('difficulty')}</strong>
                                            <select
                                                name="difficulty"
                                                value={formData?.difficulty || ''}
                                                onChange={handleInputChange}
                                            >
                                                {Object.entries(difficultyMap).map(([key, label]) => (
                                                    <option key={key} value={key}>{i18n.t(`${label}`)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <strong>{i18n.t('muscleGroup')}</strong>
                                            <div className="muscle-groups">
                                                {muscleGroups.map(group => (
                                                    <label key={group.id}>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData?.muscle_groups.includes(group.id) || false}
                                                            onChange={handleGroupClick(group.id)}
                                                        />
                                                        {group.name}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <strong>{i18n.t('duration')}</strong>
                                            <input
                                                type="number"
                                                name="duration"
                                                value={formData?.duration || ''}
                                                onChange={handleInputChange}
                                                placeholder={i18n.t('duration')}
                                                required
                                            />
                                        </div>
                                    </>
                                )
                                : (
                                    <>
                                        <p>
                                            <strong>{i18n.t('name')}:</strong> {currentExercise?.name || i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('description')}:</strong> {currentExercise?.description || i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('category')}:</strong>
                                            {currentExercise?.category
                                                ? categoryMap[currentExercise.category as keyof typeof categoryMap]
                                                : i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('difficulty')}:</strong>
                                            {currentExercise?.difficulty
                                                ? difficultyMap[currentExercise.difficulty as keyof typeof difficultyMap]
                                                : i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('muscleGroup')}:</strong>
                                            {currentExercise?.muscle_groups && currentExercise.muscle_groups.length > 0
                                                ? currentExercise.muscle_groups
                                                    .map(groupId => {
                                                        const muscleGroup = muscleGroups.find(group => group.id === groupId);
                                                        return muscleGroup ? muscleGroup.name : '';
                                                    })
                                                    .filter(name => name)
                                                    .join(', ')
                                                : i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('duration')}:</strong>
                                            {currentExercise?.duration || i18n.t('notProvided')} {i18n.t('seconds')}
                                        </p>
                                    </>

                                )}
                            <p><strong>{i18n.t('createdAt')}:</strong> {currentExercise?.created_at || 'N/A'}</p>
                            <p><strong>{i18n.t('updatedAt')}:</strong> {currentExercise?.updated_at || 'N/A'}</p>
                        </div>
                    )}
                </div>
                <div>
                    {isEditing
                        ? (
                            <>
                                <button onClick={handleUpdateExercise}>{i18n.t('updateExercise')}</button>
                                <button onClick={handleCloseEdit}>{i18n.t('cancel')}</button>
                            </>
                        )
                        : (
                            <button onClick={handleEditToggle}>{i18n.t('editExercise')}</button>
                        )}
                </div>
            </div>
        </AdminPanel>
    );
};

export default inject('adminExercisesStore')(observer(ExerciseData));
