/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-bind */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { workoutsController } from '../../../../../controllers/global';
import { ExerciseInterface } from '../../../../../store/exercisesStore';
import {  workoutsStore } from '../../../../../store/global';
import { WorkoutInterface } from '../../../../../store/workoutStore';
import AssignWorkoutModal from '../../modal/AssignWorkoutModal';
import { coachWorkoutsController } from '../../../controllers/global';
import AssignedUsersList from '../AssignedUsers/AssignedUsersList';

interface Props {
    workout?: WorkoutInterface;
    state?: string;
}

const CoachWorkout: React.FC<Props> = ({ workout, state = '' }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAssignModalVisible, setAssignModalVisible] = useState(false);

    if (!workout) {return null;}

    const navigate = useNavigate();

    const handleEditClick = useCallback((wo: WorkoutInterface) => {
        workoutsStore.setDraftWorkout(wo);
        navigate(`/workouts/${wo.id}/edit`);
    }, [workout.id]);

    const handleClick = (wo: WorkoutInterface) => () => {
        handleEditClick(wo);
    };

    const handleArchiveClick = useCallback(() => {
        coachWorkoutsController.archiveWorkout(workout.id);
    }, [workout.id]);

    const handleUnarchiveClick = useCallback(() => {
        coachWorkoutsController.unarchiveWorkout(workout.id);
    }, [workout.id]);

    const handleResumeClick = useCallback(() => {
        window.location.pathname = `/workout/${workout.id}`;
    }, [workout.id]);

    const handleFinishClick = useCallback(() => {
        workoutsController.finishWorkout(workout.id);
    }, [workout.id]);

    const toggleExpanded = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsExpanded(prev => !prev);
    };

    const handleAssignClick = () => {
        setAssignModalVisible(true);
    };

    const handleCloseModal = () => {
        setAssignModalVisible(false);
    };

    const handleAssign = async(clientId: number, workoutId: number) => {
        await coachWorkoutsController.assignWorkout(clientId, workoutId);
    };

    const handleRemoveAssignment = (userId: number) => {
        coachWorkoutsController.unassignWorkout(userId, workout.id);
    };

    return (
        <div className="workout-container">
            <p>{workout.name} {workout.created_at?.split(' ')[0] || workout.date}</p>
            {state === 'completed' && <p>{t('workout.duration')}: {workout.duration}</p>}
            {state === 'completed' && workout.comment && <p>{t('workout.comment')}: {workout.comment}</p>}

            {!state && !workout.deleted && (
                <div className='workout-actions'>
                    <button className="save-btn" onClick={handleAssignClick}>
                        Назначить тренировку
                    </button>

                    <>
                        <button className="save-btn" onClick={handleClick(workout)}>
                            {t('workout.edit')}
                        </button>
                        <button className="save-btn" onClick={handleArchiveClick}>
                            {t('workout.archive')}
                        </button>
                    </>

                    {workout.exercises && workout.exercises.length > 0 && (
                        <button className="save-btn" onClick={toggleExpanded}>
                            {isExpanded ? t('workout.hideExercises') : t('workout.showExercises')}
                        </button>
                    )}
                </div>
            )}

            {workout.deleted && (
                <div className='workout-actions'>

                    <button className="save-btn" onClick={handleUnarchiveClick}>
                        {t('workout.unarchive')}
                    </button>

                    {workout.exercises && workout.exercises.length > 0 && (
                        <button className="save-btn" onClick={toggleExpanded}>
                            {isExpanded ? t('workout.hideExercises') : t('workout.showExercises')}
                        </button>
                    )}
                </div>
            )}

            {state === 'in_progress' && (
                <div className='workout-actions'>
                    <button className="save-btn" onClick={handleFinishClick}>
                        {t('workout.finish')}
                    </button>
                    <button className="save-btn" onClick={handleResumeClick}>
                        {t('workout.resume')}
                    </button>
                </div>
            )}

            {isExpanded && workout.exercises && (
                <div className="exercises-container">
                    <h4>{t('workout.exercises')}</h4>
                    {workout.exercises.map((exercise: ExerciseInterface) => (
                        <p key={exercise.id}>{exercise.name}</p>
                    ))}
                </div>
            )}

            {workout.assigned_users && (
                <AssignedUsersList
                    assignedUsers={workout.assigned_users}
                    onRemove={handleRemoveAssignment}
                />
            )}

            {isAssignModalVisible && (
                <AssignWorkoutModal
                    visible={isAssignModalVisible}
                    onClose={handleCloseModal}
                    workoutId={workout.id}
                    onAssign={handleAssign}
                />
            )}
        </div>
    );
};

export default inject(
    'exercisesStore',
    'exercisesController',
    'workoutsStore',
    'workoutsController'
)(observer(CoachWorkout));
