/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
import React, { useState, useCallback, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import ReactPaginate from 'react-paginate';
import AdminPanel from '../AdminPanel';

import AdminWorkoutsController from '../controllers/AdminWorkoutsController';
import AdminWorkoutsStore, { AdminWorkoutProfile } from '../store/AdminWorkoutsStore';
import { useNavigate } from 'react-router';
import i18n from 'i18next';

export interface WorkoutListProps {
    adminWorkoutsStore?: AdminWorkoutsStore;
    adminWorkoutsController?: AdminWorkoutsController;
}

const WorkoutList: React.FC<WorkoutListProps> = observer(({ adminWorkoutsStore, adminWorkoutsController }) => {
    const { workouts } = adminWorkoutsStore;
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchName, setSearchName] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const workoutsPerPage = 10;

    // Fetch workouts on mount
    useEffect(() => {
        adminWorkoutsController?.getWorkouts();
    }, [adminWorkoutsController]);

    // Handling pagination
    const handlePageChange = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    // Sorting handler
    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    // Clear filters
    const clearFilters = useCallback(() => {
        setSearchName('');
        setFilterCategory('');
        setSortKey('');
        setSortDirection('asc');
        setCurrentPage(0);
    }, []);

    const goToNew = useCallback(() => {
        adminWorkoutsController.createWorkout(navigate);
    }, [navigate]);

    const filteredWorkouts = Array.isArray(workouts)
        ? workouts
            .filter(workout =>
                workout.name.toLowerCase().includes(searchName.toLowerCase()))
            .sort((a, b) => {
                if (!sortKey) {return 0;}
                if (sortDirection === 'asc') {
                    return a[sortKey as keyof AdminWorkoutProfile] > b[sortKey as keyof AdminWorkoutProfile] ? 1 : -1;
                }
                return a[sortKey as keyof AdminWorkoutProfile] < b[sortKey as keyof AdminWorkoutProfile] ? 1 : -1;
            })
        : [];

    const currentWorkouts = filteredWorkouts.slice(currentPage * workoutsPerPage, (currentPage + 1) * workoutsPerPage);
    const pageCount = Math.ceil(filteredWorkouts.length / workoutsPerPage);

    const handleWorkoutClick = useCallback((workout: AdminWorkoutProfile) => {
        navigate(`/admin/workouts/${workout.id}`);
    }, [navigate]);

    return (
        <AdminPanel>
            <div className="workout-management">
                <h2>{i18n.t('workoutList.title')}</h2>

                {/* Search Input */}
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                        placeholder={i18n.t('workoutList.searchPlaceholder')}
                    />
                </div>

                <div className="filters">
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="">{i18n.t('workoutList.allCategories')}</option>
                        <option value="cardio">{i18n.t('workoutList.categoryCardio')}</option>
                        <option value="strength">{i18n.t('workoutList.categoryStrength')}</option>
                    </select>
                    <button onClick={clearFilters}>{i18n.t('workoutList.clearFilters')}</button>
                    <button onClick={goToNew}>{i18n.t('workoutData.createNewWorkout')}</button>
                </div>

                {/* Workouts Table */}
                <table className="workout-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')}>{i18n.t('workoutList.columnID')}</th>
                            <th onClick={() => handleSort('name')}>{i18n.t('workoutList.columnName')}</th>
                            <th>{i18n.t('workoutList.creator')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentWorkouts.map(workout => (
                            <tr key={workout.id} style={{ cursor: 'pointer' }} onClick={() => handleWorkoutClick(workout)}>
                                <td>{workout.id}</td>
                                <td>{workout.name}</td>
                                <td>{workout.creator}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={i18n.t('previous')}
                    nextLabel={i18n.t('next')}
                    breakLabel={'...'}
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

export default inject('adminWorkoutsStore', 'adminWorkoutsController')(WorkoutList);
