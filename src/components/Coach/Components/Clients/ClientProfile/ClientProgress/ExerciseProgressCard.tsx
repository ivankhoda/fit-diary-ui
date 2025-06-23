// ExerciseProgressSection.tsx
import React from 'react';
import ExerciseProgressCard from './ExerciseProgressCard';
import { exerciseProgressData } from './mockData';

const ExerciseProgressSection: React.FC = () => (
    <div className="exercise-progress-section">
        <h2 className="exercise-progress-section__title">Прогресс по упражнениям</h2>
        <div className="exercise-progress-section__grid">
            {exerciseProgressData.map(exercise => (
                <ExerciseProgressCard key={exercise.id} data={exercise} />
            ))}
        </div>
    </div>
);

export default ExerciseProgressSection;
