import React, { useCallback } from 'react';
import Select from 'react-select';

interface PlanStatus {
  value: string;
  label: string;
}

interface Props {
  visible: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
}

const PlanStatusSelector: React.FC<Props> = ({ visible, value, onChange }) => {
    const statusOptions: PlanStatus[] = [
        { label: 'Черновик', value: 'draft' },
        { label: 'Активный', value: 'active' },
        { label: 'Завершенный', value: 'completed' },
        { label: 'Приостановленный', value: 'paused' }
    ];

    const handleChange = useCallback((opt: PlanStatus | null) => {
        onChange(opt?.value ?? null);
    }, [onChange]);

    if (!visible) {return null;}

    return (
        <div className="form-group plan-status-selector">
            <label htmlFor="plan_status">Статус плана</label>
            <Select
                inputId="plan_status"
                name="status"
                value={statusOptions.find(opt => opt.value === value) || null}
                onChange={handleChange}
                options={statusOptions}
                isClearable={false}
                placeholder="Выберите статус..."
                classNamePrefix="select"
            />
        </div>
    );
};

export default PlanStatusSelector;
