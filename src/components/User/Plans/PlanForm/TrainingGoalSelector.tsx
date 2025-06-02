import React, { useCallback } from 'react';
import Select from 'react-select';
import { TrainingGoalInterface } from '../../../../store/trainingGoalsStore';

interface Props {
    visible: boolean;
    trainingGoals: TrainingGoalInterface[];
    value: number | null;
    onChange: (value: number | null) => void;
}

const TrainingGoalSelector: React.FC<Props> = ({ visible, trainingGoals, value, onChange }) => {
    if (!visible) {return null;}

    const options = trainingGoals.map(e => ({ label: e.name, value: e.id }));

    const handleChange = useCallback((opt: { value: number } | null) => {
        onChange(opt?.value ?? null);
    }, [onChange]);

    return (
        <div className="form-group custom-select">
            <label htmlFor="training_goal_id">Цель</label>
            <Select
                inputId="training_goal_id"
                name="training_goal_id"
                value={options.find(opt => opt.value === value) || null}
                onChange={handleChange}
                options={options}
                isClearable
                placeholder="Выберите цель."
            />
        </div>
    );
};

export default TrainingGoalSelector;
