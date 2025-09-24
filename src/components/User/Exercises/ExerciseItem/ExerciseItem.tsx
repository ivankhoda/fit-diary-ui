import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faTrash,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import './ExerciseItem.style.scss';
import { useTranslation } from 'react-i18next';
import { Exercise } from '../Exercises';
import { useToken } from '../../../Auth/useToken';

interface ExerciseItemProps {
  exercise: Exercise;
  deleteExercise?: () => void;
  edit?: () => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
    exercise,
    deleteExercise,
    edit,
}) => {
    const { t } = useTranslation();
    const { token } = useToken();

    const navigate = useNavigate();

    const handleShowExercise = useCallback(() => {
        navigate(`/exercises/${exercise.id}`);
    }, [navigate, exercise.id]);

    const onDelete = useCallback(() => {
        deleteExercise();
    }, [deleteExercise, exercise.id]);

    const handleEdit = useCallback(() => {
        edit();
    }, [edit]);
    return (
        <div className="exercise-item">
            <div className="exercise-header">
                <h2>{exercise.name}</h2>
            </div>
            {
                <div className="exercise-summary">
                    <button onClick={handleShowExercise} className="show-exercise-btn">
                        {t('exerciseItem.viewDetails')}{' '}
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                    {token && <>
                        {exercise.own && (
                            <button className="show-exercise-btn" onClick={handleEdit}>
                                {t('edit')} <FontAwesomeIcon icon={faEdit} />
                            </button>
                        )}
                        {exercise.own && (
                            <button className="show-exercise-btn" onClick={onDelete}>
                                {t('delete')} <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </>}
                </div>
            }
        </div>
    );
};

export default ExerciseItem;
