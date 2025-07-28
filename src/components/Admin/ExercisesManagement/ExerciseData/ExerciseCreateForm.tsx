/* eslint-disable max-lines-per-function */
/* eslint-disable react/jsx-no-bind */

import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../../AdminPanel';
import { adminExercisesController } from '../../controllers/global';
import { adminExercisesStore } from '../../store/global';
import i18n from 'i18next';
import './ExerciseData.style.scss';
import { AdminExerciseProfile } from '../../store/AdminExercisesStore';
import { categoryMap, difficultyMap, measurementKeys, muscleGroups } from '../maps';
import { toast } from 'react-toastify';

const ExerciseData: React.FC = () => {
    const navigate = useNavigate();
    const [currentExercise, setCurrentExercise] = useState<AdminExerciseProfile | null>(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);

    const [formData, setFormData] = useState<AdminExerciseProfile>({
        category: '',
        created_at: '',
        description: '',
        difficulty: '',
        muscle_groups: [],
        name: '',
        type_of_measurement: '',
        updated_at: ''
    });

    useEffect(() => {
        const fetchedExercise = adminExercisesStore?.exercise;

        if (fetchedExercise) {
            setCurrentExercise(fetchedExercise);
            setFormData(fetchedExercise);
        }
    }, [adminExercisesStore?.exercise]);

    const handleToggleDetails = useCallback(() => {
        setIsDetailsVisible(prevState => !prevState);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'category') {
            const key = categoryMap.find(el=> el === value);
            setFormData(prevState => ({
                ...prevState,
                [name]: key || '',
            }));
        }

        else if (name === 'difficulty') {
            const key = difficultyMap.find(el=> el === value);

            setFormData(prevState => ({
                ...prevState,
                [name]: key || '',
            }));
        }

        else if (name === 'type_of_measurement') {
            const key = measurementKeys.find(el=> el === value);

            setFormData(prevState => ({
                ...prevState,
                [name]: key || '',
            }));
        }

        else {
            setFormData(prevState => ({
                ...prevState,
                [name]: name === 'duration' ? parseInt(value, 10) : value,
            }));
        }
    }, []);

    const handleGroupClick = useCallback((groupName: string) => {
        const newSelectedGroups = formData.muscle_groups.includes(groupName)
            ? formData.muscle_groups.filter(name => name!== groupName)
            : [...formData.muscle_groups, groupName];

        setFormData(prevState => ({
            ...prevState,
            muscle_groups: newSelectedGroups,
        }));
    }, []);

    const handleSaveExercise = useCallback(async() => {
        const { name, category, difficulty, description} = formData;

        if (!name || !category || !difficulty || !description) {
            toast.success(i18n.t('pleaseFillAllFields'));
            return;
        }

        await adminExercisesController.createExercise(formData);
        navigate('/admin/exercises');
    }, [formData, navigate]);

    return (
        <AdminPanel>
            <div className="exercise-data-modal">
                <h2>{i18n.t('createNewExercise')}</h2>

                <div className="exercise-details">
                    <h3 onClick={handleToggleDetails}>
                        {i18n.t('exerciseInformation')} {isDetailsVisible ? '▼' : '▲'}
                    </h3>
                    {isDetailsVisible && (
                        <div className="exercise-section">
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
                                    className="custom-select"
                                    required
                                >
                                    <option value="" disabled>{i18n.t('selectCategory')}</option>
                                    {Object.keys(categoryMap).map(key => (
                                        <option key={key} value={String(categoryMap[key as keyof typeof categoryMap])}>
                                            {i18n.t(String(categoryMap[key as keyof typeof categoryMap]))}
                                        </option>
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
                                <strong>{i18n.t('difficulty')}</strong>
                                <select
                                    name="difficulty"
                                    value={formData?.difficulty || ''}
                                    onChange={handleInputChange}
                                    className="custom-select"
                                    required
                                >
                                    <option value="" disabled>{i18n.t('selectDifficulty')}</option>
                                    {Object.keys(difficultyMap).map(key => (
                                        <option key={key} value={String(difficultyMap[key as keyof typeof difficultyMap])}>
                                            {i18n.t(String(difficultyMap[key as keyof typeof difficultyMap]))}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <strong>{i18n.t('muscleGroup')}</strong>
                                <div className="muscle-groups">
                                    {muscleGroups.map(group => (
                                        <div
                                            key={group.name}
                                            onClick={handleGroupClick.bind(null, group.name)}
                                            className={formData.muscle_groups.includes(group.name) ? 'active' : ''}
                                        >
                                            {i18n.t(group.name)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="dates">
                                <p><strong>{i18n.t('createdAt')}</strong>: {currentExercise?.created_at || 'x'}</p>
                                <p><strong>{i18n.t('updatedAt')}</strong>: {currentExercise?.updated_at || 'x'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <button onClick={handleSaveExercise}>{i18n.t('createExercise')}</button>
                </div>
            </div>
        </AdminPanel>
    );
};

export default inject('adminExercisesStore')(observer(ExerciseData));
