import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../src/locales/en.json';
import ru from '../src/locales/ru.json';

i18n.use(initReactI18next).init({
    lng: 'ru',
    resources: {

            en: {translation: en},
            ru: {translation: ru}

    },
    // eslint-disable-next-line sort-keys
    interpolation: { escapeValue: false },
});

export default i18n;
