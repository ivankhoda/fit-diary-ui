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
        window.location.pathname = `/me/workout/${workout.id}`;
    }, [workout.id]);

    const handleFinishClick = useCallback(() => {
        workoutsController.finishWorkout(workout.id);
    }, [workout.id]);

    const toggleExpanded = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className="workout-container">

            <p>{workout.name}  {workout.created_at?.split(' ')[0] || workout.date}</p>
            {state === 'completed' && <p>{t('workout.duration')}: {workout.duration}</p>}
            {!state && (
                <div className='workout-actions'>
                    <button className="save-btn" onClick={handleStartClick}>
                        {t('workout.start')}
                    </button>
                    {workout.creator_id === userStore.userProfile?.id && (
                        <>
                            <button className="save-btn" onClick={handleClick(workout)}>
                                {t('workout.edit')}
                            </button>
                            <button className="save-btn" onClick={handleArchiveClick}>
                                {t('workout.archive')}
                            </button>
                        </>
                    )}
                    {workout.exercises && workout.exercises.length> 0 && <button className="toggle-btn" onClick={toggleExpanded}>
                        {isExpanded ? t('workout.hideExercises') : t('workout.showExercises')}
                    </button>}
                </div>
            )}
            {state === 'in_progress' && (
                <div className='workout-actions'>
                    <button className="save-btn" onClick={handleFinishClick}>
                        {t('workout.finish')}
                    </button>
                    <button className="save-btn" onClick={handleResumeClick}>
                        {t('workout.resume')}
                    </button>
                </div>
            )}


            {isExpanded && workout.exercises && (
                <div className="exercises-container">
                    <h4>{t('workout.exercises')}</h4>
                    {workout.exercises.map((exercise: ExerciseInterface) => (
                        <>
                            <p>{exercise.name}</p>
                        </>
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
