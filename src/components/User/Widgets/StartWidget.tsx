import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutsController } from '../../../controllers/global';

export const StartWidget: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateWorkout = useCallback(() => {
        workoutsController.createWorkout(navigate);
    }, [navigate]);

    const handleCreateExercise = useCallback(() => {
        navigate('/exercises');
    }, []);

    return (
        <div className="start-widget">
            <h2>С чего начнем?</h2>
            <div className="start-widget__buttons">
                <button
                    className="start-widget__button"
                    onClick={handleCreateWorkout}
                >
          Создать тренировку
                </button>
                <button
                    className="start-widget__button"
                    onClick={handleCreateExercise}
                >
          Создать упражнение
                </button>
            </div>
        </div>
    );
};
