import React, { useCallback } from 'react';
import './Footer.styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faRankingStar, faStopwatch20 } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { t } from 'i18next';
import { useKeyboardAvoidingFooter } from '../../Common/useKeyboardAvoidingFooter';
import { triggerImpact } from '../../../utils/haptics';
import { isIOS } from '../../../utils/isIos';

const links = [
    { icon: faDumbbell, key: 'exercises', text: 'workoutData.exercises', to: '/exercises' },
    { icon: faStopwatch20, key: 'workouts', text: 'workouts.title', to: '/workouts' },
    { icon: faRankingStar, key: 'statistics', text: 'statistics', to: '/exercises-stats' }
];

const Footer = ():JSX.Element => {
    let footerRef = React.createRef<HTMLElement>();
    if (isIOS) {
        footerRef = useKeyboardAvoidingFooter();
    }

    const handleLinkClick = useCallback(():void => {
        if (isIOS) {
            triggerImpact();
        }
    }, []);

    return (
        <footer className='footer' ref={footerRef}>
            {links.map(({ key, to, icon, text }) => (
                <Link key={key} to={to} className="footer-link" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={icon} className="footer-icon" />
                    <span className="footer-text">{t(text)}</span>
                </Link>
            ))}
        </footer>
    );};

export default Footer;
