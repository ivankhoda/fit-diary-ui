import React, { useState, useEffect, useCallback } from 'react';
import './Workouts.style.scss';

import { inject, observer } from 'mobx-react';
import ExercisesController from '../../../controllers/ExercisesController';
import WorkoutsController from '../../../controllers/WorkoutsController';
import ExercisesStore from '../../../store/exercisesStore';
import WorkoutsStore from '../../../store/workoutStore';
import Workout from './Workout/Workout';

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
    const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        workoutsController.getUserWorkouts();
    }, [workoutsController]);

    const toggleWorkout = useCallback((workoutId: number) => {
        setExpandedWorkoutIds(prevIds =>
            prevIds.includes(workoutId)
                ? prevIds.filter(id => id !== workoutId)
                : [...prevIds, workoutId]);
    }, []);

    const handleWorkoutClick = useCallback(
        (workoutId: number) => {
            toggleWorkout(workoutId);
        },
        [toggleWorkout]
    );

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
                            <div
                                className="workout-header"
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={() => handleWorkoutClick(workout.id)}
                            >
                                <Workout workout={workout} state={workout.state} />
                            </div>

                            {expandedWorkoutIds.includes(workout.id) && (
                                <div className="workout-details">
                                    <h3>Упражнения:</h3>
                                    {workout.user_exercises.map(exercise => (
                                        <div key={exercise.id} className="exercise-item">
                                            <p>
                                                <strong>Упражнение:</strong> {exercise.name}
                                            </p>
                                            <p>
                                                Повторы: {exercise.repetitions}, Сеты: {exercise.sets},
                                                Вес: {exercise.weight}
                                            </p>

                                            {exercise.number_of_sets.length > 0 && (
                                                <div className="sets-list">
                                                    <h4>Сеты:</h4>
                                                    <ul>
                                                        {exercise.number_of_sets.map(set => (
                                                            <li key={set.id}>
                                                                Сет {set.id}: Повторы: {set.repetitions}, Вес: {set.result}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
            <div className="pagination-controls">
                <button
                    disabled={currentPage === 1}
                    onClick={handlePreviousClick}
                >
                    Previous
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
                    Next
                </button>
            </div>
        </div>
    );
};

export default inject('exercisesStore', 'exercisesController', 'workoutsStore', 'workoutsController')(
    observer(UserWorkouts)
);
