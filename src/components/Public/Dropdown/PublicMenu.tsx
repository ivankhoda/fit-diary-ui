/* eslint-disable sort-keys */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PublicMenu.style.scss';

export interface MenuOption {
  linkTo: string;
  text: string;
  icon?: string; }

const publicOptions: MenuOption[] = [
    { linkTo: '/common-exercises', text: 'Упражнения', icon: '🏋️' }, { linkTo: '/about', text: 'О приложении', icon: 'ℹ️' },
];

const PublicMenu: React.FC = () => {
    const navigate = useNavigate();

    return (
        <nav className="public-menu" aria-label="Public menu">
            {publicOptions.map(opt => (
                <button
                    key={opt.linkTo}
                    type="button"
                    className="public-menu__item"
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => navigate(opt.linkTo)}
                >
                    <span className="public-menu__icon" aria-hidden>{opt.icon}</span>
                    <span className="public-menu__title">{opt.text}</span>
                </button>
            ))}
        </nav>
    );
};

export default PublicMenu;
