/* eslint-disable sort-keys */
/* eslint-disable max-statements */
/* eslint-disable complexity */
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
import { triggerImpact } from '../../../../utils/haptics';
import { ShareType, shareUniversal } from '../../../Common/share';

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
        navigate(`/workout/${workout.id}`);
    }, [workout.id]);

    const handleEditClick = useCallback((wo: WorkoutInterface) => {
        workoutsStore.setDraftWorkout(wo);
        navigate(`/workouts/${wo.id}/edit`);
    }, [workout.id]);

    const handleClick = (wo: WorkoutInterface) => () => {
        handleEditClick(wo);
    };

    const handleArchiveClick = useCallback(() => {
        workoutsController.archiveWorkout(workout.id);
    }, [workout.id]);

    const handleUnarchiveClick = useCallback(() => {
        workoutsController.unarchiveWorkout(workout.id);
    }, [workout.id]);

    const handleResumeClick = useCallback(() => {
        triggerImpact();
        window.location.pathname = `/workout/${workout.id}`;
    }, [workout.id]);

    const handleFinishClick = useCallback(() => {
        triggerImpact();
        workoutsController.finishWorkout(workout.id);
    }, [workout.id]);

    const toggleExpanded = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsExpanded(prev => !prev);
    };

    const handleCopyWorkout = useCallback(() => {
        workoutsController.copyWorkout(workout.id, navigate);
    }, [workout.id]);

    // eslint-disable-next-line consistent-return

    const defineState = (): ShareType => {
        if (state === 'completed') {return 'result';}
        if (!state) {return 'workout';}
        throw new Error(`Неизвестный state: ${state}`);
    };

    const handleShare = useCallback(() => {
        const type = defineState();

        const data =
    type === 'result'
        ? {
            id: workout.id,
            name: workout.name,
            duration: workout.duration,
            comment: workout.comment,
            user_exercises: workout.user_exercises,
        }
        : {
            id: workout.id,
            name: workout.name,
            description: workout.description,
            workout_exercises: workout.workout_exercises,
        };

        shareUniversal({
            type,
            data,
        });
    }, [workout]);

    return (
        <div className={`workout-container ${workout.assigned_to_user ? 'assigned-workout' : ''}`}>

            <p>{workout.name}  {workout.created_at?.split(' ')[0] || workout.date}</p>
            {state === 'completed' && <p>{t('workout.duration')}: {workout.duration}</p>}
            {state === 'completed' && workout.comment && <p>{t('workout.comment')}: {workout.comment}</p>}
            {state === 'completed' && <button className="save-btn" onClick={handleShare}>
                {t('workout.share')}
            </button>}
            {!state && !workout.deleted && (
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
                            <button className="save-btn" onClick={handleCopyWorkout}>
                                {t('workout.copy')}
                            </button>

                            <button className="save-btn" onClick={handleShare}>
                                {t('workout.share')}
                            </button>
                        </>
                    )}
                    {workout.exercises && workout.exercises.length> 0 && <button className="save-btn" onClick={toggleExpanded}>
                        {isExpanded ? t('workout.hideExercises') : t('workout.showExercises')}
                    </button>}
                </div>
            )}

            {workout.deleted && (
                <div className='workout-actions'>
                    {workout.creator_id === userStore.userProfile?.id && (
                        <button className="save-btn" onClick={handleUnarchiveClick}>
                            {t('workout.unarchive')}
                        </button>
                    )}
                    {workout.exercises && workout.exercises.length> 0 && <button className="save-btn" onClick={toggleExpanded}>
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
                        <p key={exercise.id}>{exercise.name}</p>
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
