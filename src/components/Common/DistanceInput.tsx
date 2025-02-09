/* eslint-disable no-magic-numbers */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';

interface DistanceInputProps {
    onChange: (distance: string, exercise: ExerciseInterface) => void;
    exercise: ExerciseInterface;
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

    useEffect(() => {
        setInputValue(exercise.distance || '');
    }, [exercise.distance]);

    return (
        <div>
            <input
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                maxLength={5}
                placeholder='1000'
                ref={inputRef}
                onBlur={onBlur ? handleBlur : null}
            />
        </div>
    );
};

export default TimeInput;
