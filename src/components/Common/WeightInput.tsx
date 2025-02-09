/* eslint-disable no-magic-numbers */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';

interface WeightInputProps {
    onChange: (weight: string, exercise: ExerciseInterface) => void;
    exercise: ExerciseInterface;
    onBlur?: (field: string, value: string | number | null) => void;
}

export const WeightInput: React.FC<WeightInputProps> = ({ onChange, exercise, onBlur }) => {
    const [inputValue, setInputValue] = useState(exercise.weight || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (/^\d*\.?\d*$/u.test(value)) {
            setInputValue(value);
            onChange(value, exercise);
        }
    }, [onChange, exercise]);

    const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (/^\d*\.?\d*$/u.test(value)) {
            setInputValue(value);
            onChange(value, exercise);
        }
        setInputValue(value);
        onBlur('weight',  value);
    }, [onChange,
        exercise,
        onBlur]);

    useEffect(() => {
        setInputValue(exercise.weight ? exercise.weight : '');
    }, [exercise.weight]);


    return (
        <div>
            <input
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                maxLength={6}
                placeholder='20.50'
                ref={inputRef}
                onBlur={onBlur ? handleBlur : null}
            />
        </div>
    );
};

export default WeightInput;
