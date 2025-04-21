/* eslint-disable no-magic-numbers */
import { observer } from 'mobx-react-lite';
import React, { useCallback} from 'react';
import { workoutsController } from '../../../../controllers/global';
import { useNavigate } from 'react-router';
import { WorkoutInterface } from '../../../../store/workoutStore';

interface Props {
    workout?: WorkoutInterface;

}

export const FastAccessWorkout: React.FC<Props> = observer(({ workout }) => {
    const navigate = useNavigate();

    const handleStartClick = useCallback(() => {
        workoutsController.startWorkout(workout.id);
        navigate(`/workout/${workout.id}`);
    }, [workout]);

    return (
        <>

            <div className='workout-header'>
                <h4 className='workout-title'>{workout.name}</h4>
                <div className='workout-meta'>
                    <span>{workout.created_at}</span>
                </div>
            </div>
            <button className="save-btn" onClick={handleStartClick}>
                {'Повторить'}
            </button>

        </>
    );
});
