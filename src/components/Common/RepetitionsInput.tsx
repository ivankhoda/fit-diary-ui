/* eslint-disable no-magic-numbers */
import React, { useCallback, useState, useRef } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';

interface RepetitionsInputProps {
    onChange: (repetitions: string, exercise: ExerciseInterface) => void;
    exercise: ExerciseInterface;
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

    return (
        <div>
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
        </div>
    );
};

export default RepetitionsInput;
