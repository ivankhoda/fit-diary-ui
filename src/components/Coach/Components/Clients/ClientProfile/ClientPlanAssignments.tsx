import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { clientsController, coachPlansController } from '../../../controllers/global';
import { PlanInterface } from '../../../store/CoachPlansStore';
import { ClientInterface, CoachAssignedPlanPreview } from '../../../store/clientsStore';
import { coachPlansStore } from '../../../store/global';
import { formatDate } from '../../../../Common/date/formatDate';

const EMPTY_ASSIGNED_PLANS_TEXT = 'У клиента пока нет назначенных планов.';
const EMPTY_AVAILABLE_PLANS_TEXT = 'У тренера пока нет доступных планов для назначения.';
const REMOVE_ACTION_TEXT = 'Снять назначение';
const ASSIGN_ACTION_TEXT = 'Назначить план';
const LOADING_ACTION_TEXT = 'Сохраняем...';

type ClientPlanAssignmentsProps = {
    client: ClientInterface;
    onClientChange: (client: ClientInterface) => void;
};

type PlanWithId = PlanInterface & {
    id: number;
};

const isPlanWithId = (plan: PlanInterface): plan is PlanWithId => typeof plan.id === 'number';

const formatPlanDateRange = (startDate: string | null, endDate: string | null): string => {
    const formattedStartDate = formatDate(startDate) || 'Без даты начала';
    const formattedEndDate = formatDate(endDate) || 'Без даты окончания';

    return `${formattedStartDate} - ${formattedEndDate}`;
};

const getAssignmentCaption = (assignedPlan: CoachAssignedPlanPreview): string => {
    if (!assignedPlan.assigned_at) {
        return formatPlanDateRange(assignedPlan.start_date, assignedPlan.end_date);
    }

    const assignedAtLabel = formatDate(assignedPlan.assigned_at) || assignedPlan.assigned_at;

    return `Назначен ${assignedAtLabel}`;
};

const getAssignedPlansMap = (assignedPlans: CoachAssignedPlanPreview[]): Map<number, CoachAssignedPlanPreview> => (
    new Map(assignedPlans.map(assignedPlan => [assignedPlan.id, assignedPlan]))
);

type AvailablePlanCardProps = {
    assignedPlan?: CoachAssignedPlanPreview;
    handleAssignClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    handleUnassignClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    isPending: boolean;
    plan: PlanWithId;
};

const AvailablePlanCard = ({
    assignedPlan,
    handleAssignClick,
    handleUnassignClick,
    isPending,
    plan,
}: AvailablePlanCardProps): JSX.Element => {
    let actionLabel = ASSIGN_ACTION_TEXT;
    let actionClassName = 'client-plan-assignments__action';
    let planCaption = 'План еще не назначен этому клиенту';
    let statusClassName = 'client-plan-assignments__status';
    let statusLabel = 'Доступен';

    if (isPending) {
        actionLabel = LOADING_ACTION_TEXT;
    } else if (assignedPlan) {
        actionLabel = REMOVE_ACTION_TEXT;
    }

    if (assignedPlan) {
        actionClassName = 'client-plan-assignments__action client-plan-assignments__action--danger';
        planCaption = getAssignmentCaption(assignedPlan);
        statusClassName = 'client-plan-assignments__status client-plan-assignments__status--assigned';
        statusLabel = 'Назначен';
    }

    return (
        <article className="client-plan-assignments__plan-card">
            <div className="client-plan-assignments__plan-copy">
                <div className="client-plan-assignments__plan-heading-row">
                    <strong className="client-plan-assignments__plan-name">{plan.name}</strong>
                    <span className={statusClassName}>
                        {statusLabel}
                    </span>
                </div>

                <span className="client-plan-assignments__plan-meta">
                    {formatPlanDateRange(plan.start_date, plan.end_date)}
                </span>

                {plan.description && (
                    <p className="client-plan-assignments__description">{plan.description}</p>
                )}

                <span className="client-plan-assignments__plan-caption">{planCaption}</span>
            </div>

            <button
                className={actionClassName}
                data-plan-id={plan.id}
                disabled={isPending}
                onClick={assignedPlan ? handleUnassignClick : handleAssignClick}
                type="button"
            >
                {actionLabel}
            </button>
        </article>
    );
};

const renderAssignedPlansContent = (assignedPlans: CoachAssignedPlanPreview[]): JSX.Element => {
    if (assignedPlans.length === 0) {
        return <p className="client-plan-assignments__empty">{EMPTY_ASSIGNED_PLANS_TEXT}</p>;
    }

    return (
        <div className="client-plan-assignments__list">
            {assignedPlans.map(assignedPlan => (
                <article key={assignedPlan.id} className="client-plan-assignments__assigned-card">
                    <div className="client-plan-assignments__assigned-copy">
                        <strong className="client-plan-assignments__plan-name">{assignedPlan.name}</strong>
                        <span className="client-plan-assignments__plan-meta">
                            {formatPlanDateRange(assignedPlan.start_date, assignedPlan.end_date)}
                        </span>
                        <span className="client-plan-assignments__plan-caption">
                            {getAssignmentCaption(assignedPlan)}
                        </span>
                    </div>
                </article>
            ))}
        </div>
    );
};

type RenderAvailablePlansContentParams = {
    assignedPlansMap: Map<number, CoachAssignedPlanPreview>;
    availablePlans: PlanWithId[];
    handleAssignClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    handleUnassignClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    pendingPlanId: number | null;
};

const renderAvailablePlansContent = ({
    assignedPlansMap,
    availablePlans,
    handleAssignClick,
    handleUnassignClick,
    pendingPlanId,
}: RenderAvailablePlansContentParams): JSX.Element => {
    if (availablePlans.length === 0) {
        return <p className="client-plan-assignments__empty">{EMPTY_AVAILABLE_PLANS_TEXT}</p>;
    }

    return (
        <div className="client-plan-assignments__list">
            {availablePlans.map(plan => (
                <AvailablePlanCard
                    key={plan.id}
                    assignedPlan={assignedPlansMap.get(plan.id)}
                    handleAssignClick={handleAssignClick}
                    handleUnassignClick={handleUnassignClick}
                    isPending={pendingPlanId === plan.id}
                    plan={plan}
                />
            ))}
        </div>
    );
};

const ClientPlanAssignments = ({ client, onClientChange }: ClientPlanAssignmentsProps): JSX.Element => {
    const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);

    useEffect(() => {
        if (coachPlansStore.plans.length === 0) {
            coachPlansController.getPlans();
        }
    }, []);

    const assignedPlans = client.assigned_plans_by_coach || [];

    const assignedPlansMap = useMemo(
        () => getAssignedPlansMap(assignedPlans),
        [assignedPlans],
    );

    const availablePlans = useMemo(
        () => coachPlansStore.activePlans.filter(isPlanWithId),
        [coachPlansStore.activePlans],
    );

    const refreshClient = useCallback(async() => {
        const refreshedClient = await clientsController.fetchClientById(client.id);

        if (refreshedClient) {
            onClientChange(refreshedClient);
        }
    }, [client.id, onClientChange]);

    const assignPlan = useCallback(async(planId: number) => {
        setPendingPlanId(planId);

        try {
            const wasAssigned = await coachPlansController.assignPlan(client.id, planId);

            if (wasAssigned) {
                await refreshClient();
            }
        } finally {
            setPendingPlanId(null);
        }
    }, [client.id, refreshClient]);

    const unassignPlan = useCallback(async(planId: number) => {
        setPendingPlanId(planId);

        try {
            const wasUnassigned = await coachPlansController.unassignPlan(client.id, planId);

            if (wasUnassigned) {
                await refreshClient();
            }
        } finally {
            setPendingPlanId(null);
        }
    }, [client.id, refreshClient]);

    const handleAssignClick = useCallback(async(event: React.MouseEvent<HTMLButtonElement>) => {
        const planId = Number(event.currentTarget.dataset.planId);

        if (!Number.isFinite(planId)) {
            return;
        }

        await assignPlan(planId);
    }, [assignPlan]);

    const handleUnassignClick = useCallback(async(event: React.MouseEvent<HTMLButtonElement>) => {
        const planId = Number(event.currentTarget.dataset.planId);

        if (!Number.isFinite(planId)) {
            return;
        }

        await unassignPlan(planId);
    }, [unassignPlan]);

    return (
        <section className="client-plan-assignments">
            <div className="client-plan-assignments__hero">
                <div>
                    <span className="client-plan-assignments__eyebrow">Назначения тренера</span>
                    <h2 className="client-plan-assignments__title">Планы клиента</h2>
                    <p className="client-plan-assignments__subtitle">
                        Назначайте только собственные планы тренера и снимайте назначения без перехода в каталог планов.
                    </p>
                </div>

                <div className="client-plan-assignments__summary-card">
                    <span className="client-plan-assignments__summary-label">Сейчас назначено</span>
                    <strong className="client-plan-assignments__summary-value">{assignedPlans.length}</strong>
                    <span className="client-plan-assignments__summary-note">Планы из связи coach_clients</span>
                </div>
            </div>

            <div className="client-plan-assignments__grid">
                <article className="client-plan-assignments__panel">
                    <div className="client-plan-assignments__panel-header">
                        <h3 className="client-plan-assignments__panel-title">Назначенные планы</h3>
                        <span className="client-plan-assignments__panel-count">{assignedPlans.length}</span>
                    </div>

                    {renderAssignedPlansContent(assignedPlans)}
                </article>

                <article className="client-plan-assignments__panel">
                    <div className="client-plan-assignments__panel-header">
                        <h3 className="client-plan-assignments__panel-title">Доступные планы тренера</h3>
                        <span className="client-plan-assignments__panel-count">{availablePlans.length}</span>
                    </div>

                    {renderAvailablePlansContent({
                        assignedPlansMap,
                        availablePlans,
                        handleAssignClick,
                        handleUnassignClick,
                        pendingPlanId,
                    })}
                </article>
            </div>
        </section>
    );
};

export default observer(ClientPlanAssignments);
