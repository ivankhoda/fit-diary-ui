import React, { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { coachWorkoutsStore } from '../../../../store/global';
import { coachWorkoutsController } from '../../../../controllers/global';

import './AssignWorkoutSection.scss';
import AssignedWorkoutCard from './AssignWorkoutCard/AssignWorkoutCard';
import AssignWorkoutForm from './AssignForm/AssignForm';

interface Props {
  clientId: number;
}

const AssignWorkoutSection = ({ clientId }: Props) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        coachWorkoutsController.getWorkoutsForClient(clientId);
    }, [clientId]);

    // eslint-disable-next-line require-await
    const handleAssignWorkout = useCallback(async(selectedWorkoutIds: number[]) => {
        if (!selectedWorkoutIds || selectedWorkoutIds.length === 0) {return;}

        setLoading(true);

        for (const workoutId of selectedWorkoutIds) {
            coachWorkoutsController.addWorkoutForClient(clientId, workoutId);
        }

        setLoading(false);
    }, [clientId]);

    const handleUnassignWorkout = useCallback(async(workoutId: number) => {
        setLoading(true);
        await coachWorkoutsController.removeWorkoutForClient(clientId, workoutId);

        setLoading(false);
    }, [clientId]);

    const assignedWorkouts = coachWorkoutsStore.workoutsForClient || [];
    const assignedWorkoutIds = new Set(assignedWorkouts.map(w => w.id));
    const availableWorkouts = coachWorkoutsStore.workouts
        .filter(w => !assignedWorkoutIds.has(w.id))
        .map(w => ({
            id: w.id,
            name: w.name,
        }));

    return (
        <>
            <h2 className="assign-workout__title">Назначенные тренировки</h2>

            <div className="assign-workout__container">
                {assignedWorkouts.length === 0
                    ? (
                        <p className="assign-workout__empty">Нет назначенных тренировок</p>
                    )
                    : (
                        assignedWorkouts.map(workout => (
                            <AssignedWorkoutCard
                                key={workout.id}
                                workout={workout}
                                onUnassign={handleUnassignWorkout}
                                disabled={loading}
                            />
                        ))
                    )}
            </div>

            <AssignWorkoutForm
                // eslint-disable-next-line sort-keys
                availableWorkouts={availableWorkouts.map(w => ({ value: w.id, label: w.name }))}
                onAssignWorkouts={handleAssignWorkout}
                disabled={loading}
            />
        </>
    );
};

export default observer(AssignWorkoutSection);
