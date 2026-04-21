import React, { useCallback, useRef, useState } from 'react';
import './LandingPage.style.scss';
import interface_image from '../images/interface_image.webp';
import benefits_image from '../images/benefits_image.webp';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { TelegramRegisterButton } from '../components/Auth/TelegramRegisterButton/TelegramRegisterButton';
import UserController from '../controllers/UserController';
import { getAccessToken } from '../services/authSession';

const MIN_PASSWORD_LENGTH = 8;

const validateRegForm = (password: string, confirmPassword: string): string[] => {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return [`Пароль должен быть минимум ${MIN_PASSWORD_LENGTH} символов.`];
    }
    if (password !== confirmPassword) {
        return ['Пароли не совпадают.'];
    }
    return [];
};

type RegisterFormProps = {
    setToken: (token: string | null) => void;
    userController?: UserController;
    onBack: () => void;
};

const LandingRegisterForm = ({ setToken, userController, onBack }: RegisterFormProps): React.ReactElement => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = useCallback(async(event: React.FormEvent) => {
        event.preventDefault();
        setErrors([]);
        const validationErrors = validateRegForm(password, confirmPassword);

        if (validationErrors.length > 0) { setErrors(validationErrors); return; }

        const result = await userController?.register({ email, password, password_confirmation: confirmPassword });

        if (!result || result.errors.length > 0) {
            if (result?.errors.length) { setErrors(result.errors); }
            return;
        }
        if (result.success) {
            setToken(getAccessToken());
        }
    }, [email,
        password,
        confirmPassword,
        setToken,
        userController]);

    return (
        <div className="landing__register">
            <h2 className="landing__register-title">Создать аккаунт</h2>
            <TelegramRegisterButton setToken={setToken} onErrors={setErrors}/>
            {errors.length > 0 && (
                <div className="landing__register-errors">
                    {errors.map((e, i) => <p key={i}>{e}</p>)}
                </div>
            )}
            <div className="landing__register-divider"><span>или</span></div>
            <form onSubmit={handleSubmit}>
                <div className="landing__register-group">
                    <label htmlFor="lp-email" className="landing__register-label">
                        Email
                        <input id="lp-email" className="landing__register-input" type="email" value={email}
                            onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), [])}/>
                    </label>
                </div>
                <div className="landing__register-group">
                    <label htmlFor="lp-password" className="landing__register-label">
                        {`Пароль (минимум ${MIN_PASSWORD_LENGTH} символов)`}
                        <input id="lp-password" className="landing__register-input" type="password" value={password}
                            onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), [])}/>
                    </label>
                </div>
                <div className="landing__register-group">
                    <label htmlFor="lp-confirm" className="landing__register-label">
                        Подтвердите пароль
                        <input id="lp-confirm" className="landing__register-input" type="password" value={confirmPassword}
                            onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value), [])}/>
                    </label>
                </div>
                <button className="landing__register-submit" type="submit"
                    disabled={!email || !password || !confirmPassword}>
                    Зарегистрироваться
                </button>
            </form>
            <p className="landing__register-legal">
                Регистрируясь, вы принимаете{' '}
                <a href="https://planka.tech/terms-of-use" target="_blank" rel="noreferrer">условия использования</a>{' '}и{' '}
                <a href="https://planka.tech/privacy-policy" target="_blank" rel="noreferrer">политику конфиденциальности</a>.
            </p>
            <button className="landing__register-back" type="button" onClick={onBack}>
                Уже есть аккаунт? Войти
            </button>
        </div>
    );
};

const SCROLL_DELAY_MS = 50;

type Props = {
    setToken: (token: string | null) => void;
    userController?: UserController;
};

const LandingPageComponent: React.FC<Props> = ({ setToken, userController }) => {
    const [showRegister, setShowRegister] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const handleRegisterClick = useCallback(() => {
        setShowRegister(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), SCROLL_DELAY_MS);
    }, []);

    const handleBack = useCallback(() => { setShowRegister(false); }, []);

    return (
        <div className="landing">
            <section className="landing__hero">
                <h1 className="landing__title">Planka — помощник в спорте</h1>
                <p className="landing__subtitle">
          Инструмент для тренеров и спортсменов. Планируй, отслеживай, прогрессируй.
                </p>
                <button onClick={handleRegisterClick} className="landing__cta-button">
          Начать бесплатно
                </button>
                <img
                    src={interface_image}
                    alt="Интерфейс приложения"
                    className="landing__image"
                />
            </section>

            <section className="landing__benefits">
                <h2 className="landing__section-title">Почему Planka?</h2>
                <ul className="landing__benefit-list">
                    <li className="landing__benefit-item">⚡ Быстрый старт без верификации</li>
                    <li className="landing__benefit-item">📈 Отслеживание прогресса и целей</li>
                    <li className="landing__benefit-item">🧩 Конструктор тренировок и планов</li>
                </ul>
                <img
                    src="/images/benefits.webp"
                    alt="Преимущества приложения"
                    className="landing__image"
                />
            </section>

            <section className="landing__how">
                <h2 className="landing__section-title">Как это работает?</h2>
                <div className="landing__steps">
                    <div className="landing__step">
                        <h3>1. Зарегистрируйся</h3>
                        <p>Создай аккаунт без лишних шагов.</p>
                    </div>
                    <div className="landing__step">
                        <h3>2. Добавь упражнения и планы</h3>
                        <p>Используй встроенный редактор тренировок.</p>
                    </div>
                    <div className="landing__step">
                        <h3>3. Следи за прогрессом</h3>
                        <p>Смотри аналитику, достигай целей.</p>
                    </div>
                </div>
                <img
                    src={benefits_image}
                    alt="плюсы"
                    className="landing__image"
                />
            </section>

            <section className="landing__who">
                <h2 className="landing__section-title">Кому подойдёт?</h2>
                <div className="landing__audience">
                    <p>💪 Любителям спорта — персональный трекер прогресса</p>
                    <p>🎯 Тренерам — платформа для ведения спортсменов</p>
                </div>
            </section>

            <section className="landing__cta">
                <h2>Начни прямо сейчас</h2>
                <p>Бесплатно. Без ограничений. Простой старт за 1 минуту.</p>
                <button
                    className="landing__cta-button landing__cta-button--large"
                    onClick={handleRegisterClick}
                >
          Зарегистрироваться
                </button>
            </section>

            <section className="landing__founder">
                <h2 className="landing__section-title">👋 От создателя</h2>
                <p>
    Привет! Меня зовут Иван, и я создаю Planka один — без команды, инвесторов и больших бюджетов.
    Просто потому, что мне не хватало удобного и простого инструмента для спорта.
                </p>
                <p>
    Я верю, что продукт может быть простым,
    честным и полезным — без перегруза,
    «социального взаимодействия», геймификации, психологических и маркетинговых уловок.
                </p>
                <p>
    Спасибо, что заглянули! Если у вас есть идеи или фидбэк — я всегда открыт. TG @ivankhoda
                </p>
            </section>

            <div ref={formRef}>
                {showRegister && (
                    <LandingRegisterForm
                        setToken={setToken}
                        userController={userController}
                        onBack={handleBack}
                    />
                )}
            </div>

            <footer className="landing__footer">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a>
                {' · '}
                <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">Условия использования</a>
            </footer>
        </div>
    );
};

export default inject('userController')(observer(LandingPageComponent));
