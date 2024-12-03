/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { useParams, useNavigate } from 'react-router-dom';

import './Exercise.style.scss';
import ExercisesController from '../../../../controllers/ExercisesController';
import ExercisesStore from '../../../../store/exercisesStore';
import { useTranslation } from 'react-i18next';

interface ExerciseDetailProps {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

const Exercise: React.FC<ExerciseDetailProps> = ({ exercisesStore, exercisesController }) => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (exercisesController && exercisesStore) {
            exercisesController.getExercise(id);
        }
    }, [id,
        exercisesController,
        exercisesStore]);

    const exercise = exercisesStore?.generalExercise;

    const handleBack = () => {
        // eslint-disable-next-line no-magic-numbers
        navigate(-1);
    };

    if (!exercise) {
        return <div>{t('exercise.loading')}</div>;
    }
    return (
        <div className="exercise-detail-container">
            <button onClick={handleBack}>{t('exercise.back')}</button>
            <h2>{exercise.name}</h2>
            <div className="exercise-info">
                <p><strong>{t('exercise.category')}:</strong> {t(`exercise.categories.${exercise.category}`)}</p>
                <p><strong>{t('exercise.difficulty')}:</strong> {t(`exercise.difficulties.${exercise.difficulty}`)}</p>
                <p><strong>{t('exercise.duration')}:</strong> {exercise.duration} {t('exercise.minutes')}</p>
                <p><strong>{t('exercise.muscleGroups')}:</strong>
                    {exercise.muscle_groups.map(mg => t(`exercise.muscleGroupsList.${mg}`)).join(', ')}</p>
                <p><strong>{t('exercise.description')}:</strong> {exercise.description}</p>
            </div>
        </div>
    );
};

export default inject('exercisesStore', 'exercisesController')(observer(Exercise));
