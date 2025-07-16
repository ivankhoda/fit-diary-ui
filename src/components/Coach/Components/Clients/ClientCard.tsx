/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
import React, { useCallback } from 'react';
import { ClientInterface } from '../../store/clientsStore';
import { FaTrash } from 'react-icons/fa';
import { clientsController } from '../../controllers/global';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import './ClientCard.scss';
import { useNavigate } from 'react-router';
import { formatDate } from '../../../Common/date/formatDate';

const getActivityStatus = (lastActive: string) => {
    const days = (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24);

    if (days < 3) {return { status: 'Активен', color: 'green' };}
    if (days < 7) {return { status: 'Малоактивен', color: 'orange' };}
    return { status: 'Неактивен', color: 'red' };
};

const ClientCard = ({ client }: { client: ClientInterface }): JSX.Element => {
    const navigate = useNavigate();

    const handleDelete = useCallback(() => {
        // eslint-disable-next-line no-alert
        if (confirm(`Удалить спортсмена ${client.email}?`)) {
            clientsController.removeClient(client.id);
        }
    }, [client.id, client.email]);

    const handleClick = useCallback(() => {
        navigate(`/coach/clients/${client.id}`);
    }, [client.id]);

    const activity = getActivityStatus(client.lastActive || client.updatedAt || client.createdAt);
    console.log(client);
    return (
        <div className="client-card" onClick={handleClick}>
            <div className="client-card__header">
                <h4>{client.name || 'Без имени'}</h4>
                <span className={`status-dot ${activity.color}`} title={activity.status}></span>
            </div>

            <p className="client-card__email">{client.email}</p>
            <div>
                <p><strong>Назначенные планы:</strong></p>
                {client.assigned_plans_by_coach?.length > 0
                    ? client.assigned_plans_by_coach.map(plan => (
                        <p key={plan.id}>{plan.name}</p>
                    ))
                    : <p>—</p>
                }
            </div>

            <p><strong>Прогресс:</strong> {client.completedWorkouts || 0} / {client.totalWorkouts || 0}</p>
            <p><strong>Последняя:</strong> {formatDate(client.lastWorkoutDate)}</p>
            <p><strong>Следующая:</strong> {formatDate(client.nextWorkoutDate)}</p>
            <button onClick={handleDelete} className="client-card__delete-button">
                <FaTrash />
            </button>
        </div>
    );
};

export default inject('clientsStore', 'clientsController')(observer(ClientCard));
