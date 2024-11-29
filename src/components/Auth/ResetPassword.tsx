import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ResetPassword.style.scss';

interface ResetPasswordProps {
    token: string;
    setToken?: React.Dispatch<React.SetStateAction<string>>;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ token, setToken }) => {
    const { t } = useTranslation();
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmitForm = useCallback((event: React.FormEvent) => {
        handleSubmit(event);
    }, [password, confirmPassword]);

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError(t('passwords_do_not_match'));
            return;
        }


        const response = await fetch('http://localhost:3000/users/password', {
            body: JSON.stringify({
                user: {
                    password,
                    password_confirmation: confirmPassword,
                    reset_password_token: token,
                },
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
        });

        const data = await response.json();

        if (data.ok) {
            setToken?.(token);
            setMessage(t('password_reset_successful'));
            setError(null);
        } else {
            setError(data.errors || t('something_went_wrong'));
            setMessage(null);
        }
    };

    const handleSetPassword = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        console.log('Set Password:', event.target.value);
    }, []);

    const handleConfirmPassword = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
        console.log('Set Confirm Password:', event.target.value);
    }, []);

    return token
        ? (
            <div className="reset-password-form">
                <h2>{t('reset_password')}</h2>
                <form onSubmit={handleSubmitForm}>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            {t('new_password')}
                            <input
                                id="password"
                                className="form-input"
                                type="password"
                                value={password}
                                onChange={handleSetPassword}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password" className="form-label">
                            {t('confirm_password')}
                            <input
                                id="confirm-password"
                                className="form-input"
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPassword}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <button className="form-button" type="submit">
                            {t('reset_password')}
                        </button>
                    </div>
                    {message && <div className="form-message">{message}</div>}
                    {error && <div className="form-error">{error}</div>}
                </form>
            </div>
        )
        : null;
};
