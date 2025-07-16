
import React, { useCallback } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './BackButton.style.scss';
import { triggerImpact } from '../../../utils/haptics';

const BackButton: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        triggerImpact();
        if (window.history.length > 1) {
            // eslint-disable-next-line no-magic-numbers
            navigate(-1);
        } else {
            navigate('/');
        }
    }, [navigate]);

    return (
        <button className="back-button" onClick={handleClick}>
            <FaArrowLeft size={16} className="back-button__icon" />
            <span className="back-button__text">Назад</span>
        </button>
    );
};

export default BackButton;
