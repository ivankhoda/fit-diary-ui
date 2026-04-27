import React, { MouseEvent, useCallback } from 'react';
import { ClientInterface } from '../../store/clientsStore';
import { FaTrash } from 'react-icons/fa';
import { clientsController } from '../../controllers/global';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import './ClientCard.scss';
import { useNavigate } from 'react-router';
import { formatDate } from '../../../Common/date/formatDate';

const ACTIVE_DAYS_THRESHOLD = 3;
const LOW_ACTIVITY_DAYS_THRESHOLD = 7;
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const ONE_DAY_IN_MS = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;
const PERCENT_MULTIPLIER = 100;
const MAX_PRIMARY_PLANS = 2;

type ActivityState = {
    color: 'green' | 'orange' | 'red';
    hint: string;
    status: string;
};

type ClientSignal = {
    isStub: boolean;
    label: string;
    value: string;
};

const getActivityStatus = (lastActive: string): ActivityState => {
    const days = (Date.now() - new Date(lastActive).getTime()) / ONE_DAY_IN_MS;

    if (days < ACTIVE_DAYS_THRESHOLD) {
        return { color: 'green', hint: 'в рабочем ритме', status: 'Активен' };
    }

    if (days < LOW_ACTIVITY_DAYS_THRESHOLD) {
        return { color: 'orange', hint: 'нужен мягкий контроль', status: 'Снизил темп' };
    }

    return { color: 'red', hint: 'стоит связаться и вернуть в график', status: 'Требует внимания' };
};

const formatDateValue = (date?: string): string => formatDate(date || null) || '—';

const formatRelativeActivity = (date?: string): string => {
    if (!date) {
        return 'нет данных';
    }

    const daysSinceActivity = Math.floor((Date.now() - new Date(date).getTime()) / ONE_DAY_IN_MS);

    if (daysSinceActivity <= 0) {
        return 'сегодня';
    }

    if (daysSinceActivity === 1) {
        return 'вчера';
    }

    return `${daysSinceActivity} дн. назад`;
};

const getProgressLabel = (completedWorkouts = 0, totalWorkouts = 0): string => {
    if (!totalWorkouts) {
        return 'План пока не собран';
    }

    const progressPercent = Math.round((completedWorkouts / totalWorkouts) * PERCENT_MULTIPLIER);
    return `${completedWorkouts}/${totalWorkouts} · ${progressPercent}%`;
};

const getPlanNames = (client: ClientInterface): string[] => {
    const assignedPlans = client.assigned_plans_by_coach?.map(plan => plan.name).filter(Boolean) || [];

    if (assignedPlans.length > 0) {
        return assignedPlans;
    }

    if (client.planTitle) {
        return [client.planTitle];
    }

    if (client.plan?.name) {
        return [client.plan.name];
    }

    return [];
};

const getCoachFocus = (client: ClientInterface, activity: ActivityState): string => {
    if (!client.nextWorkoutDate) {
        return 'Назначить следующую тренировку';
    }

    if (activity.color === 'red') {
        return 'Нужен личный follow-up';
    }

    if (!client.completedWorkouts && client.totalWorkouts) {
        return 'Проверить старт по плану';
    }

    return 'Держать темп и наблюдать';
};

const getClientSignals = (client: ClientInterface): ClientSignal[] => {
    const goalSignal: ClientSignal = {
        isStub: !client.goal_summary,
        label: 'Цель',
        value: client.goal_summary || 'Стаб: нужен goal_summary из API',
    };
    const checkInSignal: ClientSignal = {
        isStub: !client.last_check_in_at,
        label: 'Чек-ин',
        value: client.last_check_in_at
            ? formatDateValue(client.last_check_in_at)
            : 'Стаб: нужен last_check_in_at из API',
    };

    return [goalSignal, checkInSignal];
};

const ClientCard = ({ client }: { client: ClientInterface }): JSX.Element => {
    const navigate = useNavigate();

    const handleDelete = useCallback(async(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        // eslint-disable-next-line no-alert
        if (confirm(`Удалить спортсмена ${client.email}?`)) {
            const isRemoved = await clientsController.removeClient(client.id);

            if (isRemoved) {
                navigate('/clients');
            }
        }
    }, [client.id,
        client.email,
        navigate]);

    const handleClick = useCallback(() => {
        navigate(`/coach/clients/${client.id}`);
    }, [client.id, navigate]);

    const activityDate = client.lastActive || client.updatedAt || client.createdAt || client.joined_at;
    const activity = getActivityStatus(activityDate || new Date().toISOString());
    const planNames = getPlanNames(client);
    const clientSignals = getClientSignals(client);
    const secondaryContacts = [client.telegram_username ? `@${client.telegram_username}` : '', client.phone_number || '']
        .filter(Boolean);

    return (
        <div className="client-card" onClick={handleClick}>
            <div className="client-card__main">
                <div className="client-card__header">
                    <div className="client-card__identity">
                        <div className="client-card__title-row">
                            <h4 className="client-card__name">{client.name || 'Без имени'}</h4>
                            <span className={`client-card__status client-card__status--${activity.color}`}>
                                {activity.status}
                            </span>
                        </div>
                        <p className="client-card__email">{client.email}</p>
                        <div className="client-card__meta-row">
                            <span className="client-card__meta-chip">Активность: {formatRelativeActivity(activityDate)}</span>
                            <span className="client-card__meta-chip">В работе с {formatDateValue(client.joined_at || client.createdAt)}</span>
                            {secondaryContacts.map(contact => (
                                <span key={contact} className="client-card__meta-chip">{contact}</span>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleDelete} className="client-card__delete-button" aria-label={`Удалить спортсмена ${client.email}`}>
                        <FaTrash />
                    </button>
                </div>

                <div className="client-card__summary-grid">
                    <div className="client-card__summary-item">
                        <span className="client-card__summary-label">План</span>
                        <strong className="client-card__summary-value">{planNames.length || 0}</strong>
                        <span className="client-card__summary-note">активных назначений</span>
                    </div>
                    <div className="client-card__summary-item">
                        <span className="client-card__summary-label">Прогресс</span>
                        <strong className="client-card__summary-value">{getProgressLabel(client.completedWorkouts, client.totalWorkouts)}</strong>
                        <span className="client-card__summary-note">по назначенному объёму</span>
                    </div>
                    <div className="client-card__summary-item">
                        <span className="client-card__summary-label">Последняя тренировка</span>
                        <strong className="client-card__summary-value">{formatDateValue(client.lastWorkoutDate)}</strong>
                        <span className="client-card__summary-note">{activity.hint}</span>
                    </div>
                    <div className="client-card__summary-item">
                        <span className="client-card__summary-label">Следующая тренировка</span>
                        <strong className="client-card__summary-value">{formatDateValue(client.nextWorkoutDate)}</strong>
                        <span className="client-card__summary-note">{getCoachFocus(client, activity)}</span>
                    </div>
                </div>

                <div className="client-card__footer">
                    <div className="client-card__plans">
                        <span className="client-card__footer-label">Назначенные планы</span>
                        <div className="client-card__plan-list">
                            {planNames.length > 0
                                ? planNames.slice(0, MAX_PRIMARY_PLANS).map(planName => (
                                    <span key={planName} className="client-card__plan-chip">{planName}</span>
                                ))
                                : <span className="client-card__plan-chip client-card__plan-chip--empty">Пока не назначены</span>
                            }
                            {planNames.length > MAX_PRIMARY_PLANS && (
                                <span className="client-card__plan-chip client-card__plan-chip--muted">+{planNames.length - MAX_PRIMARY_PLANS}</span>
                            )}
                        </div>
                    </div>

                    <div className="client-card__focus">
                        <span className="client-card__footer-label">Фокус тренера</span>
                        <p className="client-card__focus-text">{getCoachFocus(client, activity)}</p>
                    </div>

                    <div className="client-card__signals">
                        <span className="client-card__footer-label">Контекст</span>
                        <div className="client-card__signals-list">
                            {clientSignals.map(signal => (
                                <div key={signal.label} className="client-card__signal-item">
                                    <span className="client-card__signal-label">{signal.label}</span>
                                    <span className={`client-card__signal-value ${signal.isStub ? 'client-card__signal-value--stub' : ''}`}>
                                        {signal.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default inject('clientsStore', 'clientsController')(observer(ClientCard));
