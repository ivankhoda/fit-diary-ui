import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './Login.style.scss';
import { useNavigate } from 'react-router';
import getApiBaseUrl from '../../utils/apiUrl';
import BackButton from '../Common/BackButton/BackButton';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import UserController from '../../controllers/UserController';
import UserStore from '../../store/userStore';

type FormProps = {
    setToken: (token: string | null) => void;
    isAdmin: () => boolean;
    userStore?: UserStore;
    userController?: UserController;
};

export const LoginComponent: React.FC<FormProps> = ({ setToken, isAdmin,  userController  }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);

    const handleSubmit = useCallback(
        async(event: React.FormEvent) => {
            event.preventDefault();
            setError(null);
            setMessage(null);

            const success = await userController?.login({ email, password });

            if (success) {
                // Get the token from localStorage and update the App component's state
                const token = localStorage.getItem('token');

                if (token) {
                    setToken(token);
                }

                if (isAdmin()) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(t('something_went_wrong'));
            }
        },
        [email,
            password,
            setToken,
            isAdmin,
            navigate,
            userController,
            t]
    );
    const handleRecoverySubmit = useCallback(
        async(event: React.FormEvent) => {
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

    const toggleForm = useCallback(() => {
        navigate('/registration');
    }, []);

    const handleSetEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handleSetPassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    return (
        <div className="login-wrapper">
            <div className="login-form">
                <div className="form-header">
                    <BackButton/>
                    <h1 className="form-title">
                        {isRecoveryMode ? t('password_recovery') : t('login_first')}
                    </h1>
                </div>

                {message && <div className="form-message success">{message}</div>}
                {error && <div className="form-message error">{error}</div>}

                <div className="form-content">
                    {isRecoveryMode
                        ? (
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
                                            onChange={handleSetEmail}
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
                        )
                        : (
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
                                            onChange={handleSetEmail}
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
                                            onChange={handleSetPassword}
                                        />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <button className="form-button" type="submit" disabled={!email || !password}>
                                        {t('button_ok')}
                                    </button>
                                </div>
                                <div className="form-recovery">
                                    <button type="button" className="form-button" onClick={handleSwitchToRecovery}>
                                        {t('forgot_password')}
                                    </button>
                                </div>
                                <button className="toggle-button" onClick={toggleForm}>
                                    {t('auth.no_account')}
                                </button>
                            </form>
                        )}
                </div>
            </div>
        </div>
    );
};

export const Login = inject('userStore', 'userController')(observer(LoginComponent));
