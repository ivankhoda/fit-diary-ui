import React, { ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Registration.style.scss';
import { useLocation, useNavigate } from 'react-router';
import BackButton from '../Common/BackButton/BackButton';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import UserController from '../../controllers/UserController';
import { TelegramRegisterButton } from './TelegramRegisterButton/TelegramRegisterButton';
import { getAccessToken } from '../../services/authSession';
import {
    buildCoachInvitationPath,
    resolveCoachInvitationToken,
    saveCoachInvitationToken,
} from '../../services/coachInvitation';

const MIN_PASSWORD_LENGTH = 8;

const validateRegistrationForm = (
    password: string,
    confirmPassword: string,
): string[] => {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return [`Пароль должен быть минимум ${MIN_PASSWORD_LENGTH} символов.`];
    }
    if (password !== confirmPassword) {
        return ['Пароли не совпадают.'];
    }
    return [];
};

type FormProps = {
    setToken: (token: string | null) => void;
    userController?: UserController;
};

type RegistrationCredentials = {
    email: string;
    invite_token?: string;
    password: string;
    password_confirmation: string;
};

const buildRegistrationCredentials = ({
    confirmPassword,
    email,
    invitationToken,
    password,
}: {
    confirmPassword: string;
    email: string;
    invitationToken: string | null;
    password: string;
}): RegistrationCredentials => ({
    email,
    ...(invitationToken ? { invite_token: invitationToken } : {}),
    password,
    password_confirmation: confirmPassword,
});

const getAuthRedirectPath = (path: '/login' | '/registration', invitationToken: string | null): string => {
    if (!invitationToken) {
        return path;
    }

    return `${path}?invite_token=${encodeURIComponent(invitationToken)}`;
};

const handleSuccessfulRegistration = (
    invitationToken: string | null,
    navigate: ReturnType<typeof useNavigate>,
    setToken: (token: string | null) => void,
): void => {
    if (invitationToken) {
        saveCoachInvitationToken(invitationToken);
        navigate(buildCoachInvitationPath(invitationToken, { autoAccept: true }));
    }

    setToken(getAccessToken());
};

export const RegistrationComponent: React.FC<FormProps> = ({ setToken, userController }): ReactNode => {
    const { t } = useTranslation();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const navigate = useNavigate();
    const invitationToken = resolveCoachInvitationToken(location.search);

    const handleSubmit = useCallback(async(event: React.FormEvent) => {
        event.preventDefault();
        setErrors([]);

        const validationErrors = validateRegistrationForm(password, confirmPassword);

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const result = await userController?.register(buildRegistrationCredentials({
            confirmPassword,
            email,
            invitationToken,
            password,
        }));

        if (!result || result.errors.length > 0) {
            if (result?.errors.length) {setErrors(result.errors);}
            return;
        }

        if (result.success) {
            handleSuccessfulRegistration(invitationToken, navigate, setToken);
        }
    }, [
        email,
        invitationToken,
        password,
        confirmPassword,
        navigate,
        setToken,
        userController,
    ]);

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }, []);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    const handleConfirmPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }, []);

    const toggleForm = useCallback(() => {
        if (invitationToken) {
            saveCoachInvitationToken(invitationToken);
            navigate(getAuthRedirectPath('/login', invitationToken));
            return;
        }

        navigate('/login');
    }, [invitationToken, navigate]);

    return (
        <div className="register-wrapper">
            <div className="register-form">
                <div className="form-header">
                    <BackButton/>
                    <h1 className="form-title">{t('register')}</h1>
                </div>

                <div className="form-content">
                    <TelegramRegisterButton setToken={setToken} onErrors={setErrors}/>
                    <div className="auth-divider">
                        <span>{t('auth.or')}</span>
                    </div>

                    <form id="register" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                {t('email')}
                                <input
                                    id="email"
                                    className="form-input"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                {`${t('password')} (${t('characters_min', { count: MIN_PASSWORD_LENGTH })})`}
                                <input
                                    id="password"
                                    className="form-input"
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
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
                                    onChange={handleConfirmPasswordChange}
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <button
                                className="form-button"
                                type="submit"
                                disabled={!email || !password || !confirmPassword}
                            >
                                {t('button_register')}
                            </button>
                        </div>
                        {errors.length > 0 && (
                            <div className="form-error">
                                {errors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}
                    </form>
                    <button className="toggle-button" onClick={toggleForm}>
                        {t('auth.have_account')}
                    </button>
                </div>
            </div>
            <p className="auth__legal">
                Регистрируясь, вы принимаете{' '}
                <a href="https://planka.tech/terms-of-use" target="_blank" rel="noreferrer">условия использования</a> и{' '}
                <a href="https://planka.tech/privacy-policy" target="_blank" rel="noreferrer">политику конфиденциальности</a>.
            </p>
        </div>
    );
};

export const Registration = inject('userController')(observer(RegistrationComponent));
