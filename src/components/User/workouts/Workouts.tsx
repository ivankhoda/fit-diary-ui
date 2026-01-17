/* eslint-disable max-statements */
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import './Workouts.style.scss';

import { inject, observer } from 'mobx-react';
import ExercisesController from '../../../controllers/ExercisesController';
import WorkoutsController from '../../../controllers/WorkoutsController';
import ExercisesStore from '../../../store/exercisesStore';
import WorkoutsStore from '../../../store/workoutStore';
import { useNavigate } from 'react-router-dom';
import Workout from './Workout/Workout';
import UserController from '../../../controllers/UserController';
import { useTranslation } from 'react-i18next';
import Pagination from '../../Common/Pagination/Pagination';

interface WorkoutsInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
    workoutsStore?: WorkoutsStore;
    workoutsController?: WorkoutsController;
    userController?: UserController;
}

const ITEMS_PER_PAGE = 5;

const Workouts: React.FC<WorkoutsInterface> = ({
    exercisesController,
    workoutsStore,
    workoutsController,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'own' | 'assigned'>('own');

    useEffect(() => {
        if (exercisesController) {exercisesController.getExercises();}
        if (workoutsController) {workoutsController.getWorkouts();}
    }, [exercisesController, workoutsController]);

    const handleGoToCreateWorkout = useCallback(() => {
        workoutsController.createWorkout(navigate);
    }, [navigate]);

    const filteredWorkouts = useMemo(() => workoutsStore?.workouts || [], [workoutsStore?.workouts]);

    const totalPages = useMemo(() => {
        const count = activeTab === 'assigned'
            ? filteredWorkouts.filter(w => w.assigned_to_user).length
            : filteredWorkouts.length;

        return Math.ceil(count / ITEMS_PER_PAGE);
    }, [filteredWorkouts, activeTab]);

    const paginatedWorkouts = useMemo(() => {
        const visibleWorkouts = activeTab === 'assigned'
            ? filteredWorkouts.filter(w => w.assigned_to_user)
            : filteredWorkouts;

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return visibleWorkouts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredWorkouts,
        currentPage,
        activeTab]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleTabChange = useCallback((tab: 'own' | 'assigned') => {
        setActiveTab(tab);
        setCurrentPage(1);
    }, []);

    const handleOwnTabClick = useCallback(() => {
        handleTabChange('own');
    }, [handleTabChange]);

    const handleAssignedTabClick = useCallback(() => {
        handleTabChange('assigned');
    }, [handleTabChange]);

    return (
        <div className="workouts-section">
            <div className='workouts-header'>
                <h1>{t('workouts.title')}</h1>
                <button onClick={handleGoToCreateWorkout} className="create-workout-btn">
                    {t('workouts.createWorkoutButton')}
                </button>
            </div>
            <div className="workouts-tabs">
                <button className="create-workout-btn" onClick={handleOwnTabClick}>
                    {t('workouts.all')}
                </button>
                <button className="create-workout-btn" onClick={handleAssignedTabClick}>
                    {t('workouts.assigned')}
                </button>
            </div>

            <div className="workouts-content">
                <div className="workouts-list">
                    {paginatedWorkouts && paginatedWorkouts?.length > 0
                        ? paginatedWorkouts.map((workout, index) => (
                            <Workout key={workout.id || `workout-${index}`} workout={workout} />
                        ))
                        : <p>Пока нет тренировок</p>}
                </div>

                {filteredWorkouts.length > 0 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default inject(
    'exercisesStore',
    'exercisesController',
    'workoutsStore',
    'workoutsController'
)(observer(Workouts));
