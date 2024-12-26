import React, { ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Registration.style.scss';

type Form = {
    setToken: (token: string | null) => void;
};

export const Registration: React.FC<Form> = ({ setToken }): ReactNode => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const MIN_PASSWORD_LENGTH = 8;

    const registerUser = async(credentials: {
        user: {
            email: string | undefined;
            password: string | undefined;
            password_confirmation: string | undefined;
        };
    }) => {
        const response = await fetch('http://localhost:3000/api/users', {
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        const data = await response.json();

        if (!response.ok) {
            // If server returned errors, set them
            setErrors(data.errors || []);
            return null;
        }

        return data.jwt;
    };

    const handleSubmit = useCallback(async(event: React.FormEvent) => {
        event.preventDefault();
        setErrors([]);


        if (password.length < MIN_PASSWORD_LENGTH) {
            setErrors([`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`]);
            return;
        }

        if (password !== confirmPassword) {
            setErrors(['Passwords do not match.']);
            return;
        }


        const token = await registerUser({
            user: {
                email,
                password,
                password_confirmation: confirmPassword,
            },
        });

        if (token) {
            setToken(token);
        }
    }, [email,
        password,
        confirmPassword,
        setToken]);

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }, []);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    const handleConfirmPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }, []);

    return (
        <div className="register-form">
            <p className="form-title">{t('register')}</p>
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
                        {t('password')}
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

                {/* Display errors */}
                {errors.length > 0 && (
                    <div className="form-error">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}

                <div className="form-group">
                    <button className="form-button" type="submit" disabled={!email || !password || !confirmPassword}>
                        {t('button_register')}
                    </button>
                </div>
            </form>
        </div>
    );
};
