import React, { useCallback } from 'react';
import Select from 'react-select';
import { TrainingGoalInterface } from '../../../store/CoachTrainingGoalsStore';

interface Props {
    goals: TrainingGoalInterface[];
    value: number | null;
    onChange: (value: number | null) => void;
}

const ParentGoalSelect: React.FC<Props> = ({ goals, value, onChange }) => {
    const options = goals.map(g => ({ label: g.name, value: g.id }));

    const handleChange = useCallback((opt: { value: number } | null) => {
        onChange(opt?.value ?? null);
    }, [onChange]);

    return (
        <div className="form-group custom-select">
            <label htmlFor="parent_goal_id">Родительская цель</label>
            <Select
                inputId="parent_goal_id"
                name="parent_goal_id"
                value={options.find(opt => opt.value === value) || null}
                onChange={handleChange}
                options={options}
                isClearable
                placeholder="Выберите цель..."
            />
        </div>
    );
};

export default ParentGoalSelect;
