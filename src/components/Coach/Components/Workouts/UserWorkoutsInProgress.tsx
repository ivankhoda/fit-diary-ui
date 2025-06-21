import React, { useState, useEffect, useCallback } from 'react';
import './Workouts.style.scss';

import { inject, observer } from 'mobx-react';
import Workout from './Workout/CoachWorkout';
import { t } from 'i18next';
import ExercisesController from '../../../../controllers/ExercisesController';
import WorkoutsController from '../../../../controllers/WorkoutsController';
import ExercisesStore from '../../../../store/exercisesStore';
import WorkoutsStore from '../../../../store/workoutStore';

interface WorkoutsInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
    workoutsStore?: WorkoutsStore;
    workoutsController?: WorkoutsController;
}

const ITEMS_PER_PAGE = 5;

const UserWorkouts: React.FC<WorkoutsInterface> = ({
    workoutsStore,
    workoutsController,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        workoutsController.getUserWorkouts();
    }, [workoutsController]);

    const handlePageClick = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handlePreviousClick = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const handleNextClick = useCallback(() => {
        const totalPages = Math.ceil((workoutsStore?.userWorkoutsInProgress.length || 0) / ITEMS_PER_PAGE);
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [workoutsStore]);

    const { userWorkoutsInProgress } = workoutsStore || {};
    const totalPages = Math.ceil((userWorkoutsInProgress?.length || 0) / ITEMS_PER_PAGE);

    const paginatedWorkouts = userWorkoutsInProgress?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="workouts-section">
            <h1>Тренировки в процессе</h1>
            <div>
                {paginatedWorkouts &&
                    paginatedWorkouts.map((workout, index) => (
                        <div key={workout.id || `workout-${index}`} className="workout-item">
                            <div className="workout-header">
                                <Workout workout={workout} state={workout.state} />
                            </div>
                        </div>
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
    );
};

export default inject('exercisesStore', 'exercisesController', 'workoutsStore', 'workoutsController')(
    observer(UserWorkouts)
);
