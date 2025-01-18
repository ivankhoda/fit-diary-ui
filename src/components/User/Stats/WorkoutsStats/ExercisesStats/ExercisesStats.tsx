import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ExerciseRecords.style.scss';
import UserController from '../../../../../controllers/UserController';
import UserStore, { Exercise } from '../../../../../store/userStore';
import { inject, observer } from 'mobx-react';
import ProgressTable from './ProgressTable';
import { t } from 'i18next';
import ExerciseList from './ExerciseList/ExerciseList';
import { PersonalBests } from './PersonalBests/PersonalBests';


export interface ConsistencyMetrics {
    days_exercised_this_week: number;
    workout_streak: number;
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
    const [consistency, setConsistency] = useState<ConsistencyMetrics | null>(null);

    useEffect(() => {
        userController?.getUserExercisesStats();
    }, [userController]);

    useEffect(() => {
        if (userStore?.userExercisesStats) {
            setExercises(userStore.userExercisesStats);
        }
        if (userStore?.userConsistencyStats) {
            setConsistency(userStore.userConsistencyStats);
        }
    }, [userStore?.userExercisesStats, userStore?.userConsistencyStats]);

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

    const filteredExercises = useMemo(
        () =>
            exercises.filter(exercise => {
                const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
                const inDateRange = exercise.progress.some(session => {
                    const sessionDate = new Date(session.date);
                    const start = startDate ? new Date(startDate) : null;
                    const end = endDate ? new Date(endDate) : null;
                    return (!start || sessionDate >= start) && (!end || sessionDate <= end);
                });

                return matchesSearch && inDateRange;
            }),
        [exercises,
            searchTerm,
            startDate,
            endDate]
    );

    return (
        <div className="exercise-records">
            {consistency && (
                <div className="consistency-metrics">
                    <p>
                        {t('consistency.daysExercisedThisWeek')}: {consistency.days_exercised_this_week}
                    </p>
                    <p>
                        {t('consistency.workoutStreak')}: {consistency.workout_streak}
                    </p>
                </div>
            )}

            <div className="search-filter-section">
                <input
                    type="text"
                    className="search-bar"
                    placeholder={t('search')}
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div className="date-filter">
                    <label>{t('from')}</label>
                    <input type="date" value={startDate || ''} onChange={handleStartDateChange}/>
                    <label>{t('to')}</label>
                    <input type="date" value={endDate || ''} onChange={handleEndDateChange}/>
                </div>
            </div>

            <div className="records-container">
                <ExerciseList
                    exercises={filteredExercises}
                    onExerciseClick={handleExerciseClick}
                />

                {selectedExercise && (
                    <div className="exercise-progress">
                        <div className="exercise-details">
                            <h2>{selectedExercise.name}</h2>
                            <PersonalBests
                                personalBests={selectedExercise.personal_bests}
                                typeOfMeasurement={selectedExercise.type_of_measurement}
                            />
                        </div>
                        <ProgressTable
                            progress={selectedExercise.progress}
                            type_of_measurement={selectedExercise.type_of_measurement}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

export default inject('userStore', 'userController')(ExerciseRecords);
