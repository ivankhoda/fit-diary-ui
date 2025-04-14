import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExerciseInterface } from '../../../../../store/exercisesStore';
import { UserExerciseSets } from '../UserExerciseSets/UserExerciseSets';
import './UserExercisesList.style.scss';
import { FaRegClock, FaRedoAlt } from 'react-icons/fa';

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
            <div className="user-exercise-table-header">
                <span>{t('workoutData.exerciseName')}</span>
                <div className='user-exercise-table-summary'>
                    <span><FaRegClock /></span>
                    <span><FaRedoAlt /></span>
                </div>
            </div>

            {userExercises.map(userExercise => (
                (
                    <div key={userExercise.id} className="exercise-item">
                        <div className="exercise-header" onClick={handleToggleExpand(userExercise)}>
                            <p className="exercise-name">{userExercise.name}</p>
                            <div className='exercise-mini-summary'>
                                {userExercise.formatted_duration && <p className="exercise-sets">{userExercise.formatted_duration}</p>}
                                {userExercise.number_of_sets && <p className="exercise-sets">{userExercise.number_of_sets.length}</p>}

                            </div>
                        </div>

                        { userExercise.number_of_sets && userExercise.number_of_sets.length > 0 && expandedExerciseIds.includes(userExercise.id) && (
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
