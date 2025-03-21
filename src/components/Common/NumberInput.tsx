import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';
import { AdminExerciseProfile } from '../Admin/store/AdminExercisesStore';

interface RepetitionsInputProps {
    onChange: (order: string, exercise: ExerciseInterface | AdminExerciseProfile) => void;
    exercise: ExerciseInterface | AdminExerciseProfile;
    order?: string;
    onBlur?: (field: string, value: string | number | null) => void;
}

export const NumberInput: React.FC<RepetitionsInputProps> = ({ onChange, exercise, onBlur, order }) => {
    const [inputValue, setInputValue] = useState(order);
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
        onBlur('order',  inputs);
    }, [onChange,
        exercise,
        onBlur]);

    useEffect(() => {
        setInputValue(order);
    }, [exercise.order, order]);

    return (
        <div>
            <input
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                maxLength={4}
                placeholder={inputValue}
                min='1'
                ref={inputRef}
                onBlur={onBlur ? handleBlur : null}
            />
        </div>
    );
};

export default NumberInput;
