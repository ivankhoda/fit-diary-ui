import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './Login.style.scss';
import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from './useToken';
import getApiBaseUrl from '../../utils/apiUrl';

type FormProps = {
    setToken: (token: string | null) => void;
    isAdmin: () => boolean;
};

export const Login: React.FC<FormProps> = ({ setToken, isAdmin }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);

    const loginUser = async (credentials: { user: { email: string; password: string } }) => {
        try {
            const response = await fetch(`${getApiBaseUrl()}/users/sign_in`, {
                body: JSON.stringify(credentials),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.errors || t('login_failed'));
                return null;
            }

            setMessage(t('login_successful'));
            setError(null);
            return data.jwt;
        } catch (err) {
            setError(t('something_went_wrong'));
            return null;
        }
    };

    const handleSubmit = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();

            const token = await loginUser({
                user: { email, password },
            });

            if (token) {
                setToken(token);
                const decodedToken: DecodedToken  = jwtDecode(token)
                if (decodedToken.admin) {
                    navigate('/admin');
                    window.location.reload()
                } else {
                    navigate('/');
                    window.location.reload()
                }
            }
        },
        [email, password, setToken, isAdmin, navigate]
    );

    const handleRecoverySubmit = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();

            const response = await fetch(`${getApiBaseUrl()}/users/password`, {
                body: JSON.stringify({ user: { email } }),
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(t('password_reset_link_sent'));
                setError(null);
            } else {
                setError(data.errors || t('something_went_wrong'));
                setMessage(null);
            }

            setIsRecoveryMode(false);
        },
        [email, t]
    );

    const handleSwitchToRecovery = useCallback(() => {
        setIsRecoveryMode(true);
        setError(null);
        setMessage(null);
    }, []);

    const handleSwitchToLogin = useCallback(() => {
        setIsRecoveryMode(false);
        setError(null);
        setMessage(null);
    }, []);

    return (
        <div className="login-form">
            <p className="form-title">
                {isRecoveryMode ? t('password_recovery') : t('login_first')}
            </p>
            {message && <div className="form-message success">{message}</div>}
            {error && <div className="form-message error">{error}</div>}

            {isRecoveryMode ? (
                <form id="recovery" onSubmit={handleRecoverySubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            {t('enter_email')}
                            <input
                                id="email"
                                className="form-input"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <button className="form-button" type="submit" disabled={!email}>
                            {t('send_recovery_email')}
                        </button>
                    </div>
                    <div className="form-recovery">
                        <button type="button" className="form-recovery-link" onClick={handleSwitchToLogin}>
                            {t('back_to_login')}
                        </button>
                    </div>
                </form>
            ) : (
                <form id="login" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="login" className="form-label">
                            {t('login')}
                            <input
                                id="login_input"
                                className="form-input"
                                type="text"
                                name="login"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            {t('password')}
                            <input
                                id="password"
                                className="form-input"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <button className="form-button" type="submit" disabled={!email || !password}>
                            {t('button_ok')}
                        </button>
                    </div>
                    <div className="form-recovery">
                        <button type="button" className="form-recovery-link" onClick={handleSwitchToRecovery}>
                            {t('forgot_password')}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
