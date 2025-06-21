import React, { useCallback } from 'react';
import { ClientInterface } from '../../store/clientsStore';
import { FaTrash } from 'react-icons/fa';
import { clientsController } from '../../controllers/global';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import './ClientCard.scss';
import { useNavigate } from 'react-router';

const ClientCard = ({ client }: { client: ClientInterface }): JSX.Element => {
    const navigate = useNavigate();

    const handleDelete = useCallback(() => {
        // eslint-disable-next-line no-alert
        if (confirm(`Удалить клиента ${client.email}?`)) {
            clientsController.removeClient(client.id);
        }
    }, [client.id, client.email]);

    const handleClick = useCallback(() => {
        navigate(`/coach/clients/${client.id}`);
        console.log(`Клиент: ${client.name || 'Без имени'}, Email: ${client.email}`);
    }, [client.id]);

    return (
        <div className="client-card">
            <div className="client-card__info" onClick={handleClick}>
                <h4 className="client-card__name">{client.name || 'Без имени'}</h4>
                <p className="client-card__email">{client.email}</p>
            </div>
            <button
                onClick={handleDelete}
                className="client-card__delete-button"
                title="Удалить клиента"
            >
                <FaTrash />
            </button>
        </div>
    );
};

export default inject('clientsStore', 'clientsController')(observer(ClientCard));
