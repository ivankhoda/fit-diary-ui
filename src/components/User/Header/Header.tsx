/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import LogoutIcon from '../../../icons/logout';
import Dropdown from '../Dropdown/Dropdown';
import './Header.style.scss';
import { useLogout } from '../../Auth/logout';
import { isOnline, onNetworkChange } from '../../../utils/network';
import { toast } from 'react-toastify';
import { exercisesController } from '../../../controllers/global';

export const Header = (): JSX.Element => {
    const logout = useLogout();
    const [connected, setConnected] = useState(true);
    const [wasDisconnected, setWasDisconnected] = useState(false);

    useEffect(() => {
        const checkStatus = async() => {
            const online = await isOnline();
            setConnected(online);
        };
        checkStatus();

        let listener: any = null;
        const subscribe = async() => {
            listener = await onNetworkChange(setConnected);
        };
        subscribe();

        return () => {
            if (listener && typeof listener.remove === 'function') {
                listener.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (connected && wasDisconnected) {
            toast.success('🔌 Подключение восстановлено');
            setWasDisconnected(false);
        } else if (!connected) {
            setWasDisconnected(true);
            toast.error('❌ Соединение потеряно');
        }
    }, [connected]);

    useEffect(() => {
        const handleOnline = async() => {
            if (connected) {
                try {
                    await exercisesController.syncOfflineQueue();
                } catch (err) {
                    console.error('Ошибка при синхронизации офлайн действий:', err);
                }
            }
        };

        handleOnline();
    }, [connected, wasDisconnected]);

    return (
        <header className="header">
            <nav className="header__menu">
                <div className="header__left">
                    <Dropdown />
                </div>

                <div className="header__right">
                    {!connected && (
                        <span className="header__offline">
                            🔴 Оффлайн режим
                        </span>
                    )}
                    <button onClick={logout}>
                        <LogoutIcon />
                    </button>
                </div>
            </nav>
        </header>
    );
};
