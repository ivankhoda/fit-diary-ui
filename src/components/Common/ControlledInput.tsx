
import React, { useCallback } from 'react';
import { convertDurationToMMSS } from '../Admin/utils/convertDurationToMMSS';
import { parseDurationInput } from '../Admin/utils/paraseDurationInput';


export const NumericInput: React.FC<{
  label: string;
  id: string;
  value: number | string;
  min?: number;
  step?: number;
  onChange: (value: string) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label,id, value, min, step, onChange, onBlur }) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, []);

    const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (onBlur) {
            onBlur(e);
        }
    }, []);

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type="number"
                value={value}
                min={min}
                step={step}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </div>
    );
};

export const TextInput: React.FC<{
  label: string;
  value: string;
  id: string
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
}> = ({ label, value,id, onChange, onBlur }) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, []);

    const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (onBlur) {
            onBlur(e.target.value);
        }
    }, []);

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                type="text"
                id={id}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </div>
    );
};

export const DurationInput: React.FC<{
  label: string;
  value: number | null;
  id: string
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
}> = ({ label, value, id, onChange, onBlur }) => {
    const formattedValue = value ? convertDurationToMMSS(value) : '00:00';

    const handleBlur = useCallback((inputValue: string) => {
        if (onBlur) {
            onBlur(parseDurationInput(inputValue).toString());
        }
    }, []);

    const handleChange = useCallback((v: string) => {
        onChange(v);
    }, []);

    return (
        <TextInput
            label={label}
            id={id}
            value={formattedValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};
