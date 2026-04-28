type Decision = {
    action?: string;
    alerts?: string[];
    priority?: 'high' | 'medium' | 'low';
    reason: string;
    score?: number;
};

interface ClientWithDecision extends ClientInterface {
    decision?: Decision;
    alerts?: string[];
}

const PRIORITY_MAP: Record<'high' | 'medium' | 'low', { color: string; icon: string; label: string }> = {
    high: { color: '#e53935', icon: '⬆️', label: 'Высокий' },
    low: { color: '#43a047', icon: '⬇️', label: 'Низкий' },
    medium: { color: '#fbc02d', icon: '⏺️', label: 'Средний' },
};

interface DecisionBlockProps {
    decision?: Decision;
    alerts?: string[];
    t: (key: string) => string;
}

const DecisionBlock: React.FC<DecisionBlockProps> = ({ decision, alerts, t }) => {
    if (!decision && (!alerts || alerts.length === 0)) {
        return null;
    }

    const priority =
        decision?.priority && PRIORITY_MAP[decision.priority]
            ? PRIORITY_MAP[decision.priority]
            : null;
    return (
        <>
            {decision && (
                <div className="client-card__decision-block">
                    <div className="client-card__decision-title">
                        {t('clientCard.decision_title') }:
                    </div>
                    <div
                        className="client-card__decision-priority"
                        style={{
                            alignItems: 'center',
                            color: priority?.color,
                            display: 'flex',
                            fontWeight: 600,
                            gap: 8,
                        }}
                    >
                        {priority && (
                            <span
                                className="client-card__decision-priority-icon"
                                style={{ fontSize: 18 }}
                            >
                                {priority.icon}
                            </span>
                        )}
                        <span>{priority?.label}</span>
                        {typeof decision.score === 'number' && (
                            <span
                                className="client-card__decision-score"
                                style={{
                                    color: '#888',
                                    fontSize: 13,
                                    marginLeft: 12,
                                }}
                            >
                                Score: {decision.score}
                            </span>
                        )}
                    </div>
                    <div
                        className="client-card__decision-reason"
                        style={{ fontSize: 18, fontWeight: 700, margin: '8px 0' }}
                    >
                        {decision.reason}
                    </div>
                    {decision.action && (
                        <div className="client-card__decision-action">
                            <span style={{ fontWeight: 500 }}>
                                {t('clientCard.action') || 'Действие'}:
                            </span>{' '}
                            {decision.action}
                        </div>
                    )}
                </div>
            )}
            {alerts && alerts.length > 0 && (
                <div
                    className="client-card__alerts-block"
                    style={{ margin: '12px 0 0 0' }}
                >
                    <div
                        className="client-card__alerts-title"
                        style={{ color: '#e53935', fontWeight: 600 }}
                    >
                        {t('clientCard.alerts_title') || 'Alerts'}:
                    </div>
                    <div
                        className="client-card__alerts-list"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8,
                            marginTop: 4,
                        }}
                    >
                        {alerts.map((alert, idx) => (
                            <span
                                key={alert + idx}
                                className="client-card__alert-badge"
                                style={{
                                    background: '#ffebee',
                                    borderRadius: 8,
                                    color: '#b71c1c',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    padding: '2px 10px',
                                }}
                            >
                                {alert}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
import React, { MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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

type ActivityState = {
    color: 'green' | 'orange' | 'red';
    hint: string;
    status: string;
};

const getActivityStatus = (lastActive: string, t: (key: string) => string): ActivityState => {
    const days = (Date.now() - new Date(lastActive).getTime()) / ONE_DAY_IN_MS;

    if (days < ACTIVE_DAYS_THRESHOLD) {
        return { color: 'green', hint: t('clientCard.in_rhythm'), status: t('clientCard.active') };
    }

    if (days < LOW_ACTIVITY_DAYS_THRESHOLD) {
        return { color: 'orange', hint: t('clientCard.needs_soft_control'), status: t('clientCard.slowed_down') };
    }

    return { color: 'red', hint: t('clientCard.contact_and_return'), status: t('clientCard.needs_attention') };
};

const formatDateValue = (date?: string, t?: (key: string) => string): string => {
    const val = formatDate(date || null);

    if (val) {return val;}
    return t ? t('common.dash') : '—';
};

const formatRelativeActivity = (date?: string, t?: (key: string) => string): string => {
    if (!date) {
        return t ? t('clientCard.no_data') : 'нет данных';
    }

    const daysSinceActivity = Math.floor((Date.now() - new Date(date).getTime()) / ONE_DAY_IN_MS);

    if (daysSinceActivity <= 0) {
        return t ? t('clientCard.today') : 'сегодня';
    }
    if (daysSinceActivity === 1) {
        return t ? t('clientCard.yesterday') : 'вчера';
    }
    return t ? `${daysSinceActivity} ${t('clientCard.days_ago')}` : `${daysSinceActivity} дн. назад`;
};

interface ClientWithDecision extends ClientInterface {
    decision?: Decision;
    alerts?: string[];
}

const ClientCard = ({ client }: { client: ClientWithDecision }): JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = React.useState(false);
    const handleDelete = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            setShowConfirm(true);
        },
        [],
    );

    const handleConfirmDelete = useCallback(async() => {
        const isRemoved = await clientsController.removeClient(client.id);

        if (isRemoved) {
            navigate('/clients');
        }
        setShowConfirm(false);
    }, [client.id, navigate]);

    const handleCancelDelete = useCallback(() => {
        setShowConfirm(false);
    }, []);

    const handleClick = useCallback(() => {
        navigate(`/coach/clients/${client.id}`);
    }, [client.id, navigate]);

    const activityDate =
        client.lastActive || client.updatedAt || client.createdAt || client.joined_at;
    const activity = getActivityStatus(activityDate || new Date().toISOString(), t);
    const secondaryContacts = [
        client.telegram_username ? `@${client.telegram_username}` : '', client.phone_number || '',
    ].filter(Boolean);

    const { decision, alerts: clientAlerts } = client;
    const alerts: string[] = clientAlerts || decision?.alerts || [];

    return (
        <div className="client-card" onClick={handleClick}>
            <div className="client-card__main">
                <div className="client-card__header">
                    <div className="client-card__identity">
                        {/* Decision & Alerts Block */}
                        <DecisionBlock decision={decision} alerts={alerts} t={t} />

                        <div className="client-card__title-row">
                            <h4 className="client-card__name">{client.name || t('clientCard.no_name')}</h4>
                            <span className={`client-card__status client-card__status--${activity.color}`}>
                                {activity.status}
                            </span>
                        </div>
                        <p className="client-card__email">{client.email}</p>
                        <div className="client-card__meta-row">
                            <span className="client-card__meta-chip">{t('clientCard.activity')}: {formatRelativeActivity(activityDate, t)}</span>
                            <span className="client-card__meta-chip">{t('clientCard.working_since')}
                                {formatDateValue(client.joined_at || client.createdAt, t)}</span>
                            {secondaryContacts.map(contact => (
                                <span key={contact} className="client-card__meta-chip">{contact}</span>
                            ))}
                        </div>

                        {Array.isArray(client.goals_summary) && client.goals_summary.length > 0 && (
                            <div className="client-card__goals-summary">
                                <div className="client-card__goals-summary-title">{t('clientCard.goals_title')}</div>
                                <ul className="client-card__goals-list">
                                    {client.goals_summary.map((goal, idx) => (
                                        <li key={goal.id || goal.uuid || idx} className="client-card__goal-item">
                                            <div className="client-card__goal-header-row">
                                                <span className="client-card__goal-name">{goal.name || t('clientCard.no_goal_name')}</span>
                                                {typeof goal.progress_percentage === 'number' && (
                                                    <span className="client-card__goal-progress">{goal.progress_percentage}%</span>
                                                )}
                                            </div>
                                            {goal.comment && (
                                                <div className="client-card__goal-comment">{goal.comment}</div>
                                            )}
                                            <div className="client-card__goal-details">
                                                {goal.exercise_name && (
                                                    <div className="client-card__goal-detail-row">
                                                        <span className="client-card__goal-detail-label">{goal.exercise_name}</span>
                                                    </div>
                                                )}
                                                {goal.goal_type && (
                                                    <div className="client-card__goal-detail-row">
                                                        <span className="client-card__goal-detail-label">
                                                            {t(`goal_types.${goal.goal_type}`) || goal.goal_type}
                                                        </span>
                                                    </div>
                                                )}
                                                {typeof goal.current_value === 'number' && (
                                                    <div className="client-card__goal-detail-row">
                                                        <span className="client-card__goal-detail-label">
                                                            {t('clientCard.current_value')}:
                                                        </span>
                                                        <span className="client-card__goal-detail-value">
                                                            {goal.current_value}
                                                        </span>
                                                    </div>
                                                )}
                                                {typeof goal.target_value === 'number' && (
                                                    <div className="client-card__goal-detail-row">
                                                        <span className="client-card__goal-detail-label">{t('clientCard.goal_target')}:</span>
                                                        <span className="client-card__goal-detail-value"> {goal.target_value}</span>
                                                    </div>
                                                )}
                                                {goal.deadline && (
                                                    <div className="client-card__goal-detail-row">
                                                        <span className="client-card__goal-detail-label">{t('clientCard.deadline')}:</span>
                                                        <span className="client-card__goal-detail-value"> {formatDateValue(goal.deadline, t)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleDelete}
                        className="client-card__delete-button"
                        aria-label={(t('clientCard.delete_aria') || '').replace('{{email}}', client.email)}
                    >
                        <FaTrash />
                    </button>
                    {showConfirm && (
                        <div className="client-card__confirm-modal">
                            <div className="client-card__confirm-content">
                                <div className="client-card__confirm-message">
                                    {t('clientCard.delete_confirm')?.replace('{{email}}', client.email) || `Удалить спортсмена ${client.email}?`}
                                </div>
                                <div className="client-card__confirm-actions">
                                    <button onClick={handleConfirmDelete} className="client-card__confirm-yes">
                                        {t('common.yes') || 'Да'}
                                    </button>
                                    <button onClick={handleCancelDelete} className="client-card__confirm-no">
                                        {t('common.no') || 'Нет'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default inject('clientsStore', 'clientsController')(observer(ClientCard));
