/* eslint-disable max-statements */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect, useCallback } from 'react';
import { observer, inject } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import UserStore from '../../../store/userStore';
import UserController from '../../../controllers/UserController';
import './UserProfile.style.scss';
import { triggerImpact } from '../../../utils/haptics';

interface UserProfileProps {
  userStore?: UserStore;
  userController?: UserController;
}

const UserProfile: React.FC<UserProfileProps> = ({ userStore, userController }) => {
    const { t } = useTranslation();
    const user = userStore?.userProfile;

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [telegramUsername, setTelegramUsername] = useState(user?.telegram_username || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
    const [linkCode, setLinkCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!user) {
            userController?.getUser();
        }
    }, [user, userController]);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setTelegramUsername(user.telegram_username || '');
            setPhoneNumber(user.phone_number || '');
        }
    }, [user]);

    const handleSubmit = useCallback(async() => {
        await triggerImpact();

        const payload: Record<string, string> = {};

        if (firstName.trim()) {payload.first_name = firstName.trim();}
        if (lastName.trim()) {payload.last_name = lastName.trim();}
        if (telegramUsername.trim()) {payload.telegram_username = telegramUsername.trim();}
        if (phoneNumber.trim()) {payload.phone_number = phoneNumber.trim();}

        if (Object.keys(payload).length === 0) {
            setError(t('Нет данных для обновления'));
            setSuccess('');
            return;
        }

        try {
            const response = await userController?.updateUser(payload);

            if (response?.ok) {
                setSuccess(t('Обновлено'));
                setError('');
            } else {
                setError(response?.errors?.[0] || t('Ошибка при обновлении профиля'));
                setSuccess('');
            }
        } catch (e) {
            setError(t('Ошибка при обновлении профиля'));
            setSuccess('');
        }
    }, [
        firstName,
        lastName,
        telegramUsername,
        phoneNumber,
        userController,
        t,
    ]);

    const handleGenerateCode = useCallback(async() => {
        try {
            const response = await userController?.generateCoachLinkCode();

            if (response?.ok && response?.code) {
                setLinkCode(response.code);
                setError('');
            } else {
                setError(t('Ошибка при генерации кода'));
            }
        } catch (e) {
            setError(t('Ошибка при генерации кода'));
        }
    }, [userController, t]);

    return (
        <>
            <div className="user-profile">
                <h1>{t('Профиль')}</h1>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="form-group">
                    <label>{t('email')}</label>
                    <input type="email" value={user?.email || ''} disabled />
                </div>

                <div className="form-group">
                    <label>{t('Имя')}</label>
                    <input
                        type="text"
                        value={firstName}
                        maxLength={50}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <small>{firstName.length}/50</small>
                </div>

                <div className="form-group">
                    <label>{t('Фамилия')}</label>
                    <input
                        type="text"
                        value={lastName}
                        maxLength={50}
                        onChange={e => setLastName(e.target.value)}
                    />
                    <small>{lastName.length}/50</small>
                </div>

                <div className="form-group">
                    <label>{t('Телеграм')}</label>
                    <input
                        type="text"
                        value={telegramUsername}
                        maxLength={50}
                        onChange={e => setTelegramUsername(e.target.value)}
                    />
                    <small>{telegramUsername.length}/50</small>
                </div>

                <div className="form-group">
                    <label>{t('Телефон')}</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        maxLength={50}
                        onChange={e => setPhoneNumber(e.target.value)}
                    />
                    <small>{phoneNumber.length}/50</small>
                </div>

                <div className="form-group">
                    <button type="button" onClick={handleSubmit}>
                        {t('Сохранить')}
                    </button>
                </div>

                <div className="form-group">
                    <label>{t('Код для добавления тренером')}</label>
                    <button type="button" onClick={handleGenerateCode}>
                        {t('Сгенерировать код')}
                    </button>
                    {linkCode && (
                        <p className="code-display">
                            {t('Код')}: <strong>{linkCode}</strong>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default inject('userStore', 'userController')(observer(UserProfile));
