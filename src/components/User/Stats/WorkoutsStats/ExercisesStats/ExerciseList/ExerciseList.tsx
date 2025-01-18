import React, { useCallback, useState } from 'react';
import { t } from 'i18next';
import { convertDurationToMMSS } from '../../../../../Admin/utils/convertDurationToMMSS';
import './ExerciseList.style.scss';

interface Exercise {
  id: number;
  name: string;
  lastSession: {
    weight?: number;
    reps?: number;
    duration?: number;
    distance?: number;
    sets?: number;
    date: string;
  };
  type_of_measurement: string;
}

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseClick: (exercise: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onExerciseClick }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(exercises.length / itemsPerPage);

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const exerciseId = Number(event.currentTarget.getAttribute('data-id'));
            const exercise = exercises.find(ex => ex.id === exerciseId);

            if (exercise) {
                onExerciseClick(exercise);
            }
        },
        [exercises, onExerciseClick]
    );

    const formatExerciseDetails = (exercise: Exercise) => {
        switch (exercise.type_of_measurement) {
        case 'cardio':
            return (
                <>
                    <span className="session-details">{`${t('workoutData.duration')}: ${convertDurationToMMSS(
                        exercise.lastSession.duration
                    )}`}</span>
                    <span className="session-details">{`${t('workoutData.distance')}: ${exercise.lastSession.distance}`}</span>
                </>
            );
        case 'weight_and_reps':
            return (
                <>
                    <span className="session-details">{`${t('workoutData.weight')}: ${exercise.lastSession.weight}`}</span>
                    <span className="session-details">{`${t('workoutData.repetitions')}: ${exercise.lastSession.reps}`}</span>
                    <span>{`${t('workoutData.sets')}: ${exercise.lastSession.sets}`}</span>
                    <span className="session-details">{`${exercise.lastSession.date}`}</span>
                </>
            );
        case 'duration_and_distance':
            return (
                <>
                    <span className="session-details">{`${t('workoutData.duration')}: ${convertDurationToMMSS(
                        exercise.lastSession.duration
                    )}`}</span>
                    <span className="session-details">{`${t('workoutData.distance')}: ${exercise.lastSession.distance}`}</span>
                    <span className="session-details">{`${exercise.lastSession.date}`}</span>
                </>
            );
        case 'duration':
            return (
                <>
                    <span className="session-details">{`${t('workoutData.duration')}: ${convertDurationToMMSS(
                        exercise.lastSession.duration
                    )}`}</span>
                    <span className="session-details">{`${exercise.lastSession.date}`}</span>
                </>
            );
        case 'reps':
            return (
                <>
                    <span className="session-details">{`${t('workoutData.repetitions')}: ${exercise.lastSession.reps}`}</span>
                    <span className="session-details">{`${exercise.lastSession.date}`}</span>
                </>
            );
        case 'duration_and_reps':
            return (
                <>
                    <span className="session-details">{`${t('workoutData.duration')}: ${convertDurationToMMSS(
                        exercise.lastSession.duration
                    )}`}</span>
                    <span className="session-details">{`${t('workoutData.repetitions')}: ${exercise.lastSession.reps}`}</span>
                    <span className="session-details">{`${exercise.lastSession.date}`}</span>
                </>
            );
        default:
            return <span className="session-details">{`${exercise.lastSession.date}`}</span>;
        }
    };

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleNextPage = useCallback(() => {
        handlePageChange(currentPage + 1);
    }, [currentPage, handlePageChange]);

    const handlePreviousPage = useCallback(() => {
        handlePageChange(currentPage - 1);
    }, [currentPage, handlePageChange]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const exercisesToDisplay = exercises.slice(startIndex, endIndex);

    return (
        <div className="exercise-list-container">
            <div className="exercise-list">
                {exercisesToDisplay.map(exercise => (

                    <div
                        key={exercise.id}
                        className="exercise-item"
                        onClick={handleClick}
                        data-id={exercise.id}
                    >

                        <div className="exercise-header">
                            <span className="exercise-name">{exercise.name}</span>
                        </div>
                        <div className="last-session">
                            {formatExerciseDetails(exercise)}
                        </div>
                    </div>

                ))}

            </div>
            <div className="pagination-controls">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    {t('paginationPrevious')}
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    {t('paginationNext')}
                </button>
            </div>
        </div>
    );
};

export default ExerciseList;
