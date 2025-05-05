/* eslint-disable sort-keys */

export const CATEGORY_OPTIONS = [
    { label: '', value: '' },
    { label: '💪 Сила', value: 'strength' },
    { value: 'endurance', label: '🏃‍♂️ Выносливость' },
    { value: 'speed', label: '⚡️ Скорость' },
    { value: 'weight', label: '⚖️ Вес' },
    { value: 'technique', label: '🎯 Техника' },
    { value: 'rehabilitation', label: '🛡️ Реабилитация' },
    { value: 'competition', label: '🏆 Соревнования' }
];

export const GOAL_TYPE_OPTIONS = [
    { value: '', label: '' },
    // 💪 Сила
    { value: 'weight_increase', label: '📈 Увеличение веса' },
    { value: 'reps_increase', label: '🔁 Увеличение повторений' },
    // 🏃‍♂️ Выносливость
    { value: 'time_improvement', label: '⏱ Улучшение времени' },
    { value: 'distance_increase', label: '📏 Увеличение дистанции' },
    // ⚡️ Скорость
    { value: 'sprint_improvement', label: '🏃‍♀️ Улучшение скорости' },
    // ⚖️ Вес
    { value: 'weight_loss', label: '🔽 Снижение веса' },
    { value: 'mass_gain', label: '🍚 Набор массы' },
    // 🎯 Техника
    { value: 'technique_improvement', label: '🎯 Улучшение техники' },
    // 🛡️ Реабилитация
    { value: 'recovery', label: '🛠 Восстановление' },
    // 🏆 Соревнования
    { value: 'competition_ready', label: '🏁 Подготовка к соревнованиям' }
];

export const CATEGORY_TO_TYPES: Record<string, string[]> = {
    strength: ['weight_increase', 'reps_increase'],
    endurance: ['time_improvement', 'distance_increase'],
    speed: ['sprint_improvement'],
    weight: ['weight_loss', 'mass_gain'],
    technique: ['technique_improvement'],
    rehabilitation: ['recovery'],
    competition: ['competition_ready']
};

export const GOAL_TYPE_FIELD_META: Record<string, {
  component?: string;
  currentLabel: string;
  targetLabel: string;
  unit: string;
  valueType: 'number' | 'time' | 'distance' | 'weight' | 'text';
  currentPlaceholder: string;
  targetPlaceholder: string;
}> = {
    // 💪 Сила
    weight_increase: {
        component:'WeightInput',
        currentLabel: 'Текущий рабочий вес',
        targetLabel: 'Целевой рабочий вес',
        unit: 'кг',
        valueType: 'weight',
        currentPlaceholder: 'Например, 50',
        targetPlaceholder: 'Например, 70'
    },
    reps_increase: {
        component:'RepetitionsInput',
        currentLabel: 'Текущее количество повторений',
        targetLabel: 'Целевое количество повторений',
        unit: 'повт.',
        valueType: 'number',
        currentPlaceholder: 'Например, 8',
        targetPlaceholder: 'Например, 15'
    },

    // 🏃‍♂️ Выносливость
    time_improvement: {
        component: 'TimeInput',
        currentLabel: 'Текущее время на дистанции',
        targetLabel: 'Целевое время',
        unit: 'мин',
        valueType: 'time',
        currentPlaceholder: 'Например, 30',
        targetPlaceholder: 'Например, 25',

    },
    distance_increase: {
        component:'DistanceInput',
        currentLabel: 'Текущая дистанция',
        targetLabel: 'Целевая дистанция',
        unit: 'км',
        valueType: 'distance',
        currentPlaceholder: 'Например, 5',
        targetPlaceholder: 'Например, 10'
    },

    // ⚡️ Скорость
    sprint_improvement: {
        component: 'DurationDecimalInput',
        currentLabel: 'Текущее время',
        targetLabel: 'Желаемое время',
        unit: 'сек',
        valueType: 'time',
        currentPlaceholder: 'Например, 14.5',
        targetPlaceholder: 'Например, 12.8'
    },

    // ⚖️ Вес
    weight_loss: {
        component: 'WeightInput',
        currentLabel: 'Текущий вес',
        targetLabel: 'Желаемый вес',
        unit: 'кг',
        valueType: 'weight',
        currentPlaceholder: 'Например, 90',
        targetPlaceholder: 'Например, 80'
    },
    mass_gain: {
        component: 'WeightInput',
        currentLabel: 'Текущий вес',
        targetLabel: 'Желаемый вес',
        unit: 'кг',
        valueType: 'weight',
        currentPlaceholder: 'Например, 60',
        targetPlaceholder: 'Например, 70'
    },

    // 🎯 Техника
    technique_improvement: {
        currentLabel: 'Текущий уровень',
        targetLabel: 'Желаемый уровень',
        unit: '',
        valueType: 'text',
        currentPlaceholder: 'Например, базовый',
        targetPlaceholder: 'Например, продвинутый'
    },

    // 🛡️ Реабилитация
    recovery: {
        currentLabel: 'Текущий уровень восстановления',
        targetLabel: 'Полное восстановление',
        unit: '',
        valueType: 'text',
        currentPlaceholder: 'Например, 50%',
        targetPlaceholder: '100%'
    },

    // 🏆 Соревнования
    competition_ready: {
        currentLabel: 'Текущий уровень готовности',
        targetLabel: 'Целевой уровень',
        unit: '',
        valueType: 'text',
        currentPlaceholder: 'Например, 60%',
        targetPlaceholder: '100%'
    }
};
