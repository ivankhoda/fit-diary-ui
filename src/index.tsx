import './styles.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { App } from './components/App';

import { Provider } from 'mobx-react';
import controllers from './controllers/controllers';
import en from './locales/en.json';
import ru from './locales/ru.json';
import stores from './store/stores';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { telegramReady, getTelegramThemeParams, isTelegramApp } from './services/telegramService';

// Apply Telegram CSS variables to :root so SCSS can reference them via var(--tg-theme-bg-color) etc.
if (isTelegramApp()) {
    telegramReady();
    const params = getTelegramThemeParams();

    if (params) {
        const root = document.documentElement;
        Object.entries(params).forEach(([key, value]) => {
            root.style.setProperty(`--tg-theme-${key.replace(/_/gu, '-')}`, value as string);
        });
    }
}

i18n.init({
    interpolation: {escapeValue: false},
    lng: 'ru',
    resources: {
        en: {translation: en},
        ru: {translation: ru}
    }
});

const root = createRoot(document.getElementById('root'));
const store = Object.assign(stores, controllers);

root.render(
    <Provider {...store}>
        <I18nextProvider i18n={i18n}>
            <App userStore={store.userStore} />
        </I18nextProvider>
    </Provider>
);

// Register service worker for offline support
serviceWorkerRegistration.register({
    onSuccess: () => console.log('App is ready for offline use.'),
    onUpdate: registration => {
        console.log('New version available. Updating...');
        // Auto-update to new version
        if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    },
});

