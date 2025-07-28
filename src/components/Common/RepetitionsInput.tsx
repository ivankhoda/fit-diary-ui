/* eslint-disable no-magic-numbers */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';
import { AdminExerciseProfile } from '../Admin/store/AdminExercisesStore';

interface RepetitionsInputProps {
    onChange: (repetitions: string, exercise: ExerciseInterface | AdminExerciseProfile) => void;
    exercise: ExerciseInterface | AdminExerciseProfile;
    onBlur?: (field: string, value: string | number | null) => void;
}

export const RepetitionsInput: React.FC<RepetitionsInputProps> = ({ onChange, exercise, onBlur }) => {
    const [inputValue, setInputValue] = useState(exercise.repetitions || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const inputs = value.replace(/\D/gu, '');
        setInputValue(inputs);
        onChange(inputs, exercise);
    }, [onChange,
        exercise,
        onBlur]);

    const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const inputs = value.replace(/\D/gu, '');
        setInputValue(inputs);
        onBlur('repetitions',  inputs);
    }, [onChange,
        exercise,
        onBlur]);

    const handleAdd = useCallback((delta: number) => {
        const numeric = parseInt(String(inputValue || '0'), 10);
        const updated = Math.max(0, numeric + delta);
        const updatedStr = updated.toString();

        setInputValue(updatedStr);
        onChange(updatedStr, exercise);
    }, [inputValue,
        onChange,
        exercise]);

    const handleMinus = useCallback(() => handleAdd(-1), [handleAdd]);
    const handlePlus = useCallback(() => handleAdd(1), [handleAdd]);

    useEffect(() => {
        setInputValue(exercise.repetitions?.toString() || '');
    }, [exercise.repetitions]);

    return (
        <div className='repetitions-input'>
            <input
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                maxLength={4}
                placeholder='8'
                min='0'
                ref={inputRef}
                onBlur={onBlur ? handleBlur : null}
            />
            <div className='repetitions-input_controls'>
                <button type="button" onClick={handlePlus}>+</button>
                <button type="button" onClick={handleMinus}>-</button>
            </div>
        </div>
    );
};

export default RepetitionsInput;
