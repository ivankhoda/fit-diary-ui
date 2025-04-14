/* eslint-disable no-magic-numbers */
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect } from 'react';
import { exercisesStore, workoutsStore } from '../../../../store/global';
import './CurrentWorkoutWidget.style.scss';
import i18next, { t } from 'i18next';
import { workoutsController } from '../../../../controllers/global';
import { convertDurationToMMSS } from '../../../Admin/utils/convertDurationToMMSS';
import { useNavigate } from 'react-router';

export const CurrentWorkoutWidget = observer((): React.JSX.Element | null => {
    const navigate  = useNavigate();

    useEffect(() => {
        workoutsController.getActiveUserWorkout();
    }, []);

    const currentWorkout = workoutsStore.currentUserWorkout;

    const {currentExercise} = exercisesStore;

    const handleResumeClick = useCallback(() => {
        if (currentWorkout) {
            navigate(`/workout/${currentWorkout.id}`);
        }
    }, [currentWorkout?.id]);

    const handleFinishClick = useCallback(() => {
        if (currentWorkout) {
            workoutsController.finishWorkout(currentWorkout.id, navigate);
        }
    }, [currentWorkout?.id]);

    if (!currentWorkout) {
        return null;
    }

    const startedAtMs = currentWorkout.started_at * 1000;
    const durationMs = Date.now() - startedAtMs;
    const durationMinutes = Math.floor(durationMs / 60000);

    return (
        <div className='workout-widget'>
            <div className='workout-header'>
                <h3 className='workout-title'>{currentWorkout.name}</h3>
                <div className='workout-progress'>{currentWorkout.completion_rate}%</div>
            </div>

            {currentExercise && (
                <div className='current-exercise'>
                    <div className='exercise-name'>{currentExercise.name}</div>
                    <div className='exercise-stats'>
                        {currentExercise.weight && (<span>{currentExercise.weight}</span>)}
                        {currentExercise.repetitions && (<span>{currentExercise.repetitions}</span>)}
                        {currentExercise.duration && (<span>{convertDurationToMMSS(currentExercise.duration)}</span>)}
                        {currentExercise.distance && (<span>{currentExercise.distance}</span>)}
                    </div>
                </div>
            )}

            <div className='workout-summary'>
                <div className='summary-item'>
                    <span>{currentWorkout.workout_exercises.length}</span>
                    <span>{i18next.t('workout.exercises')}</span>
                </div>
                <div className='summary-item'>
                    <span>{durationMinutes || '--'}</span>
                    <span>{i18next.t('workoutData.duration')}</span>
                </div>
            </div>
            <div className='workout-actions'>
                <button className="save-btn finish" onClick={handleFinishClick}>
                    {t('workout.finish')}
                </button>
                <button className="save-btn" onClick={handleResumeClick}>
                    {t('workout.resume')}
                </button>
            </div>
        </div>
    );
});
