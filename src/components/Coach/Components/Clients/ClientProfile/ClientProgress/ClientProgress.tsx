/* eslint-disable sort-keys */
/* ClientProgress.tsx */
import React, { useState, useMemo, useCallback } from 'react';

import './ClientProgress.style.scss';
import ActivityGraphAdvanced from './ActivityGraph/ActivityGraph';

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
  workouts: number;
}

interface ClientProgressProps {
  clientId: string;
}

const stubData = {
    clientName: 'Иван Иванов',
    lastUpdate: '20 июня 2025',
    clientId: '12345',
    summary: {
        workoutsCount: 25,
        avgStrengthGrowth: '+15%',
        avgActivity: '4 раза в неделю',
    },
    exercises: [
        {
            name: 'Жим лёжа',
            type: 'weight_and_reps' as ExerciseType,
            stats: {
                weightFrom: 60,
                weightTo: 75,
                repsFrom: 10,
                repsTo: 6,
            },
        },
        {
            name: 'Подтягивания',
            type: 'reps' as ExerciseType,
            stats: {
                repsFrom: 5,
                repsTo: 10,
            },
        },
        {
            name: 'Бег',
            type: 'duration_and_distance' as ExerciseType,
            stats: {
                distanceFrom: 3.2,
                distanceTo: 4.3,
                durationFrom: 25,
                durationTo: 28,
            },
        },
        // Добавим для теста ещё упражнений:
        {
            name: 'Приседания',
            type: 'weight_and_reps' as ExerciseType,
            stats: { weightFrom: 80, weightTo: 100, repsFrom: 8, repsTo: 12 },
        },
        {
            name: 'Планка',
            type: 'duration' as ExerciseType,
            stats: { durationFrom: 30, durationTo: 60 },
        },
        {
            name: 'Велотренажер',
            type: 'cardio' as ExerciseType,
            stats: { durationFrom: 20, durationTo: 35 },
        },
        {
            name: 'Скакалка',
            type: 'duration_and_reps' as ExerciseType,
            stats: { durationFrom: 5, durationTo: 7, repsFrom: 100, repsTo: 150 },
        },
    ] as Exercise[],
    activityGraphData: [
        { date: '2025-03-01', workouts: 2 },
        { date: '2025-04-01', workouts: 5 },
        { date: '2025-05-01', workouts: 4 },
    ] as ActivityGraphPoint[],
    historyNotes: [
        '18 июня: улучшение жима на 5 кг', '15 июня: обсуждение целей с клиентом',
    ] as string[],
};

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
    // В реальности здесь запрос по clientId
    const { clientName, lastUpdate, summary, exercises, historyNotes } = stubData;

    const [search, setSearch] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<ExerciseType[]>([]);
    const [page, setPage] = useState(1);
    console.log('ClientProgress', clientId);
    // Фильтрация по поиску и типам
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

    // Пагинация
    const totalPages = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);
    const paginatedExercises = filteredExercises.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE,
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
            types.includes(type) ? types.filter(t => t !== type) : [...types, type],);
    };

    const handleTypeChange = useCallback((type: ExerciseType) => {
        toggleType(type);
    },[]);

    const handleTypeChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleTypeChange(e.target.value as ExerciseType);
    }, [handleTypeChange]);

    const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1);
        setSearch(e.target.value);
    }, []);

    return (
        <div className="client-progress">
            <header className="client-progress__header">
                <h2 className="client-progress__title">Прогресс клиента: {clientName}</h2>
                <p className="client-progress__update">Последнее обновление: {lastUpdate}</p>
            </header>

            <section className="client-progress__summary">
                <div className="summary-item">Тренировок: {summary.workoutsCount}</div>
                <div className="summary-item">Средний рост силы: {summary.avgStrengthGrowth}</div>
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
                        ← Назад
                    </button>
                    <span>
                        Страница {page} из {totalPages}
                    </span>
                    <button disabled={page === totalPages} onClick={handleNextPage}>
                        Вперед →
                    </button>
                </div>
            </section>

            <section className="client-progress__activity-graph">
                <ActivityGraphAdvanced/>
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
