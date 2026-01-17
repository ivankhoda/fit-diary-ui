
import React, { useCallback } from 'react';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './HomeScreen.style.scss';
import { triggerImpact } from '../../../utils/haptics';

const HomeScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        triggerImpact();
        navigate('/');
    }, [navigate]);

    return (
        <button className="back-button" onClick={handleClick}>
            <FaHome size={16} className="back-button__icon" />
            <span className="back-button__text">Главный экран</span>
        </button>
    );
};

export default HomeScreen;
