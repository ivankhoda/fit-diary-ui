import React, { useState, useCallback, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import ReactPaginate from 'react-paginate';
import AdminPanel from '../AdminPanel';
import { useNavigate } from 'react-router-dom';
import AdminExercisesController from '../controllers/AdminExercisesController';
import AdminExercisesStore, { AdminExerciseProfile } from '../store/AdminExercisesStore';
import i18n from 'i18next';
import { categoryMap, difficultyMap, muscleGroups } from './maps';

const ITEMS_PER_PAGE = 20;
const ORDER_ASC = 1;
const ORDER_DESC = -1;

export interface ExerciseListProps {
    adminExercisesStore?: AdminExercisesStore;
    adminExercisesController?: AdminExercisesController;
}

const useFilterState = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchName, setSearchName] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterDifficulty, setFilterDifficulty] = useState<string>('');
    const [filterMuscleGroup, setFilterMuscleGroup] = useState<string>('');
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    return {
        currentPage,
        filterCategory,
        filterDifficulty,
        filterMuscleGroup,
        searchName,
        setCurrentPage,
        setFilterCategory,
        setFilterDifficulty,
        setFilterMuscleGroup,
        setSearchName,
        setSortDirection,
        setSortKey,
        sortDirection,
        sortKey,
    };
};

const useExerciseFilters = (exercises: AdminExerciseProfile[]) => {
    const {
        currentPage,
        filterCategory,
        filterDifficulty,
        filterMuscleGroup,
        searchName,
        setCurrentPage,
        setFilterCategory,
        setFilterDifficulty,
        setFilterMuscleGroup,
        setSearchName,
        setSortDirection,
        setSortKey,
        sortDirection,
        sortKey,
    } = useFilterState();

    const handleSort = useCallback((key: string) => {
        if (sortKey === key) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    }, [sortKey]);

    const handleSortClick = useCallback((e: React.MouseEvent<HTMLTableHeaderCellElement>) => {
        handleSort(e.currentTarget.dataset.sortKey ?? '');
    }, [handleSort]);

    const clearFilters = useCallback(() => {
        setSearchName('');
        setFilterCategory('');
        setFilterDifficulty('');
        setFilterMuscleGroup('');
        setSortKey('');
        setSortDirection('asc');
        setCurrentPage(0);
    }, []);

    const handlePageChange = useCallback((data: { selected: number }) => {
        setCurrentPage(data.selected);
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
    }, []);

    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterCategory(e.target.value);
    }, []);

    const handleDifficultyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterDifficulty(e.target.value);
    }, []);

    const handleMuscleGroupChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterMuscleGroup(e.target.value);
    }, []);

    const matchesFilters = (e: AdminExerciseProfile) =>
        e.name.toLowerCase().includes(searchName.toLowerCase()) &&
        (!filterCategory || e.category === filterCategory) &&
        (!filterDifficulty || e.difficulty === filterDifficulty) &&
        (!filterMuscleGroup || e.muscle_groups.includes(filterMuscleGroup));

    const filteredExercises = exercises
        .filter(matchesFilters)
        .sort((a, b) => {
            if (!sortKey) { return 0; }

            const aVal = a[sortKey as keyof AdminExerciseProfile];
            const bVal = b[sortKey as keyof AdminExerciseProfile];

            if (sortDirection === 'asc') {
                return aVal > bVal ? ORDER_ASC : ORDER_DESC;
            }

            return aVal < bVal ? ORDER_ASC : ORDER_DESC;
        });

    const currentExercises = filteredExercises.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE,
    );
    const pageCount = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);

    return {
        clearFilters,
        currentExercises,
        filterCategory,
        filterDifficulty,
        filterMuscleGroup,
        handleCategoryChange,
        handleDifficultyChange,
        handleMuscleGroupChange,
        handlePageChange,
        handleSearchChange,
        handleSortClick,
        pageCount,
        searchName,
        sortDirection,
        sortKey,
    };
};

const getSortIndicator = (key: string, sortKey: string, sortDirection: 'asc' | 'desc') => {
    if (sortKey !== key) { return null; }

    return sortDirection === 'asc' ? ' ▲' : ' ▼';
};

const ExerciseList: React.FC<ExerciseListProps> = observer(({ adminExercisesStore, adminExercisesController }) => {
    const navigate = useNavigate();
    const exercises = adminExercisesStore?.exercises ?? [];
    const {
        clearFilters,
        currentExercises,
        filterCategory,
        filterDifficulty,
        filterMuscleGroup,
        handleCategoryChange,
        handleDifficultyChange,
        handleMuscleGroupChange,
        handlePageChange,
        handleSearchChange,
        handleSortClick,
        pageCount,
        searchName,
        sortDirection,
        sortKey,
    } = useExerciseFilters(exercises);

    useEffect(() => {
        adminExercisesController?.getExercises();
    }, [adminExercisesController]);

    const handleExerciseClick = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
        navigate(`/admin/exercises/${e.currentTarget.dataset.exerciseId}`);
    }, [navigate]);

    const handleCreateExercise = useCallback(() => {
        navigate('/admin/exercises/create');
    }, [navigate]);

    if (!adminExercisesStore || !adminExercisesController) {
        return null;
    }

    return (
        <AdminPanel>
            <div className="exercise-management">
                <h2>{i18n.t('exerciseListTitle')}</h2>
                <div className="create-exercise-button">
                    <button onClick={handleCreateExercise}>{i18n.t('createExercise')}</button>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        value={searchName}
                        onChange={handleSearchChange}
                        placeholder={i18n.t('searchByName')}
                    />
                </div>

                <div className="filters">
                    <select value={filterCategory} onChange={handleCategoryChange}>
                        {categoryMap.map(category => (
                            <option key={category} value={category}>{i18n.t(category)}</option>
                        ))}
                    </select>

                    <select value={filterDifficulty} onChange={handleDifficultyChange}>
                        {difficultyMap.map(difficulty => (
                            <option key={difficulty} value={difficulty}>{i18n.t(difficulty)}</option>
                        ))}
                    </select>

                    <select value={filterMuscleGroup} onChange={handleMuscleGroupChange}>
                        {muscleGroups.map(muscleGroup => (
                            <option key={muscleGroup.name} value={muscleGroup.name}>{i18n.t(muscleGroup.name)}</option>
                        ))}
                    </select>

                    <button onClick={clearFilters}>{i18n.t('clearFilters')}</button>
                </div>

                <table className="exercise-table">
                    <thead>
                        <tr>
                            <th data-sort-key="id" onClick={handleSortClick}>{i18n.t('id')}{getSortIndicator('id', sortKey, sortDirection)}</th>
                            <th data-sort-key="name" onClick={handleSortClick}>{i18n.t('name')}{getSortIndicator('name', sortKey, sortDirection)}</th>
                            <th data-sort-key="category" onClick={handleSortClick}>
                                {i18n.t('category')}{getSortIndicator('category', sortKey, sortDirection)}
                            </th>
                            <th data-sort-key="difficulty" onClick={handleSortClick}>
                                {i18n.t('difficulty')}{getSortIndicator('difficulty', sortKey, sortDirection)}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentExercises.map(exercise => (
                            <tr
                                key={exercise.id}
                                data-exercise-id={exercise.id}
                                onClick={handleExerciseClick}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{exercise.id}</td>
                                <td>{exercise.name}</td>
                                <td>{i18n.t(`${exercise.category}`)}</td>
                                <td>{i18n.t(`${exercise.difficulty}`)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={`${i18n.t('previous')}`}
                    nextLabel={`${i18n.t('next')}`}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>
        </AdminPanel>
    );
});

export default inject('adminExercisesStore', 'adminExercisesController')(ExerciseList);
