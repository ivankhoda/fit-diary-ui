/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { inject, observer } from 'mobx-react';
import UserController from '../../../controllers/UserController';
import { getAccessToken } from '../../../services/authSession';
import './TelegramLoginButton.style.scss';

type Props = {
    onErrors: (errors: string[]) => void;
    setToken: (token: string | null) => void;
    userController?: UserController;
};

export const TelegramLoginButtonComponent: React.FC<Props> = ({
    onErrors,
    setToken,
    userController,
}) => {
    const { t } = useTranslation();
    const widgetRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!widgetRef.current || !userController) {return;}

        widgetRef.current.innerHTML = '';

        const allowedDomains = ['http://localhost:3000',
            'https://planka.tech',
            'https://www.planka.tech',
            'https://planka.tech/api',
            'https://www.planka.tech/api',
            'https://df9e-163-5-63-252.ngrok-free.app/api',
            'https://df9e-163-5-63-252.ngrok-free.app'];
        const currentDomain = window.location.origin;

        if (!allowedDomains.includes(currentDomain)) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;

        script.setAttribute('data-telegram-login', 'plankatech_bot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-userpic', 'false');
        script.setAttribute('data-request-access', 'write');

        (window as any).onTelegramLoginAuth = async(user: any) => {
            setLoading(true);
            onErrors([]);

            try {
                const userObj = typeof user === 'string' ? JSON.parse(user) : user;

                const result = await userController.loginWithTelegramWidget(JSON.stringify(userObj));

                if (result.success) {
                    setToken(getAccessToken());
                } else {
                    onErrors(result.errors.length ? result.errors : [t('something_went_wrong')]);
                }
            } catch {
                onErrors([t('something_went_wrong')]);
            } finally {
                setLoading(false);
            }
        };

        script.setAttribute('data-onauth', 'onTelegramLoginAuth(user)');

        widgetRef.current.appendChild(script);
    }, [userController,
        onErrors,
        setToken,
        t]);

    return (
        <div className="telegram-login-button">
            <div ref={widgetRef} className="telegram-login-button__widget"></div>
            {loading && <div className="telegram-login-button__loading">{t('loading')}</div>}
        </div>
    );
};

export const TelegramLoginButton = inject('userController')(
    observer(TelegramLoginButtonComponent)
);
