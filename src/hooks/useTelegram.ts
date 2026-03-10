/* eslint-disable sort-keys */
import { useEffect, useState } from 'react';
import {
    isTelegramApp,
    getTelegramUser,
    getTelegramColorScheme,
    getTelegramThemeParams,
    telegramReady,
    showBackButton,
    hideBackButton,
    setMainButton,
    hideMainButton,
    hapticImpact,
    hapticNotification,
    MainButtonOptions,
} from '../services/telegramService';
import { WebAppUser, ThemeParams } from 'telegram-web-app';

export interface UseTelegramReturn {
    /** True when the app is launched inside Telegram */
    isTelegram: boolean;
    /** Telegram user object (null when outside Telegram or user is anonymous) */
    user: WebAppUser | null;
    /** 'light' | 'dark' — follows the Telegram client theme */
    colorScheme: 'light' | 'dark';
    /** Telegram theme CSS variables */
    themeParams: ThemeParams | null;

    showBackButton: (onBack: () => void) => void;
    hideBackButton: () => void;
    setMainButton: (options: MainButtonOptions, onClick: () => void) => void;
    hideMainButton: () => void;
    hapticImpact: (style?: 'light' | 'medium' | 'heavy') => void;
    hapticNotification: (type: 'error' | 'success' | 'warning') => void;
}

/**
 * Hook for accessing Telegram Mini App features.
 *
 * Usage:
 *   const { isTelegram, user, colorScheme } = useTelegram();
 */
export const useTelegram = (): UseTelegramReturn => {
    const [user, setUser] = useState<WebAppUser | null>(null);
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
    const [themeParams, setThemeParams] = useState<ThemeParams | null>(null);
    const [isInTelegram] = useState(() => isTelegramApp());

    useEffect(() => {
        // Signal Telegram that the app is ready (removes the loading placeholder)
        telegramReady();

        if (!isInTelegram) {return;}

        setUser(getTelegramUser());
        setColorScheme(getTelegramColorScheme());
        setThemeParams(getTelegramThemeParams());

        // Listen for theme changes (user switches dark/light in Telegram)
        const webApp = window.Telegram?.WebApp;

        if (webApp) {
            webApp.onEvent('themeChanged', () => {
                setColorScheme(getTelegramColorScheme());
                setThemeParams(getTelegramThemeParams());
            });
        }
    }, [isInTelegram]);

    return {
        isTelegram: isInTelegram,
        user,
        colorScheme,
        themeParams,
        showBackButton,
        hideBackButton,
        setMainButton,
        hideMainButton,
        hapticImpact,
        hapticNotification,
    };
};
