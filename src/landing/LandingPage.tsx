import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.style.scss';
import interface_image from '../images/interface_image.webp';
import benefits_image from '../images/benefits_image.webp';
interface LandingPageProps {
  onRegisterClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onRegisterClick }) => {
    const navigate = useNavigate();

    const handleRegisterClick = useCallback(() => {
        if (onRegisterClick) {
            onRegisterClick();
        }
        navigate('/');
    }, []);

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
                    <li className="landing__benefit-item">👥 Для тренеров и учеников</li>
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
            <footer className="landing__footer">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a>
                {' · '}
                <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">Условия использования</a>
            </footer>
        </div>
    );
};

export default LandingPage;
