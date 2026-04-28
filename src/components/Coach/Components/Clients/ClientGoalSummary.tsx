import React from 'react';
import { ClientGoal } from './ClientGoalsBlock';

interface ClientGoalSummaryProps {
    goal: ClientGoal;
    t: (key: string) => string;
}

const ClientGoalSummary: React.FC<ClientGoalSummaryProps> = ({ goal, t }) => (
    <div className="client-card__goal-header-row">
        <span className="client-card__goal-name">{goal.name || t('clientCard.no_goal_name')}</span>
        {goal.goal_type && (
            <span className="client-card__goal-type">{t(`goal_types.${goal.goal_type}`) || goal.goal_type}</span>
        )}
        {typeof goal.progress_percentage === 'number' && (
            <span className="client-card__goal-progress">{goal.progress_percentage}%</span>
        )}
    </div>
);

export default ClientGoalSummary;
