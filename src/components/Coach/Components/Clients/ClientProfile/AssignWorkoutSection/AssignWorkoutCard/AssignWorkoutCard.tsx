import React, { useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { WorkoutInterface } from '../../../../../../../store/workoutStore';
import './AssignedWorkoutCard.scss';

interface AssignedWorkoutCardProps {
  workout: WorkoutInterface;
  onUnassign: (id: number) => void;
  disabled?: boolean;
}

const AssignedWorkoutCard: React.FC<AssignedWorkoutCardProps> = ({ workout, onUnassign, disabled = false }) => {
    const handleUnassign = useCallback(() => {
        onUnassign(workout.id);
    }, [onUnassign, workout.id]);

    return (
        <div className="assign-workout__card">
            <span className="assign-workout__name">{workout.name}</span>
            <button
                onClick={handleUnassign}
                title="Отвязать тренировку"
                disabled={disabled}
                className="assign-workout__remove-btn"
                type="button"
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default AssignedWorkoutCard;
