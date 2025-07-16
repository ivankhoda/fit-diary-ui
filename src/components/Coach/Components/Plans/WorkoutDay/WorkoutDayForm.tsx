/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import './WorkoutDayForm.style.scss';
import DayAssignmentSelector, { ScheduleType } from './DayAssignmentSelector';
import { t } from 'i18next';
import { formatDate } from '../../../../Common/date/formatDate';
import { translateWeekDays } from '../../../../Common/translateWeekDays';
import { WorkoutDayInterface } from '../../../store/CoachPlansStore';
import WorkoutSelector from './WorkoutSelector';

interface WorkoutDayFormProps {
    day?: WorkoutDayInterface;
    onCancel: () => void;
    onDelete?: (dayId: number) => void;
    onEdit?: () => void;
    onUpdate?: (dayData: any) => void;
    onCreate?: (dayData: any) => void;
    availableWorkouts: { id: number; name: string }[];
    isEditing?: boolean;
    num?: number
}

const WorkoutDayForm: React.FC<WorkoutDayFormProps> = ({
    day,
    onCancel,
    onDelete,
    onEdit,
    onUpdate,
    onCreate,
    availableWorkouts,
    isEditing, num
}) => {
    const [modeView, setModeView] = useState<'view' | 'edit'>(day ? 'view' : 'edit');
    const [isExpanded, setIsExpanded] = useState(false);

    const validScheduleTypes: ScheduleType[] = ['by_date',
        'by_weekday',
        'by_day_number',
        'floating'];

    const initialScheduleType: ScheduleType = day && validScheduleTypes.includes(day.schedule_type as ScheduleType)
        ? (day.schedule_type as ScheduleType)
        : 'by_day_number';

    const [scheduleType, setScheduleType] = useState<ScheduleType>(initialScheduleType);
    const [date, setDate] = useState(day?.date || '');
    const [weekDay, setWeekDay] = useState(day?.week_day || '');
    const [dayNumber, setDayNumber] = useState<number>(day?.day_number || 1);
    const [workoutId, setWorkoutId] = useState<number | null>(day?.workout_id || null);
    const [creatingWorkout, setCreatingWorkout] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState('');
    const [name, setName] = useState(day?.name || '');
    const [notes, setNotes] = useState(day?.notes || '');
    const [position, setPosition] = useState(day?.position || '');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [scheduledDate, setScheduledDate] = useState(day?.scheduled_date || '');

    useEffect(() => {
        setModeView(isEditing ? 'edit' : 'view');
        setWorkoutId(extractWorkoutId(day));
    }, [isEditing]);

    const toggleExpand = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const handleEditClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setModeView('edit');
        onEdit?.();
    }, [onEdit]);

    const handleCancelEdit = useCallback(() => {
        if (day) {
            setModeView('view');
            setCreatingWorkout(false);
        } else {
            onCancel();
        }
    }, [day,
        onCancel,
        workoutId]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (day?.id && onDelete) {
            onDelete(day.id);
        }
    }, [day, onDelete]);

    const handleSubmit = useCallback(() => {
        const payload: WorkoutDayInterface = {
            date: scheduleType === 'by_date' ? date : null,
            day_number: scheduleType === 'by_day_number' ? dayNumber : null,
            id: day?.id,
            name,
            new_workout: creatingWorkout ? { name: newWorkoutName } : null,
            notes,
            plan_id: day?.plan_id || 0,
            position,
            schedule_type: scheduleType,
            scheduled_date: scheduledDate,
            week_day: scheduleType === 'by_weekday' ? weekDay : null,
            workout_id: workoutId,
        };

        if (day?.id) {
            onUpdate?.(payload);
        } else {
            onCreate?.(payload);
        }

        setModeView('view');
        setCreatingWorkout(false);
        setIsExpanded(false);
    }, [
        day,
        scheduleType,
        date,
        weekDay,
        dayNumber,
        workoutId,
        creatingWorkout,
        newWorkoutName,
        name,
        notes,
        position,
        scheduledDate,
        onUpdate,
        onCreate,
    ]);

    const handleChange = useCallback(
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setter(e.target.value),
        []
    );

    const extractWorkoutId = (d: WorkoutDayInterface | undefined): number | null => d?.workouts?.[0]?.id ?? null;

    const handleWorkoutChange = useCallback(
        ({ workout_id, new_workout }: { workout_id: number | null; new_workout: { name: string } | null }) => {
            setWorkoutId(workout_id);
            if (new_workout) {
                setCreatingWorkout(true);
                setNewWorkoutName(new_workout.name);
            } else {
                setCreatingWorkout(false);
                setNewWorkoutName('');
            }
        },
        []
    );

    const defineName = (): string => {
        switch (scheduleType) {
        case 'by_date':
            return formatDate(date);
            break;
        case 'by_weekday':
            return translateWeekDays(weekDay);
            break;
        case 'by_day_number':
            return `День ${dayNumber}`;
            break;
        case 'floating':
            return `День ${dayNumber}`;
            break;
        default:
            return `День ${dayNumber}`;
            break;
        }
    };

    if (modeView === 'view') {
        return (
            <div className={`workout-day-view ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
                <div className="day-summary">
                    <span className="day-number">#{num}</span>
                    <div className='day-summary_info'>

                        <span className="day-name">{defineName()}</span>
                        <span className="workout-name">{day?.workouts?.map(x => x.name).join(', ') || 'Без тренировки'}</span>
                    </div>
                </div>

                {isExpanded && (
                    <div className="day-details">
                        <p><b>Тип назначения:</b> {t(`workout_day.${scheduleType}`)}</p>
                        {scheduleType === 'by_date' && <p><b>Дата:</b> {formatDate(date)}</p>}
                        {scheduleType === 'by_weekday' && <p><b>День недели:</b> {translateWeekDays(weekDay)}</p>}
                        {scheduleType === 'by_day_number' && <p><b>Номер дня:</b> {dayNumber}</p>}
                        <p><b>Название дня:</b> {name}</p>
                        {notes && <p><b>Заметки:</b> {notes}</p>}
                        {position && <p><b>Позиция:</b> {position}</p>}

                        <div className="day-actions">
                            <button type="button" onClick={handleEditClick}>Редактировать</button>
                            <button type="button" onClick={handleDelete}>Удалить</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="workout-day-form">
            <h4>{day?.id ? 'Редактирование тренировочного дня' : 'Добавление тренировочного дня'}</h4>

            <DayAssignmentSelector
                scheduleType={scheduleType}
                date={date}
                weekDay={weekDay}
                dayNumber={dayNumber}
                onScheduleTypeChange={setScheduleType}
                onDateChange={setDate}
                onWeekDayChange={setWeekDay}
                onDayNumberChange={setDayNumber}
            />

            <div className="form-group">
                <label>Название дня:</label>
                <input type="text" value={name} onChange={handleChange(setName)} />
            </div>

            <div className="form-group">
                <label>Заметки:</label>
                <textarea value={notes} onChange={handleChange(setNotes)} />
            </div>

            {position && (
                <div className="form-group">
                    <label>Позиция:</label>
                    <input type="text" value={position} onChange={handleChange(setPosition)} />
                </div>
            )}

            <WorkoutSelector
                workout_id={workoutId}
                availableWorkouts={availableWorkouts}
                onChange={handleWorkoutChange}
                required={true}
            />

            <div className="form-actions">
                <button onClick={handleCancelEdit} className="secondary">Отмена</button>
                {workoutId && <button onClick={handleSubmit}>Сохранить день</button>}
            </div>
        </div>
    );
};

export default WorkoutDayForm;
