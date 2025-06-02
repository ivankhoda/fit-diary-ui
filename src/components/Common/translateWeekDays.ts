
// Import the translation function 't' from your i18n setup
import { t } from 'i18next';

export const translateWeekDays = (weekday: string): string => {
    switch (weekday) {
    case 'monday':
        return t('monday');
    case 'tuesday':
        return t('tuesday');
    case 'wednesday':
        return t('wednesday');
    case 'thursday':
        return t('thursday');
    case 'friday':
        return t('friday');
    case 'saturday':
        return t('saturday');
    case 'sunday':
        return t('sunday');
    default:
        return weekday;
    }
};
