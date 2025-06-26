/* eslint-disable sort-keys */

import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummyExercises = [
    {
        id: '1',
        name: 'Жим лёжа',
        measurementType: 'weight_and_reps',
        progressData: [
            { date: '2025-06-01', weight: 60, reps: 10 },
            { date: '2025-06-10', weight: 70, reps: 8 },
            { date: '2025-06-18', weight: 75, reps: 6 },
        ],
    },
    {
        id: '2',
        name: 'Подтягивания',
        measurementType: 'reps',
        progressData: [
            { date: '2025-06-01', reps: 5 },
            { date: '2025-06-10', reps: 7 },
            { date: '2025-06-18', reps: 10 },
        ],
    },
    {
        id: '3',
        name: 'Бег',
        measurementType: 'duration_and_distance',
        progressData: [
            { date: '2025-06-01', duration: 25, distance: 3.2 },
            { date: '2025-06-10', duration: 30, distance: 4.0 },
            { date: '2025-06-18', duration: 28, distance: 4.3 },
        ],
    },
];

const ProgressOverview: React.FC = () => (
    <div className="progress-overview">
        <h2 className="progress-overview__title">Прогресс клиента</h2>
        <div className="progress-overview__list">
            {/* {dummyExercises.map(exercise => (
                <ExerciseProgressCard key={exercise.id} exercise={exercise} />
            ))} */}
        </div>
    </div>
);

export default ProgressOverview;
