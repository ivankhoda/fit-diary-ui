/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable sort-keys */
/* ClientProgress.tsx */
import React, { useState, useMemo, useCallback, useEffect } from 'react';

import './ClientProgress.style.scss';
import ActivityGraphAdvanced from './ActivityGraph/ActivityGraph';

import Get from '../../../../../../utils/GetRequest';
import getApiBaseUrl from '../../../../../../utils/apiUrl';

type ExerciseType =
  | 'weight_and_reps'
  | 'reps'
  | 'duration'
  | 'duration_and_reps'
  | 'cardio'
  | 'duration_and_distance';

interface ExerciseStats {
  weightFrom?: number;
  weightTo?: number;
  repsFrom?: number;
  repsTo?: number;
  durationFrom?: number;
  durationTo?: number;
  distanceFrom?: number;
  distanceTo?: number;
}

interface Exercise {
  name: string;
  type: ExerciseType;
  stats: ExerciseStats;
}

interface ActivityGraphPoint {
  date: string;
  actualWorkouts: number;
  plannedWorkouts: number;
  comment?: string;
}

interface ClientProgressData {
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

interface ClientProgressProps {
  clientId: string;
}

const TYPES: ExerciseType[] = [
    'weight_and_reps',
    'reps',
    'duration',
    'duration_and_reps',
    'cardio',
    'duration_and_distance',
];

const TYPE_LABELS: Record<ExerciseType, string> = {
    weight_and_reps: 'Вес и повторы',
    reps: 'Повторы',
    duration: 'Время',
    duration_and_reps: 'Время и повторы',
    cardio: 'Кардио',
    duration_and_distance: 'Время и дистанция',
};

const ITEMS_PER_PAGE = 5;

const ClientProgress: React.FC<ClientProgressProps> = ({ clientId }) => {
    const [progressData, setProgressData] = useState<ClientProgressData | null>(null);
    const [search, setSearch] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<ExerciseType[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        let isMounted = true;

        const fetchClient = async() => {
            try {
                const response = await new Get({
                    url: `${getApiBaseUrl()}/coach/clients/${clientId}/progress`,
                }).execute();

                const res = await response.json();

                if (!isMounted) {return;}

                if (res.ok) {
                    setProgressData(res.progress);
                } else {
                    console.error('Failed to fetch client data:', res.error);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Network error while fetching client data:', error);
                }
            }
        };

        fetchClient();

        return () => {
            isMounted = false;
        };
    }, [clientId]);

    // Destructure exercises (and others) from progressData if available, else use defaults
    const {
        clientName = '',
        clientEmail = '',
        lastUpdate = '',
        summary = { workoutsCount: 0, avgStrengthGrowth: '', avgActivity: '' },
        exercises = [],
        historyNotes = [],
        activityGraphData = [],
    } = progressData || {};

    const filteredExercises = useMemo(() => {
        let filtered = exercises;

        if (search.trim()) {
            const s = search.toLowerCase();
            filtered = filtered.filter(e => e.name.toLowerCase().includes(s));
        }

        if (selectedTypes.length > 0) {
            filtered = filtered.filter(e => selectedTypes.includes(e.type));
        }

        return filtered;
    }, [exercises,
        search,
        selectedTypes]);

    const totalPages = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);
    const paginatedExercises = filteredExercises.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handlePrevPage = useCallback(() => {
        setPage(prev => prev - 1);
    }, []);

    const handleNextPage = useCallback(() => {
        setPage(prev => prev + 1);
    }, []);

    const toggleType = (type: ExerciseType) => {
        setPage(1);
        setSelectedTypes(types =>
            types.includes(type) ? types.filter(t => t !== type) : [...types, type]);
    };

    const handleTypeChange = useCallback((type: ExerciseType) => {
        toggleType(type);
    }, []);

    const handleTypeChangeInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleTypeChange(e.target.value as ExerciseType);
        },
        [handleTypeChange]
    );

    const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1);
        setSearch(e.target.value);
    }, []);

    if (!progressData) {
        return <div className="client-progress">Загрузка данных клиента...</div>;
    }

    return (
        <div className="client-progress">
            <header className="client-progress__header">
                <h2 className="client-progress__title">
          Прогресс клиента: {clientName || clientEmail}
                </h2>
                <p className="client-progress__update">Последнее обновление: {lastUpdate}</p>
            </header>

            <section className="client-progress__summary">
                <div className="summary-item">Тренировок: {summary.workoutsCount}</div>
                <div className="summary-item">Средняя активность: {summary.avgActivity}</div>
            </section>

            <section className="client-progress__filters">
                <input
                    type="text"
                    placeholder="Поиск по упражнениям"
                    value={search}
                    onChange={onSearchChange}
                />
                <div className="client-progress__type-filters">
                    {TYPES.map(type => (
                        <label key={type}>
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                value={type}
                                onChange={handleTypeChangeInput}
                            />
                            {TYPE_LABELS[type]}
                        </label>
                    ))}
                </div>
            </section>

            <section className="client-progress__exercises">
                {paginatedExercises.length === 0
                    ? (
                        <p className="no-exercises">Упражнения не найдены</p>
                    )
                    : (
                        paginatedExercises.map((ex, i) => (
                            <div key={i} className="exercise-card">
                                <h3 className="exercise-card__name">{ex.name}</h3>
                                <div className="exercise-card__stats">
                                    {ex.type === 'weight_and_reps' && (
                                        <>
                                            <div>Вес: {ex.stats.weightFrom} → {ex.stats.weightTo} кг</div>
                                            <div>Повторы: {ex.stats.repsFrom} → {ex.stats.repsTo}</div>
                                        </>
                                    )}
                                    {ex.type === 'reps' && (
                                        <div>Повторы: {ex.stats.repsFrom} → {ex.stats.repsTo}</div>
                                    )}
                                    {ex.type === 'duration' && (
                                        <div>Время: {ex.stats.durationFrom} → {ex.stats.durationTo} мин</div>
                                    )}
                                    {ex.type === 'duration_and_reps' && (
                                        <>
                                            <div>Время: {ex.stats.durationFrom} → {ex.stats.durationTo} мин</div>
                                            <div>Повторы: {ex.stats.repsFrom} → {ex.stats.repsTo}</div>
                                        </>
                                    )}
                                    {ex.type === 'cardio' && (
                                        <div>Время: {ex.stats.durationFrom} → {ex.stats.durationTo} мин</div>
                                    )}
                                    {ex.type === 'duration_and_distance' && (
                                        <>
                                            <div>Дистанция: {ex.stats.distanceFrom} → {ex.stats.distanceTo} км</div>
                                            <div>Время: {ex.stats.durationFrom} → {ex.stats.durationTo} мин</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                <div className="client-progress__pagination">
                    <button disabled={page === 1} onClick={handlePrevPage}>
            ←
                    </button>
                    <span>
            Страница {page} из {totalPages}
                    </span>
                    <button disabled={page === totalPages} onClick={handleNextPage}>
             →
                    </button>
                </div>
            </section>

            <section className="client-progress__activity-graph">
                <ActivityGraphAdvanced
                    data={activityGraphData.map(p => ({
                        date: p.date,
                        actualWorkouts: p.actualWorkouts || 0,
                        plannedWorkouts: p.plannedWorkouts || 0,
                        comment: p.comment,
                    }))}
                />
            </section>

            <section className="client-progress__history">
                <h3>История тренировок и заметки</h3>
                <ul>
                    {historyNotes.map((note, i) => (
                        <li key={i} className="history-note">{note}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default ClientProgress;
