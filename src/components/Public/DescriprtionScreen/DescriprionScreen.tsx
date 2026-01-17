import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router';
import PublicMenu from '../Dropdown/PublicMenu';

export const DescriptionScreen = (): React.ReactElement => {
    const { t } = useTranslation();
    const textWithLineBreaks = t('desc.text').split('\n').map((item, index) => (
        <React.Fragment key={index}>
            {item}
            <br />
        </React.Fragment>
    ));
    const navigate = useNavigate();

    const proceedToAuth = useCallback(() => {
        navigate('login');
    }, []);

    return (
        <div className="description-container">
            <div className="description-header">
                <h1 className="description-title">{t('desc.title')}</h1>
                <PublicMenu/>
            </div>
            <div className="description-content">
                <div className="description-text">{textWithLineBreaks}</div>
            </div>
            <div className="description-footer">
                <button className="proceed-button" onClick={proceedToAuth}>
                    {t('desc.login')}
                </button>
            </div>
        </div>
    );
};
