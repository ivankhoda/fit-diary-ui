/* eslint-disable no-magic-numbers */
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { workoutsStore } from '../../../../store/global';
import './LastWorkoutsWidget.style.scss';
import { workoutsController } from '../../../../controllers/global';
import { FastAccessWorkout } from '../../workouts/FastAccessWorkout/FastAccessWorkout';

export const LastWorkoutsWidget = observer((): React.JSX.Element | null => {
    const lastWorkouts = workoutsStore.lastUserWorkouts;
    useEffect(() => {
        workoutsController.getLastUserWorkouts(2);
    }, [workoutsController, workoutsStore]);

    if (lastWorkouts.length === 0) {
        return null;
    }

    return (
        <div className='last-workouts-widget'>

            <h3 className='widget-title'>{'Последние 2 тренировки'}</h3>

            {lastWorkouts.map(workout => (
                <div key={workout.id} className='workout-card'>
                    <FastAccessWorkout workout={workout}/>
                </div>
            ))}
        </div>
    );
});
