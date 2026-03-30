
import { inject, observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import AdminPanel from '../../AdminPanel';
import { adminExercisesController } from '../../controllers/global';
import { adminExercisesStore } from '../../store/global';
import { AdminExerciseProfile } from '../../store/AdminExercisesStore';
import { categoryMap, difficultyMap, measurementKeys, muscleGroups } from '../maps';
import {
    AddLocalePanel,
    MuscleGroupItem,
    REQUIRED_LOCALE,
    TranslationPanel,
    useLocaleTranslations,
} from './exerciseTranslationHelpers';
import './ExerciseData.style.scss';

const INITIAL_FORM_DATA: AdminExerciseProfile = {
    category: '',
    created_at: '',
    description: '',
    difficulty: '',
    muscle_groups: [],
    name: '',
    type_of_measurement: '',
    updated_at: '',
};

const useExerciseCreateForm = () => {
    const navigate = useNavigate();
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    const [formData, setFormData] = useState<AdminExerciseProfile>(INITIAL_FORM_DATA);
    const localeState = useLocaleTranslations();

    useEffect(() => {
        const fetchedExercise = adminExercisesStore?.exercise;

        if (fetchedExercise) {
            setFormData(fetchedExercise);
        }
    }, []);

    const handleToggleDetails = useCallback(() => {
        setIsDetailsVisible(prev => !prev);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'category') {
            const key = categoryMap.find(el => el === value);

            setFormData(prev => ({ ...prev, [name]: key ?? '' }));
        } else if (name === 'difficulty') {
            const key = difficultyMap.find(el => el === value);

            setFormData(prev => ({ ...prev, [name]: key ?? '' }));
        } else if (name === 'type_of_measurement') {
            const key = measurementKeys.find(el => el === value);

            setFormData(prev => ({ ...prev, [name]: key ?? '' }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'duration' ? parseInt(value, 10) : value,
            }));
        }
    }, []);

    const handleGroupClick = useCallback((groupName: string) => {
        setFormData(prev => {
            const groups = prev.muscle_groups ?? [];
            const updated = groups.includes(groupName)
                ? groups.filter(n => n !== groupName)
                : [...groups, groupName];

            return { ...prev, muscle_groups: updated };
        });
    }, []);

    const handleSaveExercise = useCallback(async() => {
        const { category, difficulty } = formData;
        const ruEntry = localeState.translations[REQUIRED_LOCALE];

        if (!ruEntry?.name || !category || !difficulty || !ruEntry?.description) {
            toast.error(i18n.t('pleaseFillAllFields'));

            return;
        }

        const nameTranslations: Record<string, string> = {};
        const descriptionTranslations: Record<string, string> = {};

        for (const [locale, entry] of Object.entries(localeState.translations)) {
            nameTranslations[locale] = entry.name;
            descriptionTranslations[locale] = entry.description;
        }

        await adminExercisesController.createExercise({
            ...formData,
            description: ruEntry.description,
            description_translations: descriptionTranslations,
            name: ruEntry.name,
            name_translations: nameTranslations,
        });
        navigate('/admin/exercises');
    }, [
        formData,
        localeState.translations,
        navigate,
    ]);

    return {
        ...localeState,
        formData,
        handleGroupClick,
        handleInputChange,
        handleSaveExercise,
        handleToggleDetails,
        isDetailsVisible,
    };
};

const ExerciseData: React.FC = () => {
    const {
        activeLocales,
        availableLocalesToAdd,
        formData,
        handleAddLocale,
        handleGroupClick,
        handleInputChange,
        handleLocaleToAddChange,
        handleRemoveLocale,
        handleSaveExercise,
        handleToggleDetails,
        handleTranslationChange,
        isDetailsVisible,
        localeToAdd,
        translations,
    } = useExerciseCreateForm();

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
                            <div className="translation-panels">
                                {activeLocales.map(locale => (
                                    <TranslationPanel
                                        key={locale}
                                        isRequired={locale === REQUIRED_LOCALE}
                                        locale={locale}
                                        onChange={handleTranslationChange}
                                        onRemove={handleRemoveLocale}
                                        value={translations[locale]}
                                    />
                                ))}
                                <AddLocalePanel
                                    available={availableLocalesToAdd}
                                    localeToAdd={localeToAdd}
                                    onAdd={handleAddLocale}
                                    onChange={handleLocaleToAddChange}
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
                                    {categoryMap.map(key => (
                                        <option key={key} value={key}>
                                            {i18n.t(key)}
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
                                    <option value="" disabled>{i18n.t('selectTypeOfMeasurement')}</option>
                                    {measurementKeys.map(key => (
                                        <option key={key} value={key}>
                                            {i18n.t(key)}
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
                                    {difficultyMap.map(key => (
                                        <option key={key} value={key}>
                                            {i18n.t(key)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <strong>{i18n.t('muscleGroup')}</strong>
                                <div className="muscle-groups">
                                    {muscleGroups.map(group => (
                                        <MuscleGroupItem
                                            key={group.name}
                                            isActive={formData.muscle_groups?.includes(group.name) ?? false}
                                            name={group.name}
                                            onToggle={handleGroupClick}
                                        />
                                    ))}
                                </div>
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
