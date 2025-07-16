/* eslint-disable no-nested-ternary */
import React, { useCallback } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { format, parse, isValid } from 'date-fns';
import {ru} from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ru', ru);

interface DateFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<{ name: string; value: string }>) => void;
  required?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
    id,
    name,
    label,
    value,
    onChange,
    required = false,
}) => {
    let parsedDate: Date | null = null;

    if (value) {
        const fromBackend = parse(value, 'yyyy-MM-dd', new Date());
        const fromFrontend = parse(value, 'dd.MM.yyyy', new Date());

        parsedDate = isValid(fromBackend)
            ? fromBackend
            : isValid(fromFrontend)
                ? fromFrontend
                : null;
    }

    const handleChange = useCallback(
        (date: Date | null) => {
            const formatted = date ? format(date, 'dd.MM.yyyy') : '';
            const syntheticEvent = {
                target: {
                    name,
                    value: formatted,
                },
            } as React.ChangeEvent<{ name: string; value: string }>;

            onChange(syntheticEvent);
        },
        [onChange, name]
    );
    const isIOS = /iPad|iPhone|iPod/u.test(navigator.userAgent) && !('MSStream' in window);
    return (
        <div className="form-group">
            <label htmlFor={id}>
                {label}
                {required && ' *'}
            </label>
            {isIOS
                ? (
                    <input
                        type="date"
                        id={id}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="form-control"
                        required={required}
                        placeholder='гггг-мм-дд'
                        pattern="\d{4}-\d{2}-\d{2}"
                    />
                )
                : (
                    <DatePicker
                        id={id}
                        selected={parsedDate}
                        onChange={handleChange}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="дд.мм.гггг"
                        className="form-control"
                        locale="ru"
                        required={required}
                        wrapperClassName="full-width-datepicker"
                    />
                )}
        </div>
    );
};

export default DateField;
