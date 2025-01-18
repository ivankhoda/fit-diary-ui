import React from 'react';
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

    const handleDeleteSet = React.useCallback((setId: string, exerciseId: number) => {
        deleteSet(setId, exerciseId);
    }, [deleteSet]);

    return (
        <div className="user-exercises-container">
            <h2>{t('workoutData.exercisesDone')}</h2>
            {userExercises.map(userExercise => (
                userExercise.number_of_sets && userExercise.number_of_sets.length > 0 && (
                    <div key={userExercise.id} className="exercise-item">
                        <p className="exercise-name">
                            {userExercise.name}
                        </p>

                        {userExercise.number_of_sets && userExercise.number_of_sets.length > 0 && (
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
