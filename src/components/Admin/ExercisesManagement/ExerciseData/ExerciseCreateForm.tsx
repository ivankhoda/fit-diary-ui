/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-lines-per-function */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable sort-keys */
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../../AdminPanel';
import { adminExercisesController } from '../../controllers/global';
import { adminExercisesStore } from '../../store/global';
import i18n from 'i18next';
import './ExerciseData.style.scss';
import { AdminExerciseProfile } from '../../store/AdminExercisesStore';



const ExerciseData: React.FC = () => {
    const navigate = useNavigate();
    const [currentExercise, setCurrentExercise] = useState<AdminExerciseProfile | null>(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);

    const [formData, setFormData] = useState<AdminExerciseProfile>({
        name: '',
        category: '',
        difficulty: '',
        muscle_groups: [],
        duration: 0,
        description: '',
        created_at: '',
        updated_at: ''
    });

    // Define type for the keys of category and difficulty maps
    type CategoryKey = 'strength' | 'cardio' | 'flexibility' | 'balance';
    type DifficultyKey = 'beginner' | 'intermediate' | 'advanced';

    // Maps for category and difficulty
    const categoryMap: Record<CategoryKey, string> = {
        strength: i18n.t('strength'),
        cardio: i18n.t('cardio'),
        flexibility: i18n.t('flexibility'),
        balance: i18n.t('balance'),
    };

    const difficultyMap: Record<DifficultyKey, string> = {
        beginner: i18n.t('beginner'),
        intermediate: i18n.t('intermediate'),
        advanced: i18n.t('advanced'),
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
            const key = Object.keys(categoryMap).find(key => categoryMap[key as keyof typeof categoryMap] === value) as CategoryKey;
            setFormData(prevState => ({
                ...prevState,
                [name]: key || '',
            }));
        }

        else if (name === 'difficulty') {
            const key = Object.keys(difficultyMap).find(key => difficultyMap[key as keyof typeof difficultyMap] === value) as DifficultyKey;

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

    const handleGroupClick = (groupId: number) => {
        const newSelectedGroups = formData.muscle_groups.includes(groupId)
            ? formData.muscle_groups.filter(id => id !== groupId)
            : [...formData.muscle_groups, groupId];

        setFormData(prevState => ({
            ...prevState,
            muscle_groups: newSelectedGroups,
        }));
    };

    const handleSaveExercise = useCallback(async() => {
        // Validate all required fields before saving
        const { name, category, difficulty, description, duration, muscle_groups } = formData;

        if (!name || !category || !difficulty || !description || !duration || muscle_groups.length === 0) {
            alert(i18n.t('pleaseFillAllFields'));
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
                                    value={categoryMap[formData?.category as CategoryKey] || ''}
                                    onChange={handleInputChange}
                                    className="custom-select"
                                    required
                                >
                                    <option value="" disabled>{i18n.t('selectCategory')}</option>
                                    {Object.keys(categoryMap).map(key => (
                                        <option key={key} value={categoryMap[key as keyof typeof categoryMap]}>
                                            {categoryMap[key as keyof typeof categoryMap]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <strong>{i18n.t('difficulty')}</strong>
                                <select
                                    name="difficulty"
                                    value={difficultyMap[formData?.difficulty as DifficultyKey] || ''}
                                    onChange={handleInputChange}
                                    className="custom-select"
                                    required
                                >
                                    <option value="" disabled>{i18n.t('selectDifficulty')}</option>
                                    {Object.keys(difficultyMap).map(key => (
                                        <option key={key} value={difficultyMap[key as keyof typeof difficultyMap]}>
                                            {difficultyMap[key as keyof typeof difficultyMap]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <strong>{i18n.t('muscleGroup')}</strong>
                                <div className="muscle-groups">
                                    {muscleGroups.map(group => (
                                        <div
                                            key={group.id}
                                            onClick={() => handleGroupClick(group.id)}
                                            className={formData.muscle_groups.includes(group.id) ? 'active' : ''}
                                        >
                                            {group.name}
                                        </div>
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
