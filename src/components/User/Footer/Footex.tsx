import React from 'react';
import './Footer.style.scss';
import { MenuLink } from '../Link/Link';

export const Footer = (): JSX.Element => (
    <footer className="footer">
        <MenuLink
            key={'Тренировки'}
            linkTo={'/me/workouts'}
            text={'Тренировки'}
            className="dropdown-link"
        />
        <MenuLink
            key={'Упражнения'}
            linkTo={'/me/exercises'}
            text={'Упражнения'}
            className="dropdown-link"
        />
    </footer>
);
