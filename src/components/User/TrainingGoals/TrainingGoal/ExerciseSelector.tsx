import React, { useCallback } from 'react';
import Select from 'react-select';

interface Props {
    visible: boolean;
    exercises: { id: number; name: string }[];
    value: number | null;
    onChange: (value: number | null) => void;
}

const ExerciseSelector: React.FC<Props> = ({ visible, exercises, value, onChange }) => {
    if (!visible) {return null;}

    const options = exercises.map(e => ({ label: e.name, value: e.id }));

    const handleChange = useCallback((opt: { value: number } | null) => {
        onChange(opt?.value ?? null);
    }, [onChange]);

    return (
        <div className="form-group custom-select">
            <label htmlFor="exercise_id">Упражнение</label>
            <Select
                inputId="exercise_id"
                name="exercise_id"
                value={options.find(opt => opt.value === value) || null}
                onChange={handleChange}
                options={options}
                isClearable
                placeholder="Выберите упражнение..."
            />
        </div>
    );
};

export default ExerciseSelector;
