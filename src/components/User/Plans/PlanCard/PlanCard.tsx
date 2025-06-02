import React from 'react';
import { Link } from 'react-router-dom';

import './PlanCard.style.scss';
import { PlanInterface } from '../../../../store/plansStore';
import { FastAccessWorkout } from '../../workouts/FastAccessWorkout/FastAccessWorkout';
import { t } from 'i18next';

interface PlanCardProps {
  plan: PlanInterface;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => (
    <div className="plan-card">
        <div className="plan-card__header">
            <h3 className="plan-card__title">{plan.name}</h3>
            <p>{plan.status}</p>
        </div>

        {plan.description && (
            <p className="plan-card__description">{plan.description}</p>
        )}

        {plan.training_goal_name && <div className="plan-card__details">
           (
            <div className="plan-card__goal">
                <span className="label">Цель:</span>
                <strong>{plan.training_goal_name}</strong>
            </div>
            )
        </div>
        }
        <div>
            {plan.current_workout_day?.workouts && plan.current_workout_day.workouts.length > 0 && (
                <>
                    <p>{t('workout.name')}</p>
                    <FastAccessWorkout workout={plan.current_workout_day.workouts[0]} plan_id={plan.id}/>
                </>
            )}
        </div>

        <Link
            to={`/plans/${plan.id}`}
            className="plan-card__link"
            aria-label={`Подробнее о плане "${plan.name}"`}
        >
        Подробнее
        </Link>
    </div>
);

export default PlanCard;
