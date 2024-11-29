import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './PasswordRecovery.style.scss';

export const PasswordRecovery: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleChangeEmail = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        handleEmailChange(event);
    }, []);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSubmitForm = useCallback((event: React.FormEvent) => {
        handleSubmit(event);
    }, []);

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('http://localhost:3000/users/password', {
            body: JSON.stringify({ user: { email } }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            setMessage(t('password_reset_link_sent'));
            setError(null);
        } else {
            setError(data.errors || t('something_went_wrong'));
            setMessage(null);
        }
    };

    return (
        <div className="password-recovery-form">
            <h2>{t('password_recovery')}</h2>
            <form onSubmit={handleSubmitForm}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        {t('email')}
                        <input
                            id="email"
                            className="form-input"
                            type="email"
                            value={email}
                            onChange={handleChangeEmail}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <button className="form-button" type="submit">
                        {t('send_password_reset')}
                    </button>
                </div>
                {message && <div className="form-message">{message}</div>}
                {error && <div className="form-error">{error}</div>}
            </form>
        </div>
    );
};
