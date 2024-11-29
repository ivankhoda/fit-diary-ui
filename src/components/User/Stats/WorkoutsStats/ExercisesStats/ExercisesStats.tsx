/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ExerciseRecords.style.scss';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UserController from '../../../../../controllers/UserController';
import UserStore from '../../../../../store/userStore';
import { inject, observer } from 'mobx-react';

export interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  lastSession: { weight: number; reps: number; sets: number; date: string };
  progress: { date: string; weight: number; reps: number; sets: number }[];
}

interface ExerciseRecordsStatsProps {
    userStore?: UserStore;
    userController?: UserController;
}

const ExerciseRecords: React.FC<ExerciseRecordsStatsProps> = observer(({ userStore, userController }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    useEffect(() => {
        userController?.getUserExercisesStats();
    }, [userController]);

    useEffect(() => {
        if (userStore?.userExercisesStats) {
            setExercises(userStore.userExercisesStats);
        }
    }, [userStore?.userExercisesStats]);

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleExerciseClick = useCallback((exercise: Exercise) => {
        setSelectedExercise(exercise);
    }, []);

    const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    }, []);

    const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    }, []);

    const filteredExercises = useMemo(() => exercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());

        const inDateRange = exercise.progress.some(session => {
            const sessionDate = new Date(session.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (!start || sessionDate >= start) && (!end || sessionDate <= end);
        });

        return matchesSearch && inDateRange;
    }), [exercises,
        searchTerm,
        startDate,
        endDate]);

    return (
        <div className="exercise-records">
            <div className="search-filter-section">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

                <div className="date-filter">
                    <label>От:</label>
                    <input type="date" value={startDate || ''} onChange={handleStartDateChange} />

                    <label>До:</label>
                    <input type="date" value={endDate || ''} onChange={handleEndDateChange} />
                </div>
            </div>

            <div className="records-container">
                <div className="exercise-list">
                    {filteredExercises.map(exercise => (
                        <div key={exercise.id} className="exercise-item" onClick={() => handleExerciseClick(exercise)}>
                            <span className="exercise-name">{exercise.name}</span>
                            <span className="last-session">
                                {exercise.lastSession.weight > 0 ? `${exercise.lastSession.weight}kg` : 'Bodyweight'}
                                | {exercise.lastSession.reps} reps
                                | {exercise.lastSession.sets} sets
                                | {exercise.lastSession.date}
                            </span>
                        </div>
                    ))}
                </div>

                {selectedExercise && (
                    <div className="exercise-progress">
                        <h3>Прогресс {selectedExercise.name}</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={selectedExercise.progress}>
                                <CartesianGrid stroke="#eee" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                                <Line type="monotone" dataKey="reps" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className="exercise-log">
                            <h4>Детали</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Дата</th>
                                        <th>Макс.вес</th>
                                        <th>Повторов</th>
                                        <th>Сетов</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedExercise.progress.map((session, index) => (
                                        <tr key={index}>
                                            <td>{session.date}</td>
                                            <td>{session.weight > 0 ? `${session.weight} kg` : 'Bodyweight'}</td>
                                            <td>{session.reps}</td>
                                            <td>{session.sets}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default inject('userStore', 'userController')(ExerciseRecords);
