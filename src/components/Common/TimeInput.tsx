/* eslint-disable no-magic-numbers */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';
import { convertDurationToMMSS } from '../Admin/utils/convertDurationToMMSS';
import { AdminExerciseProfile } from '../Admin/store/AdminExercisesStore';

interface TimeInputProps {
    onChange: (duration: string, exercise: ExerciseInterface | AdminExerciseProfile) => void;
    exercise: ExerciseInterface | AdminExerciseProfile;
    onBlur?: (field: string, value: string | number | null) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({ onChange, exercise, onBlur }) => {
    const [inputValue, setInputValue] = useState(exercise?.duration ? convertDurationToMMSS(exercise.duration): '');
    const inputRef = useRef<HTMLInputElement>(null);

    const calculateTotalSeconds = useCallback((digits: string) => {
        let minutes = 0;
        let seconds = 0;

        if (digits.length === 1 || digits.length === 2) {
            seconds = parseInt(digits, 10);
        } else if (digits.length === 3) {
            minutes = parseInt(digits.slice(0, 1), 10);
            seconds = parseInt(digits.slice(1), 10);
        } else if (digits.length >= 4) {
            minutes = parseInt(digits.slice(0, 2), 10);
            seconds = parseInt(digits.slice(2, 4), 10);
        }

        return minutes * 60 + seconds;
    }, []);

    const formatTimeInput = (digitsOnly: string) => {
        const groups = [];

        if (digitsOnly.length > 0) {
            if (digitsOnly.length % 2 === 1) {
                groups.push(digitsOnly.slice(0, 1));
                for (let i = 1; i < digitsOnly.length; i += 2) {
                    groups.push(digitsOnly.slice(i, i + 2));
                }
            } else {
                for (let i = 0; i < digitsOnly.length; i += 2) {
                    groups.push(digitsOnly.slice(i, i + 2));
                }
            }
        }
        return groups.join(':');
    };

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/\D/gu, '');
        const formattedValue = formatTimeInput(digitsOnly);

        setInputValue(formattedValue);
        onChange(calculateTotalSeconds(digitsOnly).toString(), exercise);
    }, [onChange,
        calculateTotalSeconds,
        exercise]);

    const handleBlur = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/\D/gu, '');
        const formattedValue = formatTimeInput(digitsOnly);

        setInputValue(formattedValue);
        onBlur?.('duration', calculateTotalSeconds(digitsOnly).toString());
    }, [calculateTotalSeconds, onBlur]);

    useEffect(() => {
        setInputValue(exercise.duration ? convertDurationToMMSS(exercise.duration) : '');
    }, []);

    return (
        <div>
            <input
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                maxLength={5}
                placeholder='мм:сс'
                ref={inputRef}
                onBlur={onBlur ? handleBlur : null}
            />
        </div>
    );
};

export default TimeInput;
