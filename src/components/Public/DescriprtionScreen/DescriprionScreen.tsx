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
            <h1>{t('desc.title')}</h1>
            <PublicMenu/>
            <div>{textWithLineBreaks}</div>
            <button className="proceed-button" onClick={proceedToAuth}>
                {t('desc.login')}
            </button>
        </div>
    );
};
