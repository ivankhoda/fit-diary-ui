/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './Exercises.style.scss';
import { inject, observer } from 'mobx-react';
import ExercisesController from '../../../controllers/ExercisesController';
import ExercisesStore from '../../../store/exercisesStore';
import ExerciseItem from './ExerciseItem/ExerciseItem';
import { useTranslation } from 'react-i18next';

import ExerciseModal from './ExerciseModal/ExerciseModal';
import { muscleGroups } from '../../Admin/ExercisesManagement/maps';
import { toJS } from 'mobx';

export interface Exercise {
    uuid: string;
    instanceId?: string;
    id: number;
    name: string;
    category: 'strength' | 'cardio' | 'flexibility' | 'balance';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    description: string;
    duration: number;
    muscle_groups: string[];
    own?: boolean;
}

export interface ExercisesInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

const ITEMS_PER_PAGE = 10;

const Exercises: React.FC<ExercisesInterface> = ({ exercisesStore, exercisesController }) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
    const [sortBy] = useState<'name' | 'duration' | 'category' | null>(null);
    const [activeTab, setActiveTab] = useState<'base' | 'own'>('own');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exerciseToEdit, setExerciseToEdit] = useState(null);

    useEffect(() => {
        if (exercisesController && exercisesStore && !exercisesStore.generalExercises?.length) {
            exercisesController.getExercises();
        }
    }, [exercisesController,
        exercisesStore,
        exercisesStore.generalExercises]);

    const filteredList = useMemo(() => {
        let exercises = toJS(exercisesStore?.generalExercises);

        if (activeTab === 'own') {
            exercises = exercises.filter(exercise => exercise.own);
        } else {
            exercises = exercises.filter(exercise => !exercise.own);
        }

        if (searchQuery) {
            exercises = exercises.filter(exercise =>
                exercise.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (selectedMuscleGroup) {
            exercises = exercises.filter(exercise =>
                exercise.muscle_groups.includes(selectedMuscleGroup));
        }

        if (sortBy) {
            exercises = exercises.slice().sort((a, b) => {
                if (sortBy === 'name') { return a.name.localeCompare(b.name); }
                if (sortBy === 'duration') { return a.duration - b.duration; }
                if (sortBy === 'category') { return a.category.localeCompare(b.category); }
                return 0;
            });
        }

        return exercises;
    }, [
        exercisesStore.generalExercises,
        searchQuery,
        selectedMuscleGroup,
        sortBy,
        activeTab
    ]);

    const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

    const filteredExercises = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredList, currentPage]);



    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleMuscleGroupChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMuscleGroup(e.target.value || null);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
        setExerciseToEdit(null);
    },[]);

    const handleSaveSuccess = useCallback(() => {
        setIsModalVisible(false);
        setExerciseToEdit(null);
    },[]);

    const handleOpenModal = useCallback((exercise: Exercise | null = null) => {
        setExerciseToEdit(exercise);
        setIsModalVisible(true);
    }, []);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) { setCurrentPage(prev => prev + 1); }
    }, [currentPage, totalPages]);

    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) { setCurrentPage(prev => prev - 1); }
    }, [currentPage, totalPages]);

    const handleSortChange = useCallback((tab: 'base' | 'own') => {
        handleTabChange(tab);
    }, []);

    const handleBaseClick = useCallback(() => {
        handleSortChange('base');
    }, []);

    const handleOwnClick = useCallback(() => {
        handleSortChange('own');
    },[]);

    const handleTabChange = (tab: 'base' | 'own') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleDeleteExercise = useCallback((id: number) => {
        exercisesController.deleteExercise(id);
    }, []);


    interface HandleEditExercise {
        (exercise: Exercise): void;
    }

    const handleEditExercise: HandleEditExercise = useCallback((exercise: Exercise) => {
        handleOpenModal(exercise);
    }, [handleOpenModal]);


    return (
        <div className="container">
            <h1>{t('exercises.title')}</h1>

            <div className="tabs">
                <button className={activeTab === 'own' ? 'active' : ''} onClick={handleOwnClick}>
                    {t('exercises.tabs.own')}
                </button>
                <button className={activeTab === 'base' ? 'active' : ''} onClick={handleBaseClick}>
                    {t('exercises.tabs.base')}
                </button>
                <div>
                    <button onClick={() => handleOpenModal()}>{t('createExercise')}</button>

                    {isModalVisible && (
                        <ExerciseModal onClose={handleModalClose} onSave={handleSaveSuccess}
                            exercisesController={exercisesController}
                            exercise={exerciseToEdit}
                        />
                    )}
                </div>

            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder={t('exercises.searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <select onChange={handleMuscleGroupChange} value={selectedMuscleGroup || ''}>
                    <option value="">{t('exercises.allMuscleGroups')}</option>
                    {muscleGroups.map(group => (
                        <option key={group.name} value={group.name}>
                            {t(group.name)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="filtered-exercises">
                {filteredExercises.length > 0
                    ? (
                        filteredExercises.map(exercise => (
                            <ExerciseItem
                                key={exercise.id}
                                exercise={exercise}
                                deleteExercise={() => handleDeleteExercise(exercise.id)}
                                edit={() => handleEditExercise(exercise)}
                            />
                        ))
                    )
                    : (
                        <p>{t('exercises.noExercises')}</p>
                    )}
            </div>

            {filteredExercises && filteredExercises.length> 0 &&<div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    {t('paginationPrevious') }
                </button>
                <span>
                    { currentPage} / {totalPages }
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    { t('paginationNext')}
                </button>
            </div>}
        </div>
    );
};

export default inject('exercisesStore', 'exercisesController')(observer(Exercises));
