/*
 * CoachSettingsStore.ts
 * Стор для хранения пользовательских настроек тренера (например, выбранные вкладки)
 */

import { makeAutoObservable } from 'mobx';

const LOCAL_STORAGE_KEY = 'coach_settings';

export type CoachSettings = {
    clientOverviewTab?: 'overview' | 'user_workouts';
    // Можно добавить другие настройки
};

const loadSettings = (): CoachSettings => {
    if (typeof window !== 'undefined') {
        try {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY);

            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            // Ignore
        }
    }
    return {};
};

const saveSettings = (settings: CoachSettings) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    }
};

class CoachSettingsStore {
    settings: CoachSettings = loadSettings();

    constructor() {
        makeAutoObservable(this);
    }

    setClientOverviewTab(tab: 'overview' | 'user_workouts') {
        this.settings.clientOverviewTab = tab;
        saveSettings(this.settings);
    }

    get clientOverviewTab(): 'overview' | 'user_workouts' {
        return this.settings.clientOverviewTab || 'overview';
    }
}

const coachSettingsStore = new CoachSettingsStore();
export default coachSettingsStore;
