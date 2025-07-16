import React from 'react';
import './Footer.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faRankingStar, faStopwatch20 } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { t } from 'i18next';
import { useKeyboardAvoidingFooter } from '../../Common/useKeyboardAvoidingFooter';

const links = [
    { icon: faDumbbell, key: 'exercises', text: 'workoutData.exercises', to: '/exercises' },
    { icon: faStopwatch20, key: 'workouts', text: 'workouts.title', to: '/workouts' },
    { icon: faRankingStar, key: 'statistics', text: 'statistics', to: '/exercises-stats' }
];

const Footer = ():JSX.Element => {
    const isIOS = /iPad|iPhone|iPod/u.test(navigator.userAgent) && !('MSStream' in window);
    let footerRef = React.createRef<HTMLElement>();
    if (isIOS) {
        footerRef = useKeyboardAvoidingFooter();
    }

    return (
        <footer className='footer' ref={footerRef}>
            {links.map(({ key, to, icon, text }) => (
                <Link key={key} to={to} className="footer-link">
                    <FontAwesomeIcon icon={icon} className="footer-icon" />
                    <span className="footer-text">{t(text)}</span>
                </Link>
            ))}
        </footer>
    );};

export default Footer;
