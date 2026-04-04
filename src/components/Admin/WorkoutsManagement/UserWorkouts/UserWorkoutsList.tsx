import React, { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import ReactPaginate from 'react-paginate';

import { useParams } from 'react-router';
import AdminPanel from '../../AdminPanel';
import AdminUsersStore from '../../store/AdminUsersStore';
import AdminUsersController from '../../controllers/AdminUsersController';
import { WorkoutInterface } from '../../../../store/workoutStore';
import { UserExerciseSets } from '../../../User/workouts/CurrentWorkout/UserExerciseSets/UserExerciseSets';
import { t } from 'i18next';

export interface UserWorkoutsListProps {
    adminUsersStore?: AdminUsersStore;
    adminUsersController?: AdminUsersController;
}

const ITEMS_PER_PAGE = 20;
const SORT_BEFORE = -1;

const useUserWorkoutsFilters = (workouts: WorkoutInterface[]) => {
    const [searchName, setSearchName] = useState<string>('');
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(0);

    const handleSort = useCallback((key: string) => {
        if (sortKey === key) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    }, [sortKey]);

    const clearFilters = useCallback(() => {
        setSearchName('');
        setSortKey('');
        setSortDirection('asc');
        setCurrentPage(0);
    }, []);

    const handlePageChange = useCallback((data: { selected: number }) => {
        setCurrentPage(data.selected);
    }, []);

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
        setCurrentPage(0);
    }, []);

    const filteredWorkouts = workouts
        .filter(w => w.name.toLowerCase().includes(searchName.toLowerCase()))
        .sort((a, b) => {
            if (!sortKey) { return 0; }

            const aVal = a[sortKey as keyof WorkoutInterface];
            const bVal = b[sortKey as keyof WorkoutInterface];

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : SORT_BEFORE;
            }
            return aVal < bVal ? 1 : SORT_BEFORE;
        });

    const currentItems = filteredWorkouts.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE,
    );
    const pageCount = Math.ceil(filteredWorkouts.length / ITEMS_PER_PAGE);

    return {
        clearFilters,
        currentItems,
        handlePageChange,
        handleSearch,
        handleSort,
        pageCount,
        searchName,
        sortDirection,
        sortKey,
    };
};

const UserWorkoutList: React.FC<UserWorkoutsListProps> = observer(({ adminUsersStore, adminUsersController }) => {
    const { userId } = useParams<{ userId: string }>();
    const { userWorkoutsDone } = adminUsersStore;
    const [expandedIds, setExpandedIds] = useState<number[]>([]);

    useEffect(() => {
        adminUsersController?.getUserWorkoutsDoneByUser(userId);
    }, [adminUsersController, userId]);

    const {
        searchName,
        handleSearch,
        sortKey,
        sortDirection,
        handleSort,
        clearFilters,
        handlePageChange,
        currentItems,
        pageCount,
    } = useUserWorkoutsFilters(userWorkoutsDone ?? []);

    const handleSortId = useCallback(() => handleSort('id'), [handleSort]);
    const handleSortName = useCallback(() => handleSort('name'), [handleSort]);
    const handleSortDate = useCallback(() => handleSort('date'), [handleSort]);
    const handleSortDuration = useCallback(() => handleSort('duration'), [handleSort]);

    const toggleExpand = useCallback((id: number) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],);
    }, []);

    const handleToggle = useCallback((id: number) => () => {
        toggleExpand(id);
    }, [toggleExpand]);

    const sortArrow = (key: string) => {
        if (sortKey !== key) { return null; }
        return sortDirection === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <AdminPanel>
            <div className="workout-management">
                <h2>{t('userWorkouts.title')}</h2>

                <div className="search-bar">
                    <input
                        type="text"
                        value={searchName}
                        onChange={handleSearch}
                        placeholder={t('workoutList.searchPlaceholder')}
                    />
                </div>

                <div className="filters">
                    <button onClick={clearFilters}>{t('filters.clear')}</button>
                </div>

                <table className="workout-table">
                    <thead>
                        <tr>
                            <th onClick={handleSortId}>
                                {t('workoutList.id')}{sortArrow('id')}
                            </th>
                            <th onClick={handleSortName}>
                                {t('workoutList.name')}{sortArrow('name')}
                            </th>
                            <th onClick={handleSortDate}>
                                {t('workoutList.date')}{sortArrow('date')}
                            </th>
                            <th onClick={handleSortDuration}>
                                {t('workout.duration')}{sortArrow('duration')}
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(workout => (
                            <React.Fragment key={workout.id}>
                                <tr style={{ cursor: 'pointer' }} onClick={handleToggle(workout.id)}>
                                    <td>{workout.id}</td>
                                    <td>{workout.name}</td>
                                    <td>{workout.date || workout.created_at?.split(' ')[0]}</td>
                                    <td>{workout.duration ?? '—'}</td>
                                    <td>{expandedIds.includes(workout.id) ? '▲' : '▼'}</td>
                                </tr>
                                {expandedIds.includes(workout.id) && (
                                    <tr>
                                        <td colSpan={5}>
                                            {workout.comment && (
                                                <p>
                                                    <strong>{t('workout.comment')}:</strong> {workout.comment}
                                                </p>
                                            )}
                                            {workout.user_exercises && workout.user_exercises.length > 0
                                                ? (
                                                    workout.user_exercises.map(exercise => (
                                                        <div key={exercise.id} className="exercise-item">
                                                            <p><strong>{exercise.name}</strong></p>
                                                            {exercise.formatted_duration && (
                                                                <p>
                                                                    {t('workoutData.exercise_duration')}: {exercise.formatted_duration}
                                                                </p>
                                                            )}
                                                            {exercise.comment && (
                                                                <p>
                                                                    {t('workoutData.comment')}: {exercise.comment}
                                                                </p>
                                                            )}
                                                            {exercise.number_of_sets && exercise.number_of_sets.length > 0 && (
                                                                <div className="sets-list">
                                                                    <UserExerciseSets
                                                                        exerciseId={exercise.id}
                                                                        measurementType={exercise.type_of_measurement}
                                                                        sets={exercise.number_of_sets}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                )
                                                : (
                                                    <p>{t('workouts.noExercises')}</p>
                                                )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan={5}>{t('workouts.noWorkouts')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {pageCount > 1 && (
                    <ReactPaginate
                        previousLabel={t('workouts.pagination.previous')}
                        nextLabel={t('workouts.pagination.next')}
                        breakLabel="..."
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName="pagination"
                        activeClassName="active"
                    />
                )}
            </div>
        </AdminPanel>
    );
});

export default UserWorkoutList;
