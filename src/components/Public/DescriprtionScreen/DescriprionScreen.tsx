import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NavigateFunction, useNavigate } from 'react-router';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import PublicMenu from '../Dropdown/PublicMenu';
import { TelegramLoginButton } from '../../Auth/TelegramLoginButton/TelegramLoginButton';
import { TelegramRegisterButton } from '../../Auth/TelegramRegisterButton/TelegramRegisterButton';
import UserController from '../../../controllers/UserController';
import getApiBaseUrl from '../../../utils/apiUrl';

const MIN_PASSWORD_LENGTH = 8;

const validateRegistration = (password: string, confirmPassword: string): string[] => {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return [`Пароль должен быть минимум ${MIN_PASSWORD_LENGTH} символов.`];
    }
    if (password !== confirmPassword) {
        return ['Пароли не совпадают.'];
    }
    return [];
};

const useRegistrationForm = ({
    setToken,
    userController,
}: {
    setToken: (token: string | null) => void;
    userController?: UserController;
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = useCallback(async(event: React.FormEvent) => {
        event.preventDefault();
        setErrors([]);

        const validationErrors = validateRegistration(password, confirmPassword);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const result = await userController?.register({ email, password, password_confirmation: confirmPassword });

        if (!result || result.errors.length > 0) {
            if (result?.errors.length) { setErrors(result.errors); }
            return;
        }

        if (result.success) {
            const token = localStorage.getItem('token');

            if (token) { setToken(token); }
        }
    }, [email,
        password,
        confirmPassword,
        setToken,
        userController]);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }, []);

    return {
        confirmPassword,
        email,
        errors,
        handleConfirmPasswordChange,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit,
        password,
        setErrors,
    };
};

type Props = {
    setToken: (token: string | null) => void;
    isAdmin: () => boolean;
    userController?: UserController;
};

type FormDeps = {
    setToken: (token: string | null) => void;
    isAdmin: () => boolean;
    userController?: UserController;
    navigate: NavigateFunction;
    t: (key: string) => string;
};

const useLoginForm = ({ setToken, isAdmin, userController, navigate, t }: FormDeps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = useCallback(async(event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        const success = await userController?.login({ email, password });

        if (success) {
            const token = localStorage.getItem('token');

            if (token) {
                setToken(token);
            }

            navigate(isAdmin() ? '/admin' : '/');
        } else {
            setError(t('something_went_wrong'));
        }
    }, [
        email,
        password,
        setToken,
        isAdmin,
        navigate,
        userController,
        t,
    ]);

    const handleRecoverySubmit = useCallback(async(event: React.FormEvent) => {
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
    }, [email, t]);

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

    const handleSetEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handleSetPassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    return {
        email,
        error,
        errors,
        handleRecoverySubmit,
        handleSetEmail,
        handleSetPassword,
        handleSubmit,
        handleSwitchToLogin,
        handleSwitchToRecovery,
        isRecoveryMode,
        message,
        password,
        setErrors,
    };
};

type RegisterFormProps = ReturnType<typeof useRegistrationForm> & {
    onSwitchToLogin: () => void;
    setToken: (token: string | null) => void;
};

const RegisterForm = ({
    email: regEmail,
    password: regPassword,
    confirmPassword: regConfirmPassword,
    errors: regErrors,
    setErrors: setRegErrors,
    handleSubmit: handleRegisterSubmit,
    handleEmailChange: handleRegEmailChange,
    handlePasswordChange: handleRegPasswordChange,
    handleConfirmPasswordChange: handleRegConfirmPasswordChange,
    onSwitchToLogin,
    setToken,
}: RegisterFormProps): React.ReactElement => {
    const { t } = useTranslation();

    return (
        <>
            <TelegramRegisterButton setToken={setToken} onErrors={setRegErrors}/>
            {regErrors.length > 0 && (
                <div className="form-message error">
                    {regErrors.map((e, i) => <div key={i}>{e}</div>)}
                </div>
            )}
            <div className="auth-divider"><span>{t('auth.or')}</span></div>
            <form id="register" onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                    <label htmlFor="reg-email" className="form-label">
                        {t('email')}
                        <input id="reg-email" className="form-input" type="email" value={regEmail} onChange={handleRegEmailChange}/>
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="reg-password" className="form-label">
                        {`${t('password')} (${t('characters_min', { count: MIN_PASSWORD_LENGTH })})`}
                        <input id="reg-password" className="form-input" type="password" value={regPassword} onChange={handleRegPasswordChange}/>
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="reg-confirm-password" className="form-label">
                        {t('confirm_password')}
                        <input
                            id="reg-confirm-password"
                            className="form-input"
                            type="password"
                            value={regConfirmPassword}
                            onChange={handleRegConfirmPasswordChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <button className="form-button" type="submit" disabled={!regEmail || !regPassword || !regConfirmPassword}>
                        {t('button_register')}
                    </button>
                </div>
            </form>
            <p className="auth__legal">
                Регистрируясь, вы принимаете{' '}
                <a href="https://planka.tech/terms-of-use" target="_blank" rel="noreferrer">условия использования</a> и{' '}
                <a href="https://planka.tech/privacy-policy" target="_blank" rel="noreferrer">политику конфиденциальности</a>.
            </p>
            <button className="toggle-button" onClick={onSwitchToLogin}>
                {t('auth.have_account')}
            </button>
        </>
    );
};

type LoginFormProps = Omit<ReturnType<typeof useLoginForm>, 'password'> & {
    password: string;
    onSwitchToRegister: () => void;
    setToken: (token: string | null) => void;
};

const LoginFooter = ({
    email,
    password,
    error,
    message,
    isRecoveryMode,
    errors,
    setErrors,
    handleSubmit,
    handleRecoverySubmit,
    handleSwitchToRecovery,
    handleSwitchToLogin,
    handleSetEmail,
    handleSetPassword,
    onSwitchToRegister,
    setToken,
}: LoginFormProps): React.ReactElement => {
    const { t } = useTranslation();

    return (
        <>
            {message && <div className="form-message success">{message}</div>}
            {error && <div className="form-message error">{error}</div>}
            {isRecoveryMode
                ? (
                    <form id="recovery" onSubmit={handleRecoverySubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                {t('enter_email')}
                                <input id="email" className="form-input" type="email" name="email" value={email} onChange={handleSetEmail}/>
                            </label>
                        </div>
                        <div className="form-group">
                            <button className="form-button" type="submit" disabled={!email}>{t('send_recovery_email')}</button>
                        </div>
                        <div className="form-recovery">
                            <button type="button" className="form-recovery-link" onClick={handleSwitchToLogin}>{t('back_to_login')}</button>
                        </div>
                    </form>
                )
                : (
                    <>
                        <TelegramLoginButton setToken={setToken} onErrors={setErrors}/>
                        {errors.length > 0 && (
                            <div className="form-message error">
                                {errors.map((e, i) => <div key={i}>{e}</div>)}
                            </div>
                        )}
                        <div className="auth-divider"><span>{t('auth.or')}</span></div>
                        <form id="login" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="login_input" className="form-label">
                                    {t('login')}
                                    <input id="login_input" className="form-input" type="text" name="login" value={email} onChange={handleSetEmail}/>
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
                                <button className="form-button" type="submit" disabled={!email || !password}>{t('button_ok')}</button>
                            </div>
                            <div className="form-recovery">
                                <button type="button" className="form-button" onClick={handleSwitchToRecovery}>{t('forgot_password')}</button>
                            </div>
                        </form>
                        <button className="toggle-button" onClick={onSwitchToRegister}>{t('auth.no_account')}</button>
                    </>
                )
            }
        </>
    );
};

const DescriptionScreenComponent = ({ setToken, isAdmin, userController }: Props): React.ReactElement => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const loginForm = useLoginForm({ isAdmin, navigate, setToken, t, userController });
    const regForm = useRegistrationForm({ setToken, userController });

    const textWithLineBreaks = t('desc.text').split('\n').map((item, index) => (
        <React.Fragment key={index}>
            {item}
            <br />
        </React.Fragment>
    ));

    const formsRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = formsRef.current;

        if (!el) {return;}

        const updateMinHeight = () => {
            let max = 0;
            for (const child of Array.from(el.children)) {
                max = Math.max(max, (child as HTMLElement).offsetHeight);
            }
            el.style.minHeight = `${max}px`;
        };

        const ro = new ResizeObserver(updateMinHeight);
        Array.from(el.children).forEach(child => ro.observe(child));
        updateMinHeight();

        // eslint-disable-next-line consistent-return
        return () => { ro.disconnect(); };
    }, []);

    const handleToRegistration = useCallback(() => { setIsRegisterMode(true); }, []);
    const handleToLogin = useCallback(() => { setIsRegisterMode(false); }, []);

    return (
        <div className="description-container">
            <div className="description-header">
                <h1 className="description-title">{t('desc.title')}</h1>
                <PublicMenu/>
            </div>
            <div className="description-content">
                <div className="description-text">{textWithLineBreaks}</div>
            </div>
            <div className="description-footer">
                <div className="description-footer__forms" ref={formsRef}>
                    <div className={`description-footer__form${isRegisterMode ? '' : ' description-footer__form--active'}`}>
                        <LoginFooter {...loginForm} onSwitchToRegister={handleToRegistration} setToken={setToken}/>
                    </div>
                    <div className={`description-footer__form${isRegisterMode ? ' description-footer__form--active' : ''}`}>
                        <RegisterForm {...regForm} onSwitchToLogin={handleToLogin} setToken={setToken}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DescriptionScreen = inject('userController')(observer(DescriptionScreenComponent));
