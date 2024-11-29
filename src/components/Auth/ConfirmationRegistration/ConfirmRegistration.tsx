import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ConfirmRegistration.style.scss';

interface ConfirmRegistrationProps {
    token: string;
    setToken?: React.Dispatch<React.SetStateAction<string>>;
}

export const ConfirmRegistration: React.FC<ConfirmRegistrationProps> = ({ token, setToken }) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = useCallback(async() => {
        try {
            const url = `http://localhost:3000/users/confirmation?confirmation_token=${token}`;

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            const data = await response.json();

            if (response.ok) {
                setToken?.(token);
                setMessage(t('confirmation_successful'));
                setError(null);
            } else {
                setError(data.errors || t('something_went_wrong'));
                setMessage(null);
            }
        } catch (err) {
            setError(t('something_went_wrong'));
            setMessage(null);
        }
    }, [token,
        setToken,
        t]);

    // Call the confirm function on component mount
    useEffect(() => {
        if (token) {
            handleConfirm();
        }
    }, [token, handleConfirm]);

    return token
        ? (
            <div className="confirm-registration-form">
                <h2>{t('confirm_registration')}</h2>
                <div className="form-group">
                    {message && <div className="form-message">{message}</div>}
                    {error && <div className="form-error">{error}</div>}
                </div>
            </div>
        )
        : null;
};
