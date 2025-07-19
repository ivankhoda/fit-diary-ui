/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable init-declarations */
import React, { useEffect, useState } from 'react';
import LogoutIcon from '../../../icons/logout';
import Dropdown from '../Dropdown/Dropdown';
import './Header.style.scss';
import { useLogout } from '../../Auth/logout';
import { isOnline, onNetworkChange } from '../../../utils/network';
import { toast } from 'react-toastify';

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

        let listener: any;
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

    return (
        <header className="header">
            <nav className="header__menu">
                <div className="header__left">
                    <Dropdown />
                </div>

                <div className="header__right">
                    {!connected && (
                        <span className="header__offline">
                            🔴 Нет подключения
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
