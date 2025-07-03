import { t } from 'i18next';
import React, { useCallback } from 'react';

export type ScheduleType = 'by_date' | 'by_weekday' | 'by_day_number' | 'floating';

interface DayAssignmentSelectorProps {
    scheduleType: ScheduleType;
    date: string;
    weekDay: string;
    dayNumber: number;

    onScheduleTypeChange: (mode: ScheduleType) => void;
    onDateChange: (value: string) => void;
    onWeekDayChange: (value: string) => void;
    onDayNumberChange: (value: number) => void;
}

const DayAssignmentSelector: React.FC<DayAssignmentSelectorProps> = ({
    scheduleType,
    date,
    weekDay,
    dayNumber,
    onScheduleTypeChange,
    onDateChange,
    onWeekDayChange,
    onDayNumberChange,
}) => {
    const handleScheduleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onScheduleTypeChange(e.target.value as ScheduleType);
    }, [onScheduleTypeChange]);

    const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onDateChange(e.target.value);
    }, [onDateChange]);

    const handleWeekDayChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onWeekDayChange(e.target.value);
    }, [onWeekDayChange]);

    const handleDayNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onDayNumberChange(Number(e.target.value));
    }, [onDayNumberChange]);

    return (
        <div className="form-group">
            <label htmlFor="scheduleType">Тип назначения дня:</label>
            <select
                id="scheduleType"
                value={t(`workout_day.${scheduleType}`)}
                onChange={handleScheduleTypeChange}
            >
                <option value="by_day_number">Последовательность дней</option>
                <option value="by_date">Конкретная дата</option>
                <option value="by_weekday">День недели</option>
                <option value="floating">Плавающий</option>

            </select>

            {scheduleType === 'by_date' && (
                <div className="form-group">
                    <label htmlFor="date">Выберите дату:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={handleDateChange}
                    />
                </div>
            )}

            {scheduleType === 'by_weekday' && (
                <div className="form-group">
                    <label htmlFor="weekDay">Выберите день недели:</label>
                    <select
                        id="weekDay"
                        value={weekDay}
                        onChange={handleWeekDayChange}
                    >
                        <option value="">Выберите</option>
                        <option value="monday">Понедельник</option>
                        <option value="tuesday">Вторник</option>
                        <option value="wednesday">Среда</option>
                        <option value="thursday">Четверг</option>
                        <option value="friday">Пятница</option>
                        <option value="saturday">Суббота</option>
                        <option value="sunday">Воскресенье</option>
                    </select>
                </div>
            )}

            {scheduleType === 'by_day_number' && (
                <div className="form-group">
                    <label htmlFor="dayNumber">Номер дня по порядку:</label>
                    <input
                        type="number"
                        id="dayNumber"
                        min={1}
                        value={dayNumber}
                        onChange={handleDayNumberChange}
                    />
                </div>
            )}
        </div>
    );
};

export default DayAssignmentSelector;
