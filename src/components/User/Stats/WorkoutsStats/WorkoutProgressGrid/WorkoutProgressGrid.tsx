/* eslint-disable max-statements */
/* eslint-disable sort-keys */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-magic-numbers */
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import './WorkoutProgressGrid.style.scss';
import { inject, observer } from 'mobx-react';
import UserController from '../../../../../controllers/UserController';
import UserStore from '../../../../../store/userStore';

export interface Workout {
  date: string;
  exercises_count: number;
  name?: string;
  comment?: string;
}

interface UserWorkoutsStatsProps {
  userStore?: UserStore;
  userController?: UserController;
}

const WorkoutProgressGrid: React.FC<UserWorkoutsStatsProps> = observer(({ userStore, userController }) => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [visibleDays, setVisibleDays] = useState<number>(40);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        userController?.getUserWorkoutStats();
    }, [userController]);

    useEffect(() => {
        if (userStore?.workoutsStats) {
            setWorkouts(userStore.workoutsStats);
        }
    }, [userStore?.workoutsStats]);

    const workoutDays = useMemo(() => {
        const daysMap: { [key: string]: Workout } = {};

        if(workouts.length > 0) {
            workouts && workouts.forEach(workout => {
                const formattedDate = new Date(workout.date).toISOString().split('T')[0];
                daysMap[formattedDate] = workout;
            });
        }
        return daysMap;
    }, [workouts]);

    const getDayIntensity = (count: number): string => {
        if (count === 0) {
            return 'none';
        } else if (count <= 3) {
            return 'low';
        } else if (count <= 6) {
            return 'medium';
        }
        return 'high';
    };

    const today = new Date();
    const days = [];

    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push(date);
    }

    const handleDayClick = useCallback((dateString: string) => {
        const workout = workoutDays[dateString];

        if (workout) {
            setSelectedWorkout(workout);
        }
    }, [workoutDays]);

    const createDayClickHandler = useCallback((dateString: string) => () => handleDayClick(dateString), [handleDayClick]);

    const handleCloseModal = useCallback(() => {
        setSelectedWorkout(null);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            const [entry] = entries;

            if (entry.isIntersecting) {
                setVisibleDays(prev => Math.min(prev + 20, days.length));
            }
        });

        if (loadMoreRef.current) {
            obs.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                obs.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreRef, days.length]);

    const monthLabels: { month: string; index: number }[] = [];
    let currentMonth = '';

    days.slice(0, visibleDays).reverse().forEach((day, index) => {
        const month = day.toLocaleString('default', { month: 'short' });

        if (month !== currentMonth) {
            monthLabels.push({ month, index });
            currentMonth = month;
        }
    });

    return (
        <div className="workout-progress-grid">
            <div className="month-labels">
                {monthLabels.map((label, index) => (
                    <span key={index} style={{ gridColumnStart: label.index + 1 }}>
                        {label.month}
                    </span>
                ))}
            </div>
            <div className="progess-grid-container">
                <div className="weekdays">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                </div>
                <div className="grid-container">
                    {days.slice(0, visibleDays).map((day, index) => {
                        const dateString = day.toISOString().split('T')[0];
                        const exercisesCount = workoutDays[dateString]?.exercises_count || 0;
                        const intensity = getDayIntensity(exercisesCount);
                        return (
                            <div
                                key={index}
                                className={`grid-item ${intensity}`}
                                title={`${dateString}: ${exercisesCount} workouts`}
                                onClick={createDayClickHandler(dateString)}
                            ></div>
                        );
                    })}
                </div>
            </div>
            <div className="legend">
                <span>Less</span>
                <div className="legend-item none"></div>
                <div className="legend-item low"></div>
                <div className="legend-item medium"></div>
                <div className="legend-item high"></div>
                <span>More</span>
            </div>

            {selectedWorkout && (
                <div className="workout-modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <h3>Детали</h3>
                        <p>Название: {selectedWorkout.name}</p>
                        <p>Дата: {selectedWorkout.date}</p>
                        <p>Количество упраженений: {selectedWorkout.exercises_count}</p>

                    </div>
                </div>
            )}
            <div ref={loadMoreRef} className="load-more"></div>
        </div>
    );
});

export default inject('userStore', 'userController')(WorkoutProgressGrid);
