/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect, useCallback } from 'react';
import { observer, inject } from 'mobx-react';
import { useTranslation } from 'react-i18next';

import UserStore from '../../../store/userStore';
import UserController from '../../../controllers/UserController';
import './UserProfile.style.scss';
import BackButton from '../../Common/BackButton/BackButton';

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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!user) {
            userController?.getUser();
        }
    }, [user, userController]);

    // Синхронизируем локальные стейты с изменениями профиля пользователя из MobX
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setTelegramUsername(user.telegram_username || '');
            setPhoneNumber(user.phone_number || '');
        }
    }, [user]);

    const handleSubmit = useCallback(async() => {
        try {
            await userController?.updateUser({
                first_name: firstName,
                last_name: lastName,
                telegram_username: telegramUsername,
                // eslint-disable-next-line sort-keys
                phone_number: phoneNumber,
            });

            setSuccess(t('Обновлено'));
            setError('');
        } catch (e) {
            setError(t('Ошибка при обновлении профиля'));
            setSuccess('');
        }
    }, [firstName,
        lastName,
        telegramUsername,
        phoneNumber,
        userController,
        t]);

    return (
        <>
            <BackButton />
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
                        onChange={e => setFirstName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>{t('Фамилия')}</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>{t('Телеграм')}</label>
                    <input
                        type="text"
                        value={telegramUsername}
                        onChange={e => setTelegramUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>{t('Телефон')}</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <button type="button" onClick={handleSubmit}>
                        {t('Сохранить')}
                    </button>
                </div>
            </div>
        </>
    );
};

export default inject('userStore', 'userController')(observer(UserProfile));
