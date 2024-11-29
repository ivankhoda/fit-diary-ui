import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './Exercises.style.scss';
import { inject, observer } from 'mobx-react';
import ExercisesController from '../../../controllers/ExercisesController';
import ExercisesStore from '../../../store/exercisesStore';
import ExerciseItem from './ExerciseItem/ExerciseItem';
import { useTranslation } from 'react-i18next';

export interface Exercise {
    id: number;
    name: string;
    category: 'strength' | 'cardio' | 'flexibility' | 'balance';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    description: string;
    duration: number;
    muscle_groups: string[];
}

interface ExercisesInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

const ITEMS_PER_PAGE = 10;

const Exercises: React.FC<ExercisesInterface> = ({ exercisesStore, exercisesController }) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'name' | 'duration' | 'category' | null>(null);

    useEffect(() => {
        if (exercisesController && exercisesStore && !exercisesStore.generalExercises?.length) {
            exercisesController.getExercises();
        }
    }, [exercisesController, exercisesStore]);

    const filteredExercises = useMemo(() => {
        let exercises: Exercise[] = exercisesStore?.generalExercises || [];

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

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return exercises.slice(startIndex, endIndex);
    }, [
        exercisesStore?.generalExercises,
        searchQuery,
        selectedMuscleGroup,
        sortBy,
        currentPage,
    ]);

    const totalPages = Math.ceil((exercisesStore?.generalExercises?.length || 0) / ITEMS_PER_PAGE);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleMuscleGroupChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMuscleGroup(e.target.value || null);
    }, []);

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as 'name' | 'duration' | 'category' | null);
    }, []);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) { setCurrentPage(prev => prev + 1); }
    }, [currentPage, totalPages]);

    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) { setCurrentPage(prev => prev - 1); }
    }, [currentPage]);

    return (
        <div className="container">
            <h1>{t('exercises.title')}</h1>

            <div className="filters">
                <input
                    type="text"
                    placeholder={t('exercises.searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <select onChange={handleMuscleGroupChange} value={selectedMuscleGroup || ''}>
                    <option value="">{t('exercises.allMuscleGroups')}</option>
                    <option value="chest">{t('exercises.muscleGroups.chest')}</option>
                    <option value="biceps">{t('exercises.muscleGroups.biceps')}</option>
                    <option value="triceps">{t('exercises.muscleGroups.triceps')}</option>
                    <option value="back">{t('exercises.muscleGroups.back')}</option>
                    <option value="legs">{t('exercises.muscleGroups.legs')}</option>
                    <option value="shoulders">{t('exercises.muscleGroups.shoulders')}</option>
                </select>
                <select onChange={handleSortChange} value={sortBy || ''}>
                    <option value="">{t('exercises.sortBy')}</option>
                    <option value="name">{t('exercises.sortOptions.name')}</option>
                    <option value="duration">{t('exercises.sortOptions.duration')}</option>
                    <option value="category">{t('exercises.sortOptions.category')}</option>
                </select>
            </div>

            <div className="exercises-list">
                {filteredExercises.map(exercise => (
                    <ExerciseItem key={exercise.name} exercise={exercise} />
                ))}
            </div>

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    {t('exercises.pagination.previous')}
                </button>
                <span>
                    {t('exercises.pagination.page')} {currentPage} {t('exercises.pagination.of')} {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    {t('exercises.pagination.next')}
                </button>
            </div>
        </div>
    );
};

export default inject('exercisesStore', 'exercisesController')(observer(Exercises));
