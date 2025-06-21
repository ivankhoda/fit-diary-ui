import React, { useEffect, useCallback, useState } from 'react';
import './Workouts.style.scss';

import { inject, observer } from 'mobx-react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import ExercisesStore from '../../../../store/exercisesStore';
import ExercisesController from '../../../../controllers/ExercisesController';

import CoachWorkoutsController from '../../controllers/CoachWorkoutsController';

import CoachWorkout from './Workout/CoachWorkout';
import CoachWorkoutsStore from '../../store/CoachWorkoutsStore';
import UserController from '../../../../controllers/UserController';

interface WorkoutsInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
    coachWorkoutsStore?: CoachWorkoutsStore;
    coachWorkoutsController?: CoachWorkoutsController;
    userController?: UserController;
}

const ITEMS_PER_PAGE = 5;

const Workouts: React.FC<WorkoutsInterface> = ({
    exercisesController,
    coachWorkoutsStore,
    coachWorkoutsController,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (exercisesController) {
            exercisesController.getExercises();
        }
        if (coachWorkoutsController) {
            coachWorkoutsController.getWorkouts();
        }
    }, [exercisesController, coachWorkoutsController]);

    const handleGoToCreateWorkout = useCallback(() => {
        coachWorkoutsController.createWorkout( navigate);
    }, [navigate]);

    const totalPages = Math.ceil((coachWorkoutsStore?.workouts.length || 0) / ITEMS_PER_PAGE);

    const handlePageClick = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handlePreviousClick = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const handleNextClick = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const paginatedWorkouts = coachWorkoutsStore?.workouts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="workouts-section">
            <div className='workouts-header'>
                <h1>{t('workouts.title')}</h1>

                <button onClick={handleGoToCreateWorkout} className="create-workout-btn">
                    {t('workouts.createWorkoutButton')}
                </button>
            </div>
            <div className="workouts-content">
                <div className="workouts-list">
                    {paginatedWorkouts?.map((workout, index) => (
                        <CoachWorkout key={workout.id || `workout-${index}`} workout={workout} />
                    ))}
                </div>
                <div className="pagination-controls">
                    <button
                        disabled={currentPage === 1}
                        onClick={handlePreviousClick}
                    >
                        {t('workouts.pagination.previous')}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={page === currentPage ? 'active' : ''}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={handlePageClick.bind(null, page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={handleNextClick}
                    >
                        {t('workouts.pagination.next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default inject(
    'exercisesStore',
    'exercisesController',
    'coachWorkoutsStore',
    'coachWorkoutsController'
)(observer(Workouts));
