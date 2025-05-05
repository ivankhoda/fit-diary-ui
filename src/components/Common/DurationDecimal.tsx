/* eslint-disable max-statements */
/* eslint-disable no-magic-numbers */
import React, { useCallback, useState } from 'react';

// Формируем строку времени в формате чч:мм:сс,cc или с учётом 3 цифр: ss,s
const formatTimeInput = (raw: string) => {
    // Оставляем только цифры
    const digits = raw.replace(/\D/gu, '');
    const len = digits.length;

    if (len === 0) {return '';}

    // Если 1-2 цифры — это секунды целиком
    if (len <= 2) {
        return digits;
    }

    // Для 3 цифр дробная часть = 1 цифра, иначе = 2
    const fracLen = len === 3 ? 1 : 2;
    const remPart = digits.slice(0, -fracLen);
    const frac = digits.slice(-fracLen);

    // Группируем целую часть справа налево по 2 цифры
    const groups: string[] = [];
    let rem = remPart;
    while (rem.length > 2) {
        groups.unshift(rem.slice(-2));
        rem = rem.slice(0, -2);
    }
    if (rem.length > 0) {groups.unshift(rem);}

    const timePart = groups.join(':');
    return `${timePart},${frac}`;
};

const convertToSeconds = (input: string) => {
    const parts = input.split(':');
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    if (parts.length === 1) {
        const [secStr, fracStr = ''] = parts[0].split(',');
        seconds = parseInt(secStr, 10);
        if (fracStr) {
            // Если одна цифра — десятые
            milliseconds = fracStr.length === 1
                ? parseInt(fracStr, 10) * 10
                : parseInt(fracStr.slice(0, 2), 10);
        }
    } else if (parts.length === 2) {
        const [minStr, rest] = parts;
        minutes = parseInt(minStr, 10);
        const [secStr, fracStr = ''] = rest.split(',');
        seconds = parseInt(secStr, 10);
        if (fracStr) {
            milliseconds = fracStr.length === 1
                ? parseInt(fracStr, 10) * 10
                : parseInt(fracStr.slice(0, 2), 10);
        }
    } else if (parts.length === 3) {
        const [hrStr,
            minStr,
            rest] = parts;
        hours = parseInt(hrStr, 10);
        minutes = parseInt(minStr, 10);
        const [secStr, fracStr = ''] = rest.split(',');
        seconds = parseInt(secStr, 10);
        if (fracStr) {
            milliseconds = fracStr.length === 1
                ? parseInt(fracStr, 10) * 10
                : parseInt(fracStr.slice(0, 2), 10);
        }
    }

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 100;
};

const DurationDecimalInput: React.FC<{ value: number; onChange: (val: number) => void; label?: string }> = ({ value, onChange, label }) => {
    // Инициализируем инпут форматированным временем
    const [inputValue, setInputValue] = useState(formatTimeInput(value.toString()));

    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            // Оставляем только цифры, обрезаем до 7
            const digitsOnly = e.target.value.replace(/\D/gu, '').slice(0, 7);
            const formattedValue = formatTimeInput(digitsOnly);
            setInputValue(formattedValue);
            const seconds = convertToSeconds(formattedValue);
            onChange(seconds);
        },
        [onChange]
    );

    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <input
                type="text"
                value={inputValue}
                onChange={handleInput}
                placeholder="Введите время (чч:мм:сс,cc)"
                maxLength={12}
            />
        </div>
    );
};

export default DurationDecimalInput;
