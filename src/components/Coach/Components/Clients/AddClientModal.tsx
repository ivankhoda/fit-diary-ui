import { inject, observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { clientsController } from '../../controllers/global';
import './AddClientModal.scss';

const AddClientModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): JSX.Element | null => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = useCallback(() => {
        if (!email.trim()) {
            setError('Email обязателен');
            return;
        }
        if (!code.trim()) {
            setError('Код обязателен');
            return;
        }

        clientsController.addClient(email, code);
        setEmail('');
        setCode('');
        setError('');
        onClose();
    }, [email,
        code,
        onClose]);

    const handleSetEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
    }, []);

    const handleSetCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.toUpperCase());
        setError('');
    }, []);

    const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    if (!isOpen) {return null;}

    return (
        <div className="add-client-modal-overlay" onClick={handleOutsideClick}>
            <div className="add-client-modal">
                <h3 className="modal-title">Добавить спортсмена</h3>

                <input
                    className="modal-input"
                    placeholder="Email клиента"
                    value={email}
                    onChange={handleSetEmail}
                    type="email"
                />

                <input
                    className="modal-input"
                    placeholder="Код подтверждения"
                    value={code}
                    onChange={handleSetCode}
                    maxLength={6}
                    style={{ textTransform: 'uppercase' }}
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
