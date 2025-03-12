import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExerciseInterface } from '../../../../../store/exercisesStore';
import { UserExerciseSets } from '../UserExerciseSets/UserExerciseSets';
import './UserExercisesList.style.scss';

interface UserExercisesListProps {
  userExercises: ExerciseInterface[];
  deleteSet: (setId: string, exerciseId: number) => void;
}

export const UserExercisesList: React.FC<UserExercisesListProps> = ({ userExercises, deleteSet }) => {
    const { t } = useTranslation();

    const [expandedExerciseIds, setExpandedExerciseIds] = useState<number[]>([]);

    const handleDeleteSet = React.useCallback((setId: string, exerciseId: number) => {
        deleteSet(setId, exerciseId);
    }, [deleteSet]);

    const toggleExpand = useCallback((exerciseId: number) => {
        setExpandedExerciseIds(prev =>
            prev.includes(exerciseId)
                ? prev.filter(id => id !== exerciseId)
                : [...prev, exerciseId]);
    }, [userExercises]);

    const handleToggleExpand = useCallback((userExercise: ExerciseInterface) => () => toggleExpand(userExercise.id), [toggleExpand]);
    return (
        <div className="user-exercises-container">
            <h2>{t('workoutData.exercisesDone')}</h2>
            {userExercises.map(userExercise => (
                userExercise.number_of_sets && userExercise.number_of_sets.length > 0 && (
                    <div key={userExercise.id} className="exercise-item">
                        <div className="exercise-header" onClick={handleToggleExpand(userExercise)}>
                            <p className="exercise-name">{userExercise.name}</p>
                            <p className="exercise-sets">{t('workoutData.sets')}: {userExercise.number_of_sets.length}</p>
                        </div>
                        {userExercise.formatted_duration &&
                        <div className="exercise-header">
                            <p className="exercise-name">{t('workoutData.exercise_duration')}: {userExercise.formatted_duration}</p>
                        </div>}

                        {expandedExerciseIds.includes(userExercise.id) && (
                            <UserExerciseSets
                                sets={userExercise.number_of_sets}
                                measurementType={userExercise.type_of_measurement}
                                deleteSet={handleDeleteSet}
                                exerciseId={userExercise.id}
                            />
                        )}
                    </div>
                )
            ))}
        </div>
    );
};
