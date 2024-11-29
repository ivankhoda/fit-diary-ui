/* eslint-disable sort-keys */
export type CategoryKey = 'strength' | 'cardio' | 'flexibility' | 'balance';
export type DifficultyKey = 'beginner' | 'intermediate' | 'advanced';

// Maps for category and difficulty keys
export const categoryKeys: CategoryKey[] = ['strength',
    'cardio',
    'flexibility',
    'balance'];
export const difficultyKeys: DifficultyKey[] = ['beginner',
    'intermediate',
    'advanced'];

export const categoryMap: CategoryKey[] = ['strength',
    'cardio',
    'flexibility',
    'balance'];
export const difficultyMap: DifficultyKey[] = ['beginner',
    'intermediate',
    'advanced'];

export const muscleGroups = [
    { id: 0, key: 'chest' },
    { id: 1, key: 'biceps' },
    { id: 2, key: 'triceps' },
    { id: 3, key: 'back' },
    { id: 4, key: 'upper_back' },
    { id: 5, key: 'lats' },
    { id: 6, key: 'shoulders' },
    { id: 7, key: 'forearms' },
    { id: 8, key: 'abs' },
    { id: 9, key: 'obliques' },
    { id: 10, key: 'lower_back' },
    { id: 11, key: 'quads' },
    { id: 12, key: 'hamstrings' },
    { id: 13, key: 'calves' },
    { id: 14, key: 'glutes' },
    { id: 15, key: 'hip_flexors' },
    { id: 16, key: 'adductors' },
    { id: 17, key: 'abductors' }
];
