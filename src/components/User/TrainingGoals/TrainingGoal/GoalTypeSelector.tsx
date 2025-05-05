import React, { useCallback } from 'react';
import { CATEGORY_TO_TYPES, GOAL_TYPE_OPTIONS } from './TrainingGoalConstants';

interface Props {
    goalCategory: string;
    goalType: string;
    onChange: (value: string) => void;
}

const GoalTypeSelector: React.FC<Props> = ({ goalCategory, goalType, onChange }) => {
    if (!goalCategory) {return null;}

    const options = GOAL_TYPE_OPTIONS.filter((type: { value: string; label: string }) =>
        CATEGORY_TO_TYPES[goalCategory]?.includes(type.value));

    const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    }, [onChange]);

    return (
        <div className="form-group custom-select">
            <label htmlFor="goal_type">Тип цели</label>
            <select id="goal_type" name="goal_type" value={goalType} onChange={handleChange} required>
                <option value="">Выберите тип цели</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};

export default GoalTypeSelector;
