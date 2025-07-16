import React, { useCallback } from 'react';
import Select from 'react-select';

interface Option {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<{ name: string; value: string | number }>) => void;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
    id,
    name,
    label,
    value,
    options,
    onChange,
    required = false,
}) => {
    const selectedOption = options?.find(option => option.value === value) || null;

    const handleChange = useCallback(
        (selected: Option | null) => {
            const syntheticEvent = {
                target: {
                    name,
                    value: selected ? selected.value : '',
                },
            } as React.ChangeEvent<{ name: string; value: string | number }>;

            onChange(syntheticEvent);
        },
        [onChange, name]
    );

    const noOptionsMessage = useCallback(() => 'Нет доступных вариантов', []);

    return (
        <div className="form-group custom-select">
            <label htmlFor={id}>
                {label}
                {required && ' *'}
            </label>
            <Select
                inputId={id}
                name={name}
                value={selectedOption}
                onChange={handleChange}
                options={options}
                isClearable={!required}
                placeholder="Выберите..."
                noOptionsMessage={noOptionsMessage}
            />
        </div>
    );
};

export default SelectField;
