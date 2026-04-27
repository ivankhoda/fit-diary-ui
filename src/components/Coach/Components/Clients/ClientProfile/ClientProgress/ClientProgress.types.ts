export type ExerciseType =
    | 'weight_and_reps'
    | 'reps'
    | 'duration'
    | 'duration_and_reps'
    | 'cardio'
    | 'duration_and_distance';

export interface ExerciseStats {
    weightFrom?: number;
    weightTo?: number;
    repsFrom?: number;
    repsTo?: number;
    durationFrom?: number;
    durationTo?: number;
    distanceFrom?: number;
    distanceTo?: number;
}

export interface Exercise {
    name: string;
    type: ExerciseType;
    stats: ExerciseStats;
}

export interface ActivityGraphPoint {
    date: string;
    actualWorkouts: number;
    plannedWorkouts: number;
    comment?: string;
}

export interface ClientProgressData {
    clientName: string;
    clientEmail: string;
    lastUpdate: string;
    clientId: string;
    summary: {
        workoutsCount: number;
        avgStrengthGrowth: string;
        avgActivity: string;
    };
    exercises: Exercise[];
    activityGraphData: ActivityGraphPoint[];
    historyNotes: string[];
}

export interface ClientProgressProps {
    clientId: string;
}

export interface ClientProgressResponse {
    ok: boolean;
    error?: string;
    progress?: ClientProgressData;
}

export interface ExerciseStatItem {
    label: string;
    value: string;
}

export interface SummaryCardItem {
    hint: string;
    label: string;
    value: string;
}

export type ExerciseSortOption = 'name' | 'type';
