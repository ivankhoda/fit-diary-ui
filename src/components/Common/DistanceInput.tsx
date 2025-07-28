/* eslint-disable no-magic-numbers */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';
import { AdminExerciseProfile } from '../Admin/store/AdminExercisesStore';

interface DistanceInputProps {
    onChange: (distance: string, exercise: ExerciseInterface | AdminExerciseProfile) => void;
    exercise: ExerciseInterface| AdminExerciseProfile;
    onBlur?: (field: string, value: string | number | null) => void;
}

export const TimeInput: React.FC<DistanceInputProps> = ({ onChange, exercise, onBlur}) => {
    const [inputValue, setInputValue] = useState(exercise.distance || '');
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
            onBlur('distance', value);
        }
    }, [onChange, exercise]);

    const handleAdd = useCallback((delta: number) => {
        const numeric = parseFloat(inputValue || '0');
        const updated = Math.max(0, numeric + delta);
        const updatedStr = updated.toString();

        setInputValue(updatedStr);
        onChange(updatedStr, exercise);
    }, [inputValue,
        onChange,
        exercise]);

    const handleMinus = useCallback(() => handleAdd(-50), [handleAdd]);
    const handlePlus = useCallback(() => handleAdd(+50), [handleAdd]);

    useEffect(() => {
        setInputValue(exercise.distance || '');
    }, [exercise.distance]);

    return (
        <div className='distance-input'>

            <input
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                maxLength={5}
                placeholder='1000'
                ref={inputRef}
                onBlur={onBlur ? handleBlur : null}
            />
            <div className='distance-input_controls'>
                <button type="button" onClick={handlePlus}>+</button>
                <button type="button" onClick={handleMinus}>-</button>
            </div>
        </div>
    );
};

export default TimeInput;
