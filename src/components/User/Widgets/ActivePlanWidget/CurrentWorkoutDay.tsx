import React from 'react';

import { WorkoutDayInterface } from '../../../../store/plansStore';
import { formatDate } from '../../../Common/date/formatDate';
import { translateWeekDays } from '../../../Common/translateWeekDays';
import { FastAccessWorkout } from '../../workouts/FastAccessWorkout/FastAccessWorkout';

interface Props {
    day: WorkoutDayInterface;
    planId: number;
}

export const CurrentWorkoutDayInfo = ({ day, planId }: Props): JSX.Element | null => {
    if (!day) {return <>Нет тренировочных дней в плане</>;}

    return (
        <div className="current-day-info">
            {day.name && <p className="day-name">{day.name}</p>}
            {day.position && <p className="day-position">{day.position}</p>}
            {day.date && <p className="day-date">{formatDate(day.date)}</p>}
            {day.week_day && <p className="day-weekday">{translateWeekDays(day.week_day)}</p>}
            {day.workouts?.length > 0 && (
                <FastAccessWorkout workout={day.workouts[0]} plan_id={planId} />
            )}
        </div>
    );
};
