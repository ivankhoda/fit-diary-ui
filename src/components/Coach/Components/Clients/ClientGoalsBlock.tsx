import React, { useState, useCallback, useMemo } from 'react';
import ClientGoalSummary from './ClientGoalSummary';

export interface ClientGoal {
    id?: string | number;
    uuid?: string;
    name?: string;
    progress_percentage?: number;
    comment?: string;
    exercise_name?: string;
    goal_type?: string;
    current_value?: number;
    target_value?: number;
    deadline?: string;
}

interface ClientGoalsBlockProps {
    goals: ClientGoal[];
    t: (key: string) => string;
}

const PRIORITY_FIELD = 'priority';
const VISIBLE_GOALS_COUNT = 2;
const DEFAULT_PRIORITY = 9999;

const getPriority = (goal: ClientGoal): number => (
    typeof (goal as Record<string, unknown>)[PRIORITY_FIELD] === 'number'
        ? (goal as Record<string, number>)[PRIORITY_FIELD]
        : DEFAULT_PRIORITY
);

const ClientGoalsBlock: React.FC<ClientGoalsBlockProps> = ({ goals, t }) => {
    const [expanded, setExpanded] = useState(false);
    const sortedGoals = useMemo(() => [...goals].sort((a, b) => getPriority(a) - getPriority(b)), [goals]);
    const visibleGoals = expanded ? sortedGoals : sortedGoals.slice(0, VISIBLE_GOALS_COUNT);
    const hiddenCount = sortedGoals.length - VISIBLE_GOALS_COUNT;
    const handleExpand = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setExpanded(true);
    }, []);
    return (
        <div className="client-card__goals-summary">
            <div className="client-card__goals-summary-title">{t('clientCard.goals_title')}</div>
            <ul className="client-card__goals-list">
                {visibleGoals.map((goal, idx) => (
                    <li key={goal.id ?? goal.uuid ?? idx} className="client-card__goal-item">
                        <ClientGoalSummary goal={goal} t={t} />
                    </li>
                ))}
            </ul>
            {!expanded && hiddenCount > 0 && (
                <button
                    type="button"
                    className="client-card__goals-expand-btn"
                    onClick={handleExpand}
                >
                    {t('clientCard.show_more_goals').replace('{{count}}', String(hiddenCount))}
                </button>
            )}
        </div>
    );
};

export default ClientGoalsBlock;
