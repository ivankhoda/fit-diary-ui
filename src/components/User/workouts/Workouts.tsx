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
import { userController } from '../../../controllers/global';
import { useTranslation } from 'react-i18next';

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
        userController.getUser();
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

    const handlePageClick = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handlePreviousClick = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const handleNextClick = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

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

    // Extracted handler to avoid inline arrow in JSX
    const handlePaginationButtonClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const page = Number(event.currentTarget.dataset.page);

        if (!isNaN(page)) {
            handlePageClick(page);
        }
    }, [handlePageClick]);

    const renderPaginationButtons = () => Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
            key={page}
            className={page === currentPage ? 'active' : ''}
            data-page={page}
            onClick={handlePaginationButtonClick}
        >
            {page}
        </button>
    ));

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
                    {paginatedWorkouts.map((workout, index) => (
                        <Workout key={workout.id || `workout-${index}`} workout={workout} />
                    ))}
                </div>

                {filteredWorkouts.length > 0 && (
                    <div className="pagination-controls">
                        <button disabled={currentPage === 1} onClick={handlePreviousClick}>
                            {t('workouts.pagination.previous')}
                        </button>
                        {renderPaginationButtons()}
                        <button disabled={currentPage === totalPages} onClick={handleNextClick}>
                            {t('workouts.pagination.next')}
                        </button>
                    </div>
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
