import React from 'react';
import { ClientInterface } from '../../../store/clientsStore';
import { formatDate } from '../../../../Common/date/formatDate';

const ACTIVE_DAYS_THRESHOLD = 3;
const LOW_ACTIVITY_DAYS_THRESHOLD = 7;
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const ONE_DAY_IN_MS = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;
const PERCENT_MULTIPLIER = 100;

type ActivityState = {
    tone: 'good' | 'idle' | 'risk';
    description: string;
    label: string;
};

type OverviewMetric = {
    label: string;
    note: string;
    value: string;
};

type OverviewSignal = {
    label: string;
    value: string;
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

const getActivityState = (lastActive?: string): ActivityState => {
    if (!lastActive) {
        return {
            description: 'клиент еще не проявлял активность в системе',
            label: 'Нет активности',
            tone: 'risk',
        };
    }

    const daysSinceActivity = (Date.now() - new Date(lastActive).getTime()) / ONE_DAY_IN_MS;

    if (daysSinceActivity < ACTIVE_DAYS_THRESHOLD) {
        return {
            description: 'держит рабочий ритм',
            label: 'Активен',
            tone: 'good',
        };
    }

    if (daysSinceActivity < LOW_ACTIVITY_DAYS_THRESHOLD) {
        return {
            description: 'темп снижается, стоит проверить контакт',
            label: 'Снизил темп',
            tone: 'idle',
        };
    }

    return {
        description: 'давно не заходил, нужен follow-up',
        label: 'Требует внимания',
        tone: 'risk',
    };
};

const getProgressLabel = (completedWorkouts = 0, totalWorkouts = 0): string => {
    if (!totalWorkouts) {
        return 'План не назначен';
    }

    const progressPercent = Math.round((completedWorkouts / totalWorkouts) * PERCENT_MULTIPLIER);
    return `${completedWorkouts}/${totalWorkouts} · ${progressPercent}%`;
};

const getCoachAction = (client: ClientInterface, activity: ActivityState): string => {
    if (!client.nextWorkoutDate) {
        return 'Назначить следующую тренировку';
    }

    if (activity.tone === 'risk') {
        return 'Связаться и вернуть в график';
    }

    if (!client.completedWorkouts && client.totalWorkouts) {
        return 'Проверить старт по текущему плану';
    }

    return 'Поддерживать темп и наблюдать';
};

const getOverviewMetrics = (client: ClientInterface, activityDate?: string): OverviewMetric[] => [
    {
        label: 'Активность',
        note: `Последний вход ${formatRelativeActivity(activityDate)}`,
        value: formatRelativeActivity(activityDate),
    },
    {
        label: 'Прогресс',
        note: 'по текущему объему',
        value: getProgressLabel(client.completedWorkouts, client.totalWorkouts),
    },
    {
        label: 'Последняя тренировка',
        note: 'факт выполнения',
        value: formatDateValue(client.lastWorkoutDate),
    },
    {
        label: 'Следующая тренировка',
        note: 'ближайшее действие',
        value: formatDateValue(client.nextWorkoutDate),
    },
];

const getOverviewSignals = (client: ClientInterface, activity: ActivityState): OverviewSignal[] => {
    const planCount = client.assigned_plans_by_coach?.length || (client.plan?.name || client.planTitle ? 1 : 0);

    return [
        {
            label: 'Цель',
            value: client.goal_summary || 'Цель пока не зафиксирована',
        },
        {
            label: 'Последний чек-ин',
            value: client.last_check_in_at ? formatDateValue(client.last_check_in_at) : 'Нет данных по чек-ину',
        },
        {
            label: 'Назначенные планы',
            value: planCount ? `${planCount}` : 'Нет активного плана',
        },
        {
            label: 'Фокус тренера',
            value: getCoachAction(client, activity),
        },
    ];
};

interface ClientOverviewProps {
    client: ClientInterface;
}

const ClientOverview = ({ client }: ClientOverviewProps): JSX.Element => {
    const activityDate = client.lastActive || client.updatedAt || client.createdAt || client.joined_at;
    const activity = getActivityState(activityDate);
    const overviewMetrics = getOverviewMetrics(client, activityDate);
    const overviewSignals = getOverviewSignals(client, activity);
    const contacts = [
        client.email,
        client.phone_number,
        client.telegram_username ? `@${client.telegram_username}` : '',
    ]
        .filter(Boolean);

    return (
        <section className="client-overview">
            <div className="client-overview__hero">
                <div className="client-overview__identity">
                    <div className={`client-overview__status client-overview__status--${activity.tone}`}>
                        {activity.label}
                    </div>
                    <h1 className="client-overview__name">{client.name || 'Без имени'}</h1>
                    <p className="client-overview__subtitle">{activity.description}</p>
                    <div className="client-overview__contacts">
                        {contacts.map(contact => (
                            <span key={contact} className="client-overview__contact-chip">{contact}</span>
                        ))}
                    </div>
                </div>

                <div className="client-overview__primary-action">
                    <span className="client-overview__primary-label">Следующее действие</span>
                    <strong className="client-overview__primary-value">{getCoachAction(client, activity)}</strong>
                    <span className="client-overview__primary-note">
                        В работе с {formatDateValue(client.joined_at || client.createdAt)}
                    </span>
                </div>
            </div>

            <div className="client-overview__metrics">
                {overviewMetrics.map(metric => (
                    <article key={metric.label} className="client-overview__metric-card">
                        <span className="client-overview__metric-label">{metric.label}</span>
                        <strong className="client-overview__metric-value">{metric.value}</strong>
                        <span className="client-overview__metric-note">{metric.note}</span>
                    </article>
                ))}
            </div>

            <div className="client-overview__signals">
                {overviewSignals.map(signal => (
                    <article key={signal.label} className="client-overview__signal-card">
                        <span className="client-overview__signal-label">{signal.label}</span>
                        <p className="client-overview__signal-value">{signal.value}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ClientOverview;
