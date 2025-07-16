import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import './PlanCard.style.scss';

import { PlanInterface } from '../../../store/CoachPlansStore';

import { coachPlansController } from '../../../controllers/global';
import AssignPlanModal from '../../modal/AssignPlanModal/AssignPlanModal';
import AssignedUsersList from '../AssignedUsers/AssignedUsersList';

interface PlanCardProps {
  plan: PlanInterface;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
    const [isAssignModalVisible, setAssignModalVisible] = useState(false);
    const {id} = plan;

    const handleCloseModal = useCallback(() => {
        setAssignModalVisible(false);
    }, []);

    const handleOpenModal = useCallback(() => {
        setAssignModalVisible(true);
    }, []);

    const handleAssign = useCallback(
        async(clientId: number, planId: number) => {
            await coachPlansController.assignPlan(clientId, planId);
        },
        []
    );

    const handleRemoveAssignment = useCallback((userId: number) => {
        if (!id) {return;}
        coachPlansController.unassignPlan(userId, Number(id));
    }, [id]);

    return (
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
            <button onClick={handleOpenModal}>Назначить план</button>

            {isAssignModalVisible && (
                <AssignPlanModal
                    visible={isAssignModalVisible}
                    onClose={handleCloseModal}
                    planId={id}
                    onAssign={handleAssign}
                />
            )}
            {plan.assigned_users?.length > 0 && <AssignedUsersList assignedUsers={plan.assigned_users} onRemove={handleRemoveAssignment}/>}

            <Link
                to={`/plans/${plan.id}`}
                className="plan-card__link"
                aria-label={`Подробнее о плане "${plan.name}"`}
            >
        Подробнее
            </Link>
        </div>
    );
};

export default PlanCard;
