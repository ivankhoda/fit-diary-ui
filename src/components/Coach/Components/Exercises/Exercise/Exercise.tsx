/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { useParams, useNavigate } from 'react-router-dom';

import './Exercise.style.scss';

import { useTranslation } from 'react-i18next';
import CoachExercisesController from '../../../controllers/CoachExercisesController';
import CoachExercisesStore from '../../../store/CoachExercisesStore';

interface ExerciseDetailProps {
    coachExercisesStore?: CoachExercisesStore;
    coachExercisesController?: CoachExercisesController;
}

const Exercise: React.FC<ExerciseDetailProps> = ({ coachExercisesStore, coachExercisesController }) => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (coachExercisesController && coachExercisesStore) {
            coachExercisesController.getExercise(id);
        }
    }, [id,
        coachExercisesController,
        coachExercisesStore]);

    const exercise = coachExercisesStore?.generalExercise;

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
                {exercise.category && <p><strong>{t('exercise.category')}:</strong> {t(`exercise.categories.${exercise.category}`)}</p>}
                {exercise.difficulty && <p><strong>{t('exercise.difficulty')}:</strong> {t(`exercise.difficulties.${exercise.difficulty}`)}</p>}
                {exercise.duration && <p><strong>{t('exercise.duration')}:</strong> {exercise.duration} {t('exercise.minutes')}</p>}
                {exercise.muscle_groups && exercise.muscle_groups.length > 0 && <p><strong>{t('exercise.muscleGroups')}:</strong>
                    {exercise.muscle_groups.map(mg => t(`exercise.muscleGroupsList.${mg}`)).join(', ')}</p>}
                {exercise.description && <p><strong>{t('exercise.description')}:</strong> {exercise.description}</p>}
            </div>
        </div>
    );
};

export default inject('coachExercisesStore', 'coachExercisesController')(observer(Exercise));
