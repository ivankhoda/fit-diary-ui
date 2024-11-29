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
            <App />
        </I18nextProvider>
    </Provider>
);
