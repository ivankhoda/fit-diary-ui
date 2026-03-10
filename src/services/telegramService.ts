/* eslint-disable no-negated-condition */
/**
 * Telegram Mini App service.
 *
 * Wraps window.Telegram.WebApp with safe helpers so the rest of the app
 * works both inside Telegram and in a regular browser (dev / web fallback).
 */

import { ThemeParams, WebApp, WebAppUser } from 'telegram-web-app';

/*
 * The SDK is loaded via the <script> tag in index.html.
 * @types/telegram-web-app provides the global type definition.
 */
const tg = (): WebApp | null => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        return window.Telegram.WebApp;
    }
    return null;
};

/** Returns true when running inside a Telegram webview. */
export const isTelegramApp = (): boolean => {
    const webApp = tg();
    // InitData is populated only when opened from Telegram
    return Boolean(webApp && webApp.initData !== '');
};

/** Call once on app start to signal Telegram the app is ready. */
export const telegramReady = (): void => {
    tg()?.ready();
    // Expand to full height automatically
    tg()?.expand();
};

// ─── Theme ───────────────────────────────────────────────────────────────────

/** Current Telegram color scheme: 'light' | 'dark' */
export const getTelegramColorScheme = (): 'light' | 'dark' => tg()?.colorScheme ?? 'light';

/** CSS variables injected by Telegram (bg_color, text_color, etc.) */
export const getTelegramThemeParams = (): ThemeParams | null => tg()?.themeParams ?? null;

// ─── User ─────────────────────────────────────────────────────────────────────

/** Telegram user from WebApp.initDataUnsafe. Present only inside Telegram. */
export const getTelegramUser = (): WebAppUser | null => tg()?.initDataUnsafe?.user ?? null;

/**
 * Raw initData string — send this to your backend for server-side validation.
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export const getTelegramInitData = (): string => tg()?.initData ?? '';

// ─── Back Button ─────────────────────────────────────────────────────────────

export const showBackButton = (onClick: () => void): void => {
    const btn = tg()?.BackButton;

    if (!btn) {return;}
    btn.show();
    btn.onClick(onClick);
};

export const hideBackButton = (): void => {
    tg()?.BackButton?.hide();
};

// ─── Main Button (bottom CTA) ─────────────────────────────────────────────────

export interface MainButtonOptions {
    text: string;
    color?: string;
    textColor?: string;
    isActive?: boolean;
    isVisible?: boolean;
}

export const setMainButton = (options: MainButtonOptions, onClick: () => void): void => {
    const btn = tg()?.MainButton;

    if (!btn) {return;}
    btn.setText(options.text);
    if (options.color) {btn.setParams({ color: options.color });}
    if (options.textColor) {btn.setParams({ text_color: options.textColor });}
    btn.onClick(onClick);
    if (options.isActive !== false) {btn.enable();} else {btn.disable();}
    if (options.isVisible !== false) {btn.show();} else {btn.hide();}
};

export const hideMainButton = (): void => {
    tg()?.MainButton?.hide();
};

// ─── Haptics ──────────────────────────────────────────────────────────────────

export const hapticImpact = (style: 'light' | 'medium' | 'heavy' = 'light'): void => {
    tg()?.HapticFeedback?.impactOccurred(style);
};

export const hapticNotification = (type: 'error' | 'success' | 'warning'): void => {
    tg()?.HapticFeedback?.notificationOccurred(type);
};

// ─── Alerts / popups ──────────────────────────────────────────────────────────

/** Shows a native Telegram popup instead of window.alert */
export const showTelegramAlert = (message: string, callback?: () => void): void => {
    const webApp = tg();

    if (webApp) {
        webApp.showAlert(message, callback);
    } else {
        // eslint-disable-next-line no-alert
        window.alert(message);
        callback?.();
    }
};

export const showTelegramConfirm = (message: string, callback: (confirmed: boolean) => void): void => {
    const webApp = tg();

    if (webApp) {
        webApp.showConfirm(message, callback);
    } else {
        // eslint-disable-next-line no-alert
        const result = window.confirm(message);
        callback(result);
    }
};

// ─── Close ────────────────────────────────────────────────────────────────────

export const closeTelegramApp = (): void => {
    tg()?.close();
};
