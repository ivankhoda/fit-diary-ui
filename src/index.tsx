import './styles.scss';

import React from 'react';
import {createRoot} from 'react-dom/client';

import {Provider} from 'mobx-react';
import i18n from 'i18next';
import {I18nextProvider} from 'react-i18next';
import {App} from './components/App';
import store from './store';

import en from './locales/en.json';
import ru from './locales/ru.json';

i18n.init({
    interpolation: {escapeValue: false},
    lng: 'ru',
    resources: {
        en: {translation: en},
        ru: {translation: ru}
    }
});

const root = createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>
    </Provider>
);
