/* eslint-disable no-magic-numbers */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';
import { AdminExerciseProfile } from '../Admin/store/AdminExercisesStore';

interface WeightInputProps {
    onChange: (weight: string, exercise: ExerciseInterface | AdminExerciseProfile) => void;
    exercise: ExerciseInterface | AdminExerciseProfile;
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
        onBlur('weight', value);
    }, [onChange,
        exercise,
        onBlur]);

    const handleAdd = useCallback((delta: number) => {
        const numeric = parseFloat(String(inputValue || '0'));
        const updated = Math.max(0, numeric + delta);
        const updatedStr = updated.toFixed(2);

        setInputValue(updatedStr);
        onChange(updatedStr, exercise);
    }, [inputValue,
        onChange,
        exercise]);

    const handleMinus = useCallback(() => handleAdd(-1), [handleAdd]);
    const handlePlus = useCallback(() => handleAdd(1), [handleAdd]);

    useEffect(() => {
        setInputValue(exercise.weight ? exercise.weight : '');
    }, [exercise.weight]);

    return (
        <div className='weight-input'>
            <input
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                maxLength={6}
                placeholder='20.50'
                ref={inputRef}
                onBlur={onBlur ? handleBlur : null}
            />
            <div className='weight-input_controls'>
                <button type="button" onClick={handlePlus}>+</button>
                <button type="button" onClick={handleMinus}>-</button>
            </div>
        </div>
    );
};

export default WeightInput;
