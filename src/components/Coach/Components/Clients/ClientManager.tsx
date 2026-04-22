import React, { useCallback, useState } from 'react';
import AddClientModal from './AddClientModal';
import ClientList from './ClientList/ClientList';
import InvitationList from './InvitationList';
import './ClientManager.style.scss';

const ClientManager = (): JSX.Element => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddClientClick = useCallback(() => setModalOpen(true), []);
    const handleCloseModal = useCallback(() => setModalOpen(false), []);

    return (
        <div className="client-manager">
            <div className="client-manager__header">
                <h2 className="client-manager__title">Мои спортсмены</h2>
                <button
                    className="client-manager__add-button"
                    onClick={handleAddClientClick}
                >
                    + Создать ссылку
                </button>
            </div>

            <div className="client-manager__section">
                <h3 className="client-manager__section-title">Активные приглашения</h3>
                <InvitationList />
            </div>

            <div className="client-manager__section">
                <h3 className="client-manager__section-title">Список спортсменов</h3>
                <ClientList />
            </div>

            <AddClientModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default ClientManager;
