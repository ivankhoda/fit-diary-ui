import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { UserProfile } from '../../../../../store/userStore';
import TrainingGoalSelector from '../../Plans/PlanForm/TrainingGoalSelector';
import { coachTrainingGoalsController } from '../../../controllers/global';
import { coachTrainingGoalsStore } from '../../../store/global';
import './AssignedUserCard.style.scss';

interface Props {
  user: UserProfile;
  onRemove: (userId: number) => void;
  planId: number;
}

const AssignedUserCard: React.FC<Props> = ({ user, planId, onRemove }) => {
    const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

    useEffect(() => {
        coachTrainingGoalsController.fetchGoalsByUserId(user.id);
        if(user.training_goal) {
            setSelectedGoalId(user.training_goal.id);
        }
    }, [user.id, user.training_goal]);

    const handleGoalChange = useCallback((goalId: number | null) => {
        setSelectedGoalId(goalId);
        coachTrainingGoalsController.assignGoalToUser(user.id,planId, goalId);
    }, [user]);

    const handleRemove = useCallback(() => {
        onRemove(user.id);
    }, [onRemove, user.id]);

    const userGoals = coachTrainingGoalsStore.goalsByUserId[user.id] || [];
    console.log(user.training_goal);
    return (
        <li className="assigned-user-card">
            <div className='assigned-user-card__header'>
                <span>{user.name || user.email || `Пользователь #${user.id}`}</span>
                <button type="button" onClick={handleRemove} title="Удалить назначение">
                ×
                </button>
            </div>
            <div className="form-group">
                {userGoals.length === 0
                    ? (
                        <span>Нет тренировочных целей</span>
                    )
                    : (
                        <TrainingGoalSelector
                            visible
                            trainingGoals={userGoals}
                            value={selectedGoalId}
                            onChange={handleGoalChange}
                        />
                    )}
            </div>
        </li>
    );
};

export default observer(AssignedUserCard);
