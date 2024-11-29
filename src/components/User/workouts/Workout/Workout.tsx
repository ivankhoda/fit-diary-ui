/* eslint-disable react/jsx-no-bind */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { workoutsController } from '../../../../controllers/global';
import { WorkoutInterface, } from '../../../../store/workoutStore';
import { workoutsStore, userStore } from '../../../../store/global';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ExerciseInterface } from '../../../../store/exercisesStore';

interface Props {
    workout?: WorkoutInterface;
    state?: string;
}

const Workout: React.FC<Props> = ({ workout, state = '' }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!workout) {return null;}

    const navigate = useNavigate();

    const handleStartClick = useCallback(() => {
        workoutsController.startWorkout(workout.id);
        navigate(`/me/workout/${workout.id}`);
    }, [workout.id]);

    const handleEditClick = useCallback((wo: WorkoutInterface) => {
        workoutsStore.setDraftWorkout(wo);
        navigate(`/me/workouts/${wo.id}/edit`);
    }, [workout.id]);

    const handleClick = (wo: WorkoutInterface) => () => {
        handleEditClick(wo);
    };

    const handleArchiveClick = useCallback(() => {
        workoutsController.archiveWorkout(workout.id);
    }, [workout.id]);

    const handleResumeClick = useCallback(() => {
        workoutsController.resumeWorkout(workout);
    }, [workout.id]);

    const handleFinishClick = useCallback(() => {
        workoutsController.finishWorkout(workout.id);
    }, [workout.id]);

    const toggleExpanded = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className="workout-container">
            <div>
                <p>{t('workout.name')}: {workout.name}</p>
                <p>{t('workout.createdAt')}: {workout.created_at?.split(' ')[0]}</p>
                {!state && (
                    <>
                        <button className="save-btn" onClick={handleStartClick}>
                            {t('workout.start')}
                        </button>
                        {workout.creator_id === userStore.userProfile?.id && (
                            <>
                                <button className="save-btn" onClick={handleClick(workout)}>
                                    {t('workout.edit')}
                                </button>
                                <button className="delete-btn" onClick={handleArchiveClick}>
                                    {t('workout.archive')}
                                </button>
                            </>
                        )}
                    </>
                )}
                {state === 'in_progress' && (
                    <>
                        <button className="save-btn" onClick={handleFinishClick}>
                            {t('workout.finish')}
                        </button>
                        <button className="delete-btn" onClick={handleResumeClick}>
                            {t('workout.resume')}
                        </button>
                    </>
                )}
                <button className="toggle-btn" onClick={toggleExpanded}>
                    {isExpanded ? t('workout.hideExercises') : t('workout.showExercises')}
                </button>
            </div>
            {isExpanded && workout.exercises && (
                <div className="exercises-container">
                    <h4>{t('workout.exercises')}</h4>
                    {workout.exercises.map((exercise: ExerciseInterface, index: number) => (
                        <div key={exercise.id || index} className="exercise-item">
                            <p>
                                <strong>{t('exercise.name')}:</strong> {exercise.name}
                            </p>
                            <p>
                                <strong>{t('exercise.reps')}:</strong> {exercise.repetitions}
                            </p>
                            <p>
                                <strong>{t('exercise.sets')}:</strong> {exercise.sets}
                            </p>
                            <p>
                                <strong>{t('exercise.weight')}:</strong> {exercise.weight} {t('exercise.kg')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default inject(
    'exercisesStore',
    'exercisesController',
    'workoutsStore',
    'workoutsController'
)(observer(Workout));
