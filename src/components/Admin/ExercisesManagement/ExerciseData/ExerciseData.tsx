/* eslint-disable complexity */
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
import { categoryMap, difficultyMap, measurementKeys, muscleGroups } from '../maps';

const ExerciseData: React.FC = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>();
    const [currentExercise, setCurrentExercise] = useState<AdminExerciseProfile | null>(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<AdminExerciseProfile | null>(null);

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

    const handleGroupClick = useCallback((groupId: string) => () => {
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
                                                {categoryMap.map(label => (
                                                    <option key={label} value={label}>{i18n.t(`${label}`)}</option>
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
                                                {difficultyMap.map(label => (
                                                    <option key={label} value={label}>{i18n.t(`${label}`)}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <strong>{i18n.t('type_of_measurement')}</strong>
                                            <select
                                                name="type_of_measurement"
                                                value={formData?.type_of_measurement || ''}
                                                onChange={handleInputChange}
                                                className="custom-select"
                                                required
                                            >
                                                <option value="" disabled>{i18n.t('selectCategory')}</option>
                                                {Object.keys(measurementKeys).map(key => (
                                                    <option key={key} value={String(measurementKeys[key as keyof typeof categoryMap])}>
                                                        {i18n.t(String(measurementKeys[key as keyof typeof categoryMap]))}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <strong>{i18n.t('muscleGroup')}</strong>
                                            <div className="muscle-groups">
                                                {muscleGroups.map(group => (
                                                    <label key={group.name}>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData?.muscle_groups.includes(group.name) || false}
                                                            onChange={handleGroupClick(group.name)}
                                                        />
                                                        {i18n.t(group.name)}
                                                    </label>
                                                ))}
                                            </div>
                                        </div> в
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
                                                ? i18n.t(currentExercise.category)
                                                : i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('difficulty')}:</strong>
                                            {currentExercise?.difficulty
                                                ? i18n.t(currentExercise.difficulty)
                                                : i18n.t('notProvided')}
                                        </p>

                                        <p>
                                            <strong>{i18n.t('type_of_measurement')}:</strong>
                                            {currentExercise?.type_of_measurement
                                                ? i18n.t(currentExercise.type_of_measurement)
                                                : i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('muscleGroup')}:</strong>
                                            {currentExercise?.muscle_groups && currentExercise.muscle_groups.length > 0
                                                ? currentExercise.muscle_groups
                                                    .map(groupId => {
                                                        const muscleGroup = muscleGroups.find(group => group.name === groupId);
                                                        return muscleGroup ? i18n.t(muscleGroup.name) : '';
                                                    })
                                                    .filter(name => name)
                                                    .join(', ')
                                                : i18n.t('notProvided')}
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
