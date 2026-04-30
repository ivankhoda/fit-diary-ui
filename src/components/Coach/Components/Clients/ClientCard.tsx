
import React, { MouseEvent, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { ClientInterface } from '../../store/clientsStore';
import { FaTrash } from 'react-icons/fa';
import { clientsController } from '../../controllers/global';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import './ClientCard.scss';
import { useNavigate } from 'react-router';
import DecisionBlock from './DecisionBlock';
import ClientGoalsBlock from './ClientGoalsBlock';

const ClientCard = ({ client }: { client: ClientInterface }): JSX.Element => {
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

                        <div className="client-card__title-row">
                            <h4 className="client-card__name">{client.name || t('clientCard.no_name')}</h4>
                        </div>

                        {secondaryContacts.map(contact => (
                            <span key={contact} className="client-card__meta-chip">{contact}</span>
                        ))}
                        <p className="client-card__email">{client.email}</p>
                        <DecisionBlock decision={decision} alerts={alerts} t={t} />

                        {Array.isArray(client.goals_summary) && client.goals_summary.length > 0 && (
                            <ClientGoalsBlock goals={client.goals_summary} t={t} />
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
