import { inject, observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import i18n from 'i18next';
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

type SetFormData = React.Dispatch<React.SetStateAction<AdminExerciseProfile | null>>;

const useExerciseFormFields = (formData: AdminExerciseProfile | null, setFormData: SetFormData) => {
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (formData) {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'duration' ? parseInt(value, 10) : value,
            }));
        }
    }, [formData, setFormData]);

    const handleGroupClick = useCallback((groupId: string) => {
        if (formData) {
            const groups = formData.muscle_groups ?? [];
            const updated = groups.includes(groupId)
                ? groups.filter(id => id !== groupId)
                : [...groups, groupId];

            setFormData(prev => ({ ...prev, muscle_groups: updated }));
        }
    }, [formData, setFormData]);

    return { handleGroupClick, handleInputChange };
};

const useExerciseDataPage = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>();
    const [currentExercise, setCurrentExercise] = useState<AdminExerciseProfile | null>(null);
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<AdminExerciseProfile | null>(null);
    const localeState = useLocaleTranslations();

    useEffect(() => {
        if (exerciseId) {
            adminExercisesController.getExerciseById(exerciseId);
        }
    }, [exerciseId]);

    useEffect(() => {
        const fetched = adminExercisesStore?.exercise;

        if (fetched) {
            setCurrentExercise(fetched);
            setFormData(fetched);
            localeState.initFromTranslations(
                fetched.name_translations ?? {},
                fetched.description_translations ?? {},
            );
        }
    }, [adminExercisesStore?.exercise]);

    const { handleGroupClick, handleInputChange } = useExerciseFormFields(formData, setFormData);

    const handleToggleDetails = useCallback(() => setIsDetailsVisible(prev => !prev), []);
    const handleEditToggle = useCallback(() => setIsEditing(prev => !prev), []);

    const handleUpdateExercise = useCallback(() => {
        if (!formData) {
            return;
        }

        const ruEntry = localeState.translations[REQUIRED_LOCALE];
        const nameTranslations: Record<string, string> = {};
        const descriptionTranslations: Record<string, string> = {};

        for (const [locale, entry] of Object.entries(localeState.translations)) {
            nameTranslations[locale] = entry.name;
            descriptionTranslations[locale] = entry.description;
        }

        adminExercisesController.updateExercise({
            ...formData,
            description: ruEntry?.description ?? formData.description ?? '',
            description_translations: descriptionTranslations,
            name: ruEntry?.name ?? formData.name ?? '',
            name_translations: nameTranslations,
        });
        setIsEditing(false);
        setCurrentExercise(formData);
    }, [formData, localeState.translations]);

    const handleCloseEdit = useCallback(() => {
        setIsEditing(false);
        setFormData(currentExercise);
    }, [currentExercise]);

    return {
        ...localeState,
        currentExercise,
        formData,
        handleCloseEdit,
        handleEditToggle,
        handleGroupClick,
        handleInputChange,
        handleToggleDetails,
        handleUpdateExercise,
        isDetailsVisible,
        isEditing,
    };
};

const ExerciseData: React.FC = () => {
    const {
        activeLocales,
        availableLocalesToAdd,
        currentExercise,
        formData,
        handleAddLocale,
        handleCloseEdit,
        handleEditToggle,
        handleGroupClick,
        handleInputChange,
        handleLocaleToAddChange,
        handleRemoveLocale,
        handleToggleDetails,
        handleTranslationChange,
        handleUpdateExercise,
        isDetailsVisible,
        isEditing,
        localeToAdd,
        translations,
    } = useExerciseDataPage();

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
                                            >
                                                {categoryMap.map(label => (
                                                    <option key={label} value={label}>{i18n.t(label)}</option>
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
                                            >
                                                {difficultyMap.map(label => (
                                                    <option key={label} value={label}>{i18n.t(label)}</option>
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
                                            >
                                                <option value="" disabled>{i18n.t('selectTypeOfMeasurement')}</option>
                                                {measurementKeys.map(key => (
                                                    <option key={key} value={key}>{i18n.t(key)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <strong>{i18n.t('muscleGroup')}</strong>
                                            <div className="muscle-groups">
                                                {muscleGroups.map(group => (
                                                    <MuscleGroupItem
                                                        key={group.name}
                                                        isActive={formData?.muscle_groups?.includes(group.name) ?? false}
                                                        name={group.name}
                                                        onToggle={handleGroupClick}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )
                                : (
                                    <>
                                        {activeLocales.map(locale => (
                                            <div key={locale} className="translation-view">
                                                <h4>{locale.toUpperCase()}</h4>
                                                <p>
                                                    <strong>{i18n.t('name')}:</strong>{' '}
                                                    {translations[locale]?.name || i18n.t('notProvided')}
                                                </p>
                                                <p>
                                                    <strong>{i18n.t('description')}:</strong>{' '}
                                                    {translations[locale]?.description || i18n.t('notProvided')}
                                                </p>
                                            </div>
                                        ))}
                                        <p>
                                            <strong>{i18n.t('category')}:</strong>{' '}
                                            {currentExercise?.category ? i18n.t(currentExercise.category) : i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('difficulty')}:</strong>{' '}
                                            {currentExercise?.difficulty ? i18n.t(currentExercise.difficulty) : i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('type_of_measurement')}:</strong>{' '}
                                            {currentExercise?.type_of_measurement
                                                ? i18n.t(currentExercise.type_of_measurement)
                                                : i18n.t('notProvided')}
                                        </p>
                                        <p>
                                            <strong>{i18n.t('muscleGroup')}:</strong>{' '}
                                            {currentExercise?.muscle_groups?.length
                                                ? currentExercise.muscle_groups
                                                    .map(id => {
                                                        const g = muscleGroups.find(mg => mg.name === id);

                                                        return g ? i18n.t(g.name) : '';
                                                    })
                                                    .filter(Boolean)
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

