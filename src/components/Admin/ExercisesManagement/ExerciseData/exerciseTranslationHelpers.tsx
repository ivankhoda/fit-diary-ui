import React, { useCallback, useState } from 'react';
import i18n from 'i18next';

export interface TranslationEntry {
    description: string;
    name: string;
}

export const REQUIRED_LOCALE = 'ru';

export const OPTIONAL_LOCALES = [
    'en',
    'de',
    'fr',
    'es',
];

export interface MuscleGroupItemProps {
    isActive: boolean;
    name: string;
    onToggle: (name: string) => void;
}

export const MuscleGroupItem: React.FC<MuscleGroupItemProps> = ({ isActive, name, onToggle }) => {
    const handleClick = useCallback(() => onToggle(name), [name, onToggle]);

    return (
        <div onClick={handleClick} className={isActive ? 'active' : ''}>
            {i18n.t(name)}
        </div>
    );
};

export interface TranslationPanelProps {
    isRequired: boolean;
    locale: string;
    onChange: (locale: string, field: string, value: string) => void;
    onRemove: (locale: string) => void;
    value: TranslationEntry;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({ isRequired, locale, onChange, onRemove, value }) => {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onChange(locale, e.target.name, e.target.value);
        },
        [locale, onChange],
    );
    const handleRemove = useCallback(() => onRemove(locale), [locale, onRemove]);

    return (
        <div className="translation-panel">
            <div className="translation-panel-header">
                <h4>{locale.toUpperCase()}</h4>
                {!isRequired && (
                    <button type="button" className="remove-locale-btn" onClick={handleRemove}>×</button>
                )}
            </div>
            <div>
                <strong>{i18n.t('name')}</strong>
                <input
                    type="text"
                    name="name"
                    value={value.name}
                    onChange={handleChange}
                    placeholder={i18n.t('name')}
                    required={isRequired}
                />
            </div>
            <div>
                <strong>{i18n.t('description')}</strong>
                <textarea
                    name="description"
                    value={value.description}
                    onChange={handleChange}
                    placeholder={i18n.t('description')}
                    required={isRequired}
                />
            </div>
        </div>
    );
};

export interface AddLocalePanelProps {
    available: string[];
    localeToAdd: string;
    onAdd: () => void;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const AddLocalePanel: React.FC<AddLocalePanelProps> = ({ available, localeToAdd, onAdd, onChange }) => {
    if (available.length === 0) {
        return null;
    }

    return (
        <div className="add-locale-panel">
            <select value={localeToAdd} onChange={onChange} className="custom-select">
                <option value="" disabled>{i18n.t('addLocale')}</option>
                {available.map(locale => (
                    <option key={locale} value={locale}>{locale.toUpperCase()}</option>
                ))}
            </select>
            <button
                type="button"
                className="add-locale-btn"
                onClick={onAdd}
                disabled={!localeToAdd}
            >
                +
            </button>
        </div>
    );
};

const INITIAL_TRANSLATIONS: Record<string, TranslationEntry> = {
    [REQUIRED_LOCALE]: { description: '', name: '' },
};

interface LocaleTranslationsState {
    activeLocales: string[];
    availableLocalesToAdd: string[];
    handleAddLocale: () => void;
    handleLocaleToAddChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleRemoveLocale: (locale: string) => void;
    handleTranslationChange: (locale: string, field: string, value: string) => void;
    initFromTranslations: (nameTranslations?: Record<string, string>, descTranslations?: Record<string, string>) => void;
    localeToAdd: string;
    translations: Record<string, TranslationEntry>;
}

export const useLocaleTranslations = (): LocaleTranslationsState => {
    const [activeLocales, setActiveLocales] = useState<string[]>([REQUIRED_LOCALE]);
    const [localeToAdd, setLocaleToAdd] = useState('');
    const [translations, setTranslations] = useState<Record<string, TranslationEntry>>(INITIAL_TRANSLATIONS);

    const initFromTranslations = useCallback((
        nameTranslations: Record<string, string> = {},
        descTranslations: Record<string, string> = {},
    ) => {
        const locales = Array.from(new Set([
            REQUIRED_LOCALE,
            ...Object.keys(nameTranslations),
            ...Object.keys(descTranslations),
        ]));
        const merged: Record<string, TranslationEntry> = {};

        for (const locale of locales) {
            merged[locale] = {
                description: descTranslations[locale] ?? '',
                name: nameTranslations[locale] ?? '',
            };
        }

        setActiveLocales(locales);
        setTranslations(merged);
    }, []);

    const handleTranslationChange = useCallback((locale: string, field: string, value: string) => {
        setTranslations(prev => ({
            ...prev,
            [locale]: { ...prev[locale], [field]: value },
        }));
    }, []);

    const handleLocaleToAddChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocaleToAdd(e.target.value);
    }, []);

    const handleAddLocale = useCallback(() => {
        if (!localeToAdd) {
            return;
        }

        setActiveLocales(prev => [...prev, localeToAdd]);
        setTranslations(prev => ({ ...prev, [localeToAdd]: { description: '', name: '' } }));
        setLocaleToAdd('');
    }, [localeToAdd]);

    const handleRemoveLocale = useCallback((locale: string) => {
        setActiveLocales(prev => prev.filter(l => l !== locale));
        setTranslations(prev =>
            Object.fromEntries(Object.entries(prev).filter(([key]) => key !== locale)));
    }, []);

    const availableLocalesToAdd = OPTIONAL_LOCALES.filter(l => !activeLocales.includes(l));

    return {
        activeLocales,
        availableLocalesToAdd,
        handleAddLocale,
        handleLocaleToAddChange,
        handleRemoveLocale,
        handleTranslationChange,
        initFromTranslations,
        localeToAdd,
        translations,
    };
};
