import React, { useCallback, useState } from 'react';
import AddClientModal from './AddClientModal';
import ClientList from './ClientList';
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
                    + Добавить спортсмена
                </button>
            </div>

            <ClientList />

            <AddClientModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default ClientManager;
