import { inject, observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { clientsController } from '../../controllers/global';
import './AddClientModal.scss';

const AddClientModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): JSX.Element | null => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = useCallback(() => {
        if (!email.trim()) {
            setError('Email обязателен');
            return;
        }

        clientsController.addClient(email);
        setEmail('');
        setError('');
        onClose();
    }, [email, onClose]);

    const handleSetEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
    }, []);

    if (!isOpen) {return null;}

    return (
        <div className="add-client-modal-overlay">
            <div className="add-client-modal">
                <h3 className="modal-title">Добавить спортсмена</h3>
                <input
                    className="modal-input"
                    placeholder="Email клиента"
                    value={email}
                    onChange={handleSetEmail}
                    type="email"
                />
                {error && <p className="modal-error">{error}</p>}

                <div className="modal-actions">
                    <button className="modal-button cancel" onClick={onClose}>Отмена</button>
                    <button className="modal-button add" onClick={handleSubmit}>Добавить</button>
                </div>
            </div>
        </div>
    );
};

export default inject('clientsStore', 'clientsController')(observer(AddClientModal));
