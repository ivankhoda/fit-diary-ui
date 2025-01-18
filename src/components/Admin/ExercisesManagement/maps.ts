/* eslint-disable sort-keys */
export type CategoryKey = 'strength' | 'cardio' | 'flexibility' | 'balance';
export type DifficultyKey = 'beginner' | 'intermediate' | 'advanced' | 'unspecified' ;
export type MeasurementKey = 'weight_and_reps' | 'reps' | 'duration' | 'duration_and_reps' | 'cardio' | 'duration_and_distance';

export const categoryKeys: CategoryKey[] = ['strength',
    'cardio',
    'flexibility',
    'balance'];
export const difficultyKeys: DifficultyKey[] = ['beginner',
    'intermediate',
    'advanced'];
export const measurementKeys: MeasurementKey[] = ['weight_and_reps',
    'reps',
    'duration',
    'duration_and_reps',
    'cardio',
    'duration_and_distance'];

export const categoryMap: CategoryKey[] = ['strength',
    'cardio',
    'flexibility',
    'balance'];
export const difficultyMap: DifficultyKey[] = ['beginner',
    'intermediate',
    'advanced',
    'unspecified'];

export const muscleGroups = [
    { name: 'other' },
    { name: 'chest' },
    { name: 'biceps' },
    { name: 'triceps' },
    { name: 'back' },
    { name: 'upper_back' },
    { name: 'lats' },
    { name: 'shoulders' },
    { name: 'forearms' },
    { name: 'abs' },
    { name: 'obliques' },
    { name: 'lower_back' },
    { name: 'quads' },
    { name: 'hamstrings' },
    { name: 'calves' },
    { name: 'glutes' },
    { name: 'hip_flexors' },
    { name: 'adductors' },
    { name: 'abductors' },
];
