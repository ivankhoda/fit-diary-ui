import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router';
import PublicMenu from '../Dropdown/PublicMenu';
import { TelegramLoginButton } from '../../Auth/TelegramLoginButton/TelegramLoginButton';

type Props = {
    setToken: (token: string | null) => void;
};

export const DescriptionScreen = ({ setToken }: Props): React.ReactElement => {
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

    const [errors, setErrors] = useState<string[]>([]);

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
                <TelegramLoginButton setToken={setToken} onErrors={setErrors}/>
                {errors.length > 0 && (
                    <div className="description-footer__errors">
                        {errors.map((e, i) => <div key={i}>{e}</div>)}
                    </div>
                )}
                <button className="proceed-button" onClick={proceedToAuth}>
                    {t('desc.login')}
                </button>
            </div>
        </div>
    );
};
