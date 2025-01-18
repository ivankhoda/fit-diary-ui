import React, { useEffect, useCallback, useState } from 'react';
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

    useEffect(() => {
        if (exercisesController) {
            exercisesController.getExercises();
        }
        if (workoutsController) {
            workoutsController.getWorkouts();
        }
        userController.getUser();
    }, [exercisesController, workoutsController]);

    const handleGoToCreateWorkout = useCallback(() => {
        workoutsController.createWorkout(navigate);
    }, [navigate]);

    const totalPages = Math.ceil((workoutsStore?.workouts.length || 0) / ITEMS_PER_PAGE);

    const handlePageClick = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handlePreviousClick = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const handleNextClick = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const paginatedWorkouts = workoutsStore?.workouts.slice(
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
                        <Workout key={workout.id || `workout-${index}`} workout={workout} />
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
    'workoutsStore',
    'workoutsController'
)(observer(Workouts));
