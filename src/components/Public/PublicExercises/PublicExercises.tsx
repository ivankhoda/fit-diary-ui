/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import './PublicExercises.style.scss';
import { inject, observer } from 'mobx-react';
import ExercisesController from '../../../controllers/ExercisesController';
import ExercisesStore from '../../../store/exercisesStore';

import { useTranslation } from 'react-i18next';

import { muscleGroups } from '../../Admin/ExercisesManagement/maps';
import { toJS } from 'mobx';
import ExerciseItem from '../../User/Exercises/ExerciseItem/ExerciseItem';
import BackButton from '../../Common/BackButton/BackButton';
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
    coach_owned?: boolean
}

export interface ExercisesInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

const ITEMS_PER_PAGE = 10;

const CommonExercises: React.FC<ExercisesInterface> = ({ exercisesStore, exercisesController }) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
    const [sortBy] = useState<'name' | 'duration' | 'category' | null>(null);
    const [activeTab, setActiveTab] = useState<'base' >('base');

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (exercisesController && exercisesStore && !fetchedRef.current) {
            fetchedRef.current = true;
            exercisesController.getPublicExercises();
        }
    }, [exercisesController, exercisesStore]);

    const filteredList = useMemo(() => {
        let exercises = toJS(exercisesStore?.generalExercises);

        // Exercises = exercises.filter(exercise => !exercise.own && !exercise.coach_owned);

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

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) { setCurrentPage(prev => prev + 1); }
    }, [currentPage, totalPages]);

    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) { setCurrentPage(prev => prev - 1); }
    }, [currentPage, totalPages]);

    const handleSortChange = useCallback((tab: 'base') => {
        handleTabChange(tab);
    }, []);

    const handleBaseClick = useCallback(() => {
        handleSortChange('base');
    }, []);

    const handleTabChange = (tab: 'base') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div className="common-exercises">
            <BackButton/>
            <h1 className="common-exercises__title">{t('exercises.title')}</h1>

            <div className="common-exercises__tabs">

                <button
                    className={activeTab === 'base' ? 'active' : ''}
                    onClick={handleBaseClick}
                >
                    {t('exercises.tabs.base')}
                </button>

            </div>

            <div className="common-exercises__filters">
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

            <div className="common-exercises__list">
                {filteredExercises.length > 0
                    ? (
                        filteredExercises.map(exercise => (
                            <ExerciseItem
                                key={exercise.id}
                                exercise={exercise}

                            />
                        ))
                    )
                    : (
                        <p>{t('exercises.noExercises')}</p>
                    )}
            </div>

            {filteredExercises && filteredExercises.length > 0 && (
                <div className="common-exercises__pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        {t('paginationPrevious')}
                    </button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        {t('paginationNext')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default inject('exercisesStore', 'exercisesController')(observer(CommonExercises));
