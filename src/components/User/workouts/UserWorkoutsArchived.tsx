import React, { useState, useEffect, useCallback } from 'react';
import './Workouts.style.scss';

import { inject, observer } from 'mobx-react';
import ExercisesController from '../../../controllers/ExercisesController';
import WorkoutsController from '../../../controllers/WorkoutsController';
import ExercisesStore from '../../../store/exercisesStore';
import WorkoutsStore from '../../../store/workoutStore';
import Workout from './Workout/Workout';
import { UserExerciseSets } from './CurrentWorkout/UserExerciseSets/UserExerciseSets';
import { t } from 'i18next';

interface WorkoutsInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
    workoutsStore?: WorkoutsStore;
    workoutsController?: WorkoutsController;
}

const ITEMS_PER_PAGE = 5;

const UserWorkoutsArchived: React.FC<WorkoutsInterface> = ({
    workoutsStore,
    workoutsController,
}) => {
    const [expandedWorkoutIds, setExpandedWorkoutIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        workoutsController.getArchivedUserWorkouts();
    }, [workoutsController, workoutsStore]);

    const toggleWorkout = (workoutId: number) => {
        setExpandedWorkoutIds(prevIds =>
            prevIds.includes(workoutId)
                ? prevIds.filter(id => id !== workoutId)
                : [...prevIds, workoutId]);
    };

    const handleWorkoutClick = useCallback(
        (workoutId: number) => () => toggleWorkout(workoutId),
        []
    );

    const { archivedWorkouts } = workoutsStore;

    const totalWorkouts = archivedWorkouts ? archivedWorkouts.length : 0;
    const totalPages = Math.ceil(totalWorkouts / ITEMS_PER_PAGE);

    const workoutsToDisplay = archivedWorkouts?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleNextPage = useCallback(() => {
        setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
    }, [totalPages]);

    const handlePreviousPage = useCallback(() => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    }, []);

    return (
        <div className="workouts-section">
            <h1>Архивные тренировки</h1>
            <div className='workouts-list'>
                {workoutsToDisplay &&
                    workoutsToDisplay.map((workout, index) => (
                        <div key={workout.id || `workout-${index}`} className="workout-item">
                            <div
                                className="workout-header"
                                onClick={handleWorkoutClick(workout.id)}
                            >
                                <Workout workout={workout} state={workout.state} />
                            </div>

                            {expandedWorkoutIds.includes(workout.id) && workout.user_exercises && workout.user_exercises.length > 0 && (
                                <div className="workout-details">
                                    <h3>Упражнения:</h3>
                                    {workout.user_exercises.map(exercise => (
                                        <div key={exercise.id} className="exercise-item">
                                            <p>
                                                {exercise.name}
                                            </p>

                                            {exercise.formatted_duration && <p>
                                                {t('workoutData.exercise_duration')}: {exercise.formatted_duration}
                                            </p>}

                                            {exercise.number_of_sets.length > 0 && (
                                                <div className="sets-list">
                                                    <UserExerciseSets
                                                        exerciseId={exercise.id}
                                                        measurementType={exercise.type_of_measurement}
                                                        sets={exercise.number_of_sets}/>
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
                    className="pagination-button"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    {t('workouts.pagination.previous')}
                </button>
                <span className="page-info">
                    {currentPage} / {totalPages}
                </span>
                <button
                    className="pagination-button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    {t('workouts.pagination.next')}
                </button>
            </div>
        </div>
    );
};

export default inject('exercisesStore', 'exercisesController', 'workoutsStore', 'workoutsController')(
    observer(UserWorkoutsArchived)
);
