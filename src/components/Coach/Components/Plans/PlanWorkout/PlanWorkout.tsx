/* eslint-disable sort-keys */
import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import './PlanWorkout.style.scss';
import { WorkoutInterface } from '../../../../../store/workoutStore';
import { coachWorkoutsStore } from '../../../store/global';
import { ExerciseInterface } from '../../../../../store/exercisesStore';

interface Props {
  workout?: WorkoutInterface;
}

const PlanWorkout: React.FC<Props> = ({ workout }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!workout) {return null;}

    const handleEditClick = useCallback(() => {
        coachWorkoutsStore.setDraftWorkout(workout);
        navigate(`/workouts/${workout.id}/edit`);
    }, [workout, navigate]);

    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <div className="plan-workout-container">
            <p>
                {workout.name} {workout.created_at?.split(' ')[0] || workout.date}
            </p>

            <div className="plan-workout-actions">
                <button onClick={handleEditClick} className="edit-btn">
                    {t('workout.edit')}
                </button>

                {workout.workout_exercises && workout.workout_exercises.length > 0 && (
                    <button onClick={toggleExpanded} className="toggle-exercises-btn">
                        {isExpanded ? t('workout.hideExercises') : t('workout.showExercises')}
                    </button>
                )}
            </div>

            {isExpanded && workout.workout_exercises && (
                <div className="exercises-container">
                    <h4>{t('workout.exercises')}</h4>
                    {workout.workout_exercises.map((exercise: ExerciseInterface) => (
                        <p key={exercise.id} style={{ margin: '4px 0' }}>
                            {exercise.name}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default observer(PlanWorkout);
