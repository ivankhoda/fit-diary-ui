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
        <div className="user-exercises-list-container">
            <h2 className="user-exercises-list-title">{t('workoutData.exercisesDone')}</h2>
            <div className="user-exercises-list-table-header">
                <span>{t('workoutData.exerciseName')}</span>
                <div className='user-exercises-list-table-summary'>
                    <span><FaRegClock /></span>
                    <span><FaRedoAlt /></span>
                </div>
            </div>

            {userExercises.map(userExercise => (
                (
                    <div key={userExercise.id} className="user-exercises-list-item">
                        <div className="user-exercises-list-header" onClick={handleToggleExpand(userExercise)}>
                            <div className="user-exercises-list-header-top-row">
                                <p className="user-exercises-list-name">{userExercise.name}</p>
                                <div className="user-exercises-list-mini-summary">
                                    {userExercise.formatted_duration && <p className="user-exercises-list-sets">{userExercise.formatted_duration}</p>}
                                    {userExercise.number_of_sets && <p className="user-exercises-list-sets">{userExercise.number_of_sets.length}</p>}
                                </div>
                            </div>

                            {userExercise.comment && (
                                <p className="user-exercises-list-comment">{userExercise.comment}</p>
                            )}
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
