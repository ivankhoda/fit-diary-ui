import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer} from 'mobx-react-lite';

import './TrainingGoals.style.scss';
import { trainingGoalsStore } from '../../../store/global';
import { trainingGoalsController } from '../../../controllers/global';
import { TrainingGoalInterface } from '../../../store/trainingGoalsStore';

import ProgressBar from '../../Common/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLeftAndUpRightToCenter, faExpand} from '@fortawesome/free-solid-svg-icons';

const TrainingGoals: React.FC = (() => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expandedGoals, setExpandedGoals] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const loadGoals = async() => {
            try {
                setIsLoading(true);
                await trainingGoalsController.getGoals();
            } catch (err) {
                console.error('Failed to load goals:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if(trainingGoalsStore.goals.length === 0) {
            loadGoals();
        }
    }, []);

    const toggleGoalExpansion = useCallback((goalId: number) => {setExpandedGoals(prev => ({...prev,[goalId]: !prev[goalId]} ));}, []);
    console.log('active goals', trainingGoalsStore.activeGoals );
    console.log('completed goals', trainingGoalsStore.completedGoals );

    const handleToggleGoalExpansion = (goalId: number) => () => {
        toggleGoalExpansion(goalId);
    };

    const renderGoalItem = (goal: TrainingGoalInterface, depth = 0) =>(

        <div
            key={goal.id}
            className={`goal-card ${goal.parent_goal_id && depth > 0 ? 'goal-card__sub' : ''}`}
            // eslint-disable-next-line no-magic-numbers
            style={{ marginLeft: goal.parent_goal_id === null ? 0 : depth * 15 }}
        >
            <div className="goal-card__header">
                <h3 className="goal-card__title">{goal.name}</h3>
                {goal.sub_goals?.length > 0 && (
                    <>
                        {expandedGoals[goal.id] ?
                            <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} onClick={handleToggleGoalExpansion(goal.id)} />
                            : <FontAwesomeIcon icon={faExpand} onClick={handleToggleGoalExpansion(goal.id)} />
                        }
                    </>
                )}
            </div>

            <p className="goal-card__description">{goal.comment}</p>
            {goal.exercise_id && (<p>{goal.exercise_name}</p>)}
            {goal.progress_percentage && <ProgressBar value={goal.progress_percentage} />}

            <div className="goal-card__meta">
                {['strength',
                    'endurance',
                    'speed'].includes(goal.goal_category) && <div className="goal-card__meta-item">
                    <span className="goal-card__meta-label">Цель: </span>
                    <span className="goal-card__meta-value">
                        {goal.target_value}
                    </span>
                </div>}
                <div className="goal-card__meta-item">
                    <span className="goal-card__meta-label">Срок: </span>
                    <span className="goal-card__meta-value">
                        {goal.deadline}
                    </span>
                </div>
            </div>

            <Link
                to={`/training-goals/${goal.id}`}
                className="goal-card__link"
                aria-label={`Подробнее о цели "${goal.name}"`}
            >
            Подробнее
            </Link>

            {goal.parent_goal_id === null &&  goal.sub_goals?.length > 0 && expandedGoals[goal.id] && (
                <div className="goal-card__subgoals">
                    {goal.sub_goals.map(subGoal => renderGoalItem(subGoal, depth + 1))}
                </div>
            )}
        </div>
    );

    const navigate = useNavigate();

    const handleCreateClick = useCallback(() => {
        trainingGoalsStore.setCurrentGoal(null);
        navigate('/training-goals/create');
    }, [navigate]);

    if (isLoading && trainingGoalsStore.goals.length === 0) {
        return (
            <div className="training-goals__loading">
                <p>Загружаем ваши цели...</p>
            </div>
        );
    }

    if (trainingGoalsStore.activeGoals.length === 0) {
        return (
            <div>
                <p>{'Нет активных целей'}</p>
            </div>
        );
    }

    return (
        <div className='container training-goals'>
            <div className="training-goals__header">
                <h1 id="goals-heading">Мои цели</h1>
                <div
                    onClick={handleCreateClick}
                    className="button"
                >
                    Новая цель
                </div>
            </div>

            <div className="goals-list">
                {trainingGoalsStore.activeGoals.map(renderGoalItem)}
            </div>

            {trainingGoalsStore.completedGoals.length > 0 && (
                <div className="training-goals__completed">
                    <h2>Выполненные цели</h2>
                    <div className="training-goals__grid">
                        {trainingGoalsStore.completedGoals.map(renderGoalItem)}
                    </div>
                </div>
            )}
        </div>
    );
});

export default observer(TrainingGoals);
