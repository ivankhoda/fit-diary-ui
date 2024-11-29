/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable sort-keys */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useCallback, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import ReactPaginate from 'react-paginate';
import AdminPanel from '../AdminPanel';
import { useNavigate } from 'react-router-dom';
import AdminExercisesController from '../controllers/AdminExercisesController';
import AdminExercisesStore, { AdminExerciseProfile } from '../store/AdminExercisesStore';
import i18n from 'i18next';

export interface ExerciseListProps {
    adminExercisesStore?: AdminExercisesStore;
    adminExercisesController?: AdminExercisesController;
}

const ExerciseList: React.FC<ExerciseListProps> = observer(({ adminExercisesStore, adminExercisesController }) => {
    const navigate = useNavigate();
    const { exercises } = adminExercisesStore!;

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchName, setSearchName] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterDifficulty, setFilterDifficulty] = useState<string>('');
    const [filterMuscleGroup, setFilterMuscleGroup] = useState<number | string>('');
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const exercisesPerPage = 10;

    useEffect(() => {
        adminExercisesController.getExercises();
    }, [adminExercisesController]);


    const handleExerciseClick = useCallback((exercise: AdminExerciseProfile) => {
        navigate(`/admin/exercises/${exercise.id}`);
    }, [navigate]);

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

    const clearFilters = useCallback(() => {
        setSearchName('');
        setFilterCategory('');
        setFilterDifficulty('');
        setFilterMuscleGroup('');
        setSortKey('');
        setSortDirection('asc');
        setCurrentPage(0);
    }, []);

    const handleCreateExercise = () => {
        navigate('/admin/exercises/create');
    };

    const filteredExercises = exercises
        .filter(exercise =>
            exercise.name.toLowerCase().includes(searchName.toLowerCase()) &&
            (filterCategory ? exercise.category === filterCategory : true) &&
            (filterDifficulty ? exercise.difficulty === filterDifficulty : true) &&
            (filterMuscleGroup === '' ? true : exercise.muscle_groups.includes(Number(filterMuscleGroup))))
        .sort((a, b) => {
            if (!sortKey) { return 0; }
            if (sortDirection === 'asc') {
                return a[sortKey as keyof AdminExerciseProfile] > b[sortKey as keyof AdminExerciseProfile] ? 1 : -1;
            }
            return a[sortKey as keyof AdminExerciseProfile] < b[sortKey as keyof AdminExerciseProfile] ? 1 : -1;
        });

    const currentExercises = filteredExercises.slice(currentPage * exercisesPerPage, (currentPage + 1) * exercisesPerPage);
    const pageCount = Math.ceil(filteredExercises.length / exercisesPerPage);

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
                        onChange={e => setSearchName(e.target.value)}
                        placeholder={i18n.t('searchByName')}
                    />
                </div>

                <div className="filters">
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="">{i18n.t('allCategories')}</option>
                        <option value="cardio">{i18n.t('cardio')}</option>
                        <option value="strength">{i18n.t('strength')}</option>
                        <option value="flexibility">{i18n.t('flexibility')}</option>
                        <option value="balance">{i18n.t('balance')}</option>
                    </select>

                    <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)}>
                        <option value="">{i18n.t('allDifficulties')}</option>
                        <option value="beginner">{i18n.t('beginner')}</option>
                        <option value="intermediate">{i18n.t('intermediate')}</option>
                        <option value="advanced">{i18n.t('advanced')}</option>
                    </select>

                    <select value={filterMuscleGroup} onChange={e => setFilterMuscleGroup(e.target.value)}>
                        <option value="">{i18n.t('allMuscleGroups')}</option>
                        <option value="0">{i18n.t('muscleGroups.chest')}</option>
                        <option value="1">{i18n.t('muscleGroups.biceps')}</option>
                        <option value="2">{i18n.t('muscleGroups.triceps')}</option>
                        <option value="3">{i18n.t('muscleGroups.back')}</option>
                        <option value="4">{i18n.t('muscleGroups.legs')}</option>
                        <option value="5">{i18n.t('muscleGroups.shoulders')}</option>
                        <option value="6">{i18n.t('muscleGroups.core')}</option>
                        <option value="7">{i18n.t('muscleGroups.cardio')}</option>
                    </select>

                    <button onClick={clearFilters}>{i18n.t('clearFilters')}</button>
                </div>

                <table className="exercise-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')}>{i18n.t('id')}</th>
                            <th onClick={() => handleSort('name')}>{i18n.t('name')}</th>
                            <th onClick={() => handleSort('category')}>{i18n.t('category')}</th>
                            <th onClick={() => handleSort('difficulty')}>{i18n.t('difficulty')}</th>
                            <th onClick={() => handleSort('duration')}>{i18n.t('duration')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentExercises.map(exercise => (
                            <tr key={exercise.id} onClick={() => handleExerciseClick(exercise)} style={{ cursor: 'pointer' }}>
                                <td>{exercise.id}</td>
                                <td>{exercise.name}</td>
                                <td>{i18n.t(`${exercise.category}`)}</td>
                                <td>{i18n.t(`${exercise.difficulty}`)}</td>
                                <td>{exercise.duration}</td>
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
