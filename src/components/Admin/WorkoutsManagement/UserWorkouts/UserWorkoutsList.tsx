/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
import React, { useState, useCallback, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import ReactPaginate from 'react-paginate';

import { useNavigate, useParams } from 'react-router';
import AdminPanel from '../../AdminPanel';
import AdminWorkoutsController from '../../controllers/AdminWorkoutsController';
import AdminWorkoutsStore, { AdminWorkoutProfile } from '../../store/AdminWorkoutsStore';
import AdminUsersStore from '../../store/AdminUsersStore';
import AdminUsersController from '../../controllers/AdminUsersController';
import { t } from 'i18next';

export interface WorkoutListProps {
    adminWorkoutsStore?: AdminWorkoutsStore;
    adminWorkoutsController?: AdminWorkoutsController;
    adminUsersStore?: AdminUsersStore;
    adminUsersController?: AdminUsersController;
}

const UserWorkoutList: React.FC<WorkoutListProps> = observer(({adminUsersStore, adminUsersController }) => {
    const { userId } = useParams<{ userId: string }>();
    const { userWorkouts } = adminUsersStore;

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchName, setSearchName] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const workoutsPerPage = 10;

    useEffect(() => {
        adminUsersController?.getWorkoutsByUser(userId);
    }, [adminUsersController]);

    const handlePageChange = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

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

    const filteredWorkouts = Array.isArray(userWorkouts)
        ? userWorkouts
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
                <h2>Тренировки пользователя</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                        placeholder="Поиск по имени"
                    />
                </div>

                <div className="filters">
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="">Все категории</option>
                        <option value="cardio">Кардио</option>
                        <option value="strength">Сила</option>
                    </select>
                    <button onClick={clearFilters}>Сбросить фильтры</button>
                </div>
                <table className="workout-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')}>ID</th>
                            <th onClick={() => handleSort('name')}>Название</th>
                            <th>{t('creator')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentWorkouts.map(workout => (
                            <tr key={workout.id} style={{ cursor: 'pointer' }} onClick={()=>handleWorkoutClick(workout)}>
                                <td>{workout.id}</td>
                                <td>{workout.name}</td>
                                <td>{workout.creator}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={'← Назад'}
                    nextLabel={'Вперёд →'}
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

export default inject('adminWorkoutsStore', 'adminWorkoutsController', 'adminUsersStore', 'adminUsersController')(UserWorkoutList);
