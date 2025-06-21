import React, { useCallback, useState } from 'react';
import Select, { MultiValue } from 'react-select';

interface WorkoutOption {
  value: number;
  label: string;
}

interface AssignWorkoutFormProps {
  availableWorkouts: WorkoutOption[];
  onAssignWorkouts: (workoutIds: number[]) => Promise<void>;
  disabled?: boolean;
}

const AssignWorkoutForm: React.FC<AssignWorkoutFormProps> = ({
    availableWorkouts,
    onAssignWorkouts,
    disabled = false,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<WorkoutOption>>([]);

    const handleChange = useCallback(
        async(selected: MultiValue<WorkoutOption>) => {
            setSelectedOptions(selected);

            if (!selected || selected.length === 0) {return;}

            const selectedIds = selected.map(option => option.value);
            await onAssignWorkouts(selectedIds);

            // Очищаем выбор после назначения, если нужно — иначе можно оставить
            setSelectedOptions([]);
        },
        [onAssignWorkouts]
    );

    const noOptionsMessage = useCallback(() => 'Нет доступных тренировок', []);

    return (
        <div className="assign-workout__form">
            <div className="assign-workout__field">
                <Select
                    isMulti
                    options={availableWorkouts}
                    value={selectedOptions}
                    onChange={handleChange}
                    isDisabled={disabled}
                    placeholder="Выберите тренировку(и)..."
                    classNamePrefix="react-select"
                    closeMenuOnSelect={false}
                    noOptionsMessage={noOptionsMessage}
                />
            </div>
        </div>
    );
};

export default AssignWorkoutForm;
