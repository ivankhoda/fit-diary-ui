/* eslint-disable no-magic-numbers */
import { observer } from 'mobx-react-lite';
import React, { useCallback} from 'react';
import { WorkoutInterface } from '../../../../../store/workoutStore';
import { useNavigate } from 'react-router';
import { workoutsController } from '../../../../../controllers/global';

interface Props {
    workout?: WorkoutInterface;
    plan_id?: number;

}

export const FastAccessWorkout: React.FC<Props> = observer(({ workout, plan_id }) => {
    const navigate = useNavigate();

    const handleStartClick = useCallback(() => {
        workoutsController.startWorkout(workout.id, plan_id);
        navigate(`/workout/${workout.id}`);
    }, [workout, plan_id]);

    return (
        <>

            <div className='workout-header'>
                <h4 className='workout-title'>{workout.name}</h4>
                <div className='workout-meta'>
                    <span>{workout.created_at}</span>
                </div>
            </div>
            <button className="save-btn" onClick={handleStartClick}>
                {plan_id ? 'Начать' :'Повторить'}
            </button>

        </>
    );
});
