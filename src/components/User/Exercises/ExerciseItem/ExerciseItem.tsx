import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Exercise } from '../Exercises';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './ExerciseItem.style.scss';
import { useTranslation } from 'react-i18next';

interface ExerciseItemProps {
    exercise: Exercise;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const handleToggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const handleShowExercise = useCallback(() => {
        navigate(`/me/exercises/${exercise.id}`);
    }, [navigate, exercise.id]);


    return (
        <div className="exercise-item">
            <div className="exercise-header" onClick={handleToggleExpand}>
                <h2>{exercise.name}</h2>
                <div className="exercise-icons">
                    <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                </div>
            </div>
            {!isExpanded && (
                <div className="exercise-summary">
                    <button onClick={handleShowExercise} className="show-exercise-btn">
                        {t('exerciseItem.viewDetails')} <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            )}

            {isExpanded && (
                <div className="exercise-details">
                    <p><strong>{t('exerciseItem.category')}:</strong> {t(`exerciseItem.categories.${exercise.category}`)}</p>
                    <p><strong>{t('exerciseItem.difficulty')}:</strong> {t(`exerciseItem.difficulties.${exercise.difficulty}`)}</p>
                    <p><strong>{t('exerciseItem.duration')}:</strong> {exercise.duration} {t('exerciseItem.minutes')}</p>
                    <p><strong>{t('exerciseItem.description')}:</strong> {exercise.description}</p>
                    <p>
                        <strong>{t('exerciseItem.muscleGroups')}:</strong>{' '}
                        {exercise.muscle_groups.map(mg => t(`exerciseItem.muscleGroupsList.${mg}`)).join(', ')}

                    </p>
                    <button onClick={handleShowExercise} className="show-exercise-btn">
                        {t('exerciseItem.viewDetails')} <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExerciseItem;
