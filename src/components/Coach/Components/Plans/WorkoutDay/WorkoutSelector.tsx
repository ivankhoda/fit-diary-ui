import React, { useState, useCallback, useEffect } from 'react';

interface WorkoutSelectorProps {
    workout_id: number | null;
  availableWorkouts: { id: number; name: string }[];
  onChange: (value: { workout_id: number | null; new_workout: { name: string } | null }) => void;
  required?: boolean;
}

const WorkoutSelector: React.FC<WorkoutSelectorProps> = ({
    workout_id,
    availableWorkouts,
    onChange,
    required = false,
}) => {
    const [workoutId, setWorkoutId] = useState<number | null>(workout_id ?? null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (required) {
            if (workoutId) {
                setError(null);
            }
            else {
                setError('Выберите тренировку');
            }
        }
    }, [workoutId, required]);

    const handleWorkoutChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        setWorkoutId(selectedId);
        onChange({ new_workout: null, workout_id: selectedId });
    }, [onChange]);

    /*
     * Const handleCreateNewClick = useCallback(() => {
     *     setCreatingWorkout(true);
     *     setWorkoutId(null);
     *     onChange({ new_workout: { name: '' }, workout_id: null });
     * }, [onChange]);
     */

    return (
        <div className="form-group workout-selector">
            <label>Тренировка:</label>

            <>
                <select value={workoutId ?? ''} onChange={handleWorkoutChange}>
                    <option value="">Выберите тренировку</option>
                    {availableWorkouts.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                </select>
                {/* <button type="button" onClick={handleCreateNewClick}>+ Создать тренировку на лету</button> */}
            </>

            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default WorkoutSelector;
