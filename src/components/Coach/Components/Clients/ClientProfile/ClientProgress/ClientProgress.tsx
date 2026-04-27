/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable sort-keys */
/* ClientProgress.tsx */
import React, { useState, useMemo, useCallback, useEffect } from 'react';

import './ClientProgress.style.scss';
import ActivityGraphAdvanced from './ActivityGraph/ActivityGraph';
import {
    ACTIVITY_EMPTY_TEXT,
    EMPTY_PROGRESS_DATA,
    EMPTY_TEXT,
    EXERCISES_EMPTY_TEXT,
    ExerciseCard,
    FIRST_PAGE,
    HISTORY_EMPTY_TEXT,
    INCREMENT_STEP,
    ITEMS_PER_PAGE,
    LAST_UPDATE_FALLBACK,
    LOAD_ERROR_TEXT,
    PERCENT_MULTIPLIER,
    SORT_OPTIONS,
    SummaryCard,
    TYPE_LABELS,
    TYPES,
    ZERO_VALUE,
    createExerciseTypeCounts,
} from './ClientProgress.helpers';
import {
    ClientProgressData,
    ClientProgressProps,
    ClientProgressResponse,
    ExerciseSortOption,
    ExerciseType,
    SummaryCardItem,
} from './ClientProgress.types';

import Get from '../../../../../../utils/GetRequest';
import getApiBaseUrl from '../../../../../../utils/apiUrl';

const ClientProgress: React.FC<ClientProgressProps> = ({ clientId }) => {
    const [progressData, setProgressData] = useState<ClientProgressData | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [reloadToken, setReloadToken] = useState(ZERO_VALUE);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<ExerciseSortOption>('name');
    const [selectedTypes, setSelectedTypes] = useState<ExerciseType[]>([]);
    const [page, setPage] = useState(FIRST_PAGE);

    const handleRetry = useCallback(() => {
        setReloadToken(currentToken => currentToken + INCREMENT_STEP);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchClient = async() => {
            setIsLoading(true);
            setErrorMessage('');
            setProgressData(null);

            try {
                const response = await new Get({
                    url: `${getApiBaseUrl()}/coach/clients/${clientId}/progress`,
                }).execute();

                const res = await response.json() as ClientProgressResponse;

                if (!isMounted) {return;}

                if (res.ok && res.progress) {
                    setProgressData(res.progress);
                } else {
                    setErrorMessage(res.error || LOAD_ERROR_TEXT);
                }
            } catch {
                if (isMounted) {
                    setErrorMessage(LOAD_ERROR_TEXT);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchClient();

        return () => {
            isMounted = false;
        };
    }, [clientId, reloadToken]);

    const {
        clientName = '',
        clientEmail = '',
        lastUpdate = '',
        summary = { workoutsCount: 0, avgStrengthGrowth: '', avgActivity: '' },
        exercises = [],
        historyNotes = [],
        activityGraphData = [],
    } = progressData || EMPTY_PROGRESS_DATA;

    const exerciseTypeCounts = useMemo(() => {
        const counts = createExerciseTypeCounts();

        exercises.forEach(exercise => {
            counts[exercise.type] += INCREMENT_STEP;
        });

        return counts;
    }, [exercises]);

    const activityTotals = useMemo(() => activityGraphData.reduce(
        (accumulator, point) => ({
            actual: accumulator.actual + point.actualWorkouts,
            planned: accumulator.planned + point.plannedWorkouts,
        }),
        {
            actual: ZERO_VALUE,
            planned: ZERO_VALUE,
        },
    ), [activityGraphData]);

    const completionRate = useMemo(() => {
        if (activityTotals.planned === ZERO_VALUE) {
            return EMPTY_TEXT;
        }

        return `${Math.round((activityTotals.actual / activityTotals.planned) * PERCENT_MULTIPLIER)}%`;
    }, [activityTotals.actual, activityTotals.planned]);

    const summaryCards = useMemo<SummaryCardItem[]>(() => [
        {
            hint: 'Всего завершённых тренировок с данными по клиенту',
            label: 'Тренировок',
            value: String(summary.workoutsCount || ZERO_VALUE),
        },
        {
            hint: 'Усреднённая динамика по силовым упражнениям',
            label: 'Рост силы',
            value: summary.avgStrengthGrowth || EMPTY_TEXT,
        },
        {
            hint: 'Средний уровень вовлечённости по периоду',
            label: 'Активность',
            value: summary.avgActivity || EMPTY_TEXT,
        },
        {
            hint: `Факт ${activityTotals.actual} / план ${activityTotals.planned}`,
            label: 'Выполнение плана',
            value: completionRate,
        },
    ], [
        activityTotals.actual,
        activityTotals.planned,
        completionRate,
        summary.avgActivity,
        summary.avgStrengthGrowth,
        summary.workoutsCount,
    ]);

    const filteredExercises = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        let filtered = [...exercises];

        if (normalizedSearch) {
            filtered = filtered.filter(exercise => exercise.name.toLowerCase().includes(normalizedSearch));
        }

        if (selectedTypes.length > 0) {
            filtered = filtered.filter(exercise => selectedTypes.includes(exercise.type));
        }

        filtered.sort((leftExercise, rightExercise) => {
            if (sortBy === 'type') {
                const typeCompare = TYPE_LABELS[leftExercise.type].localeCompare(TYPE_LABELS[rightExercise.type]);

                if (typeCompare !== ZERO_VALUE) {
                    return typeCompare;
                }
            }

            return leftExercise.name.localeCompare(rightExercise.name);
        });

        return filtered;
    }, [exercises,
        search,
        selectedTypes,
        sortBy]);

    const totalPages = Math.max(FIRST_PAGE, Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
    const paginatedExercises = filteredExercises.slice(
        (page - FIRST_PAGE) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const visibleRangeStart = filteredExercises.length === ZERO_VALUE
        ? ZERO_VALUE
        : (page - FIRST_PAGE) * ITEMS_PER_PAGE + INCREMENT_STEP;
    const visibleRangeEnd = Math.min(page * ITEMS_PER_PAGE, filteredExercises.length);

    const clearFilters = useCallback(() => {
        setPage(FIRST_PAGE);
        setSearch('');
        setSelectedTypes([]);
        setSortBy('name');
    }, []);

    const handlePrevPage = useCallback(() => {
        setPage(prev => prev - INCREMENT_STEP);
    }, []);

    const handleNextPage = useCallback(() => {
        setPage(prev => prev + INCREMENT_STEP);
    }, []);

    const toggleType = useCallback((type: ExerciseType) => {
        setPage(FIRST_PAGE);
        setSelectedTypes(types =>
            types.includes(type) ? types.filter(t => t !== type) : [...types, type]);
    }, []);

    const handleTypeChange = useCallback((type: ExerciseType) => {
        toggleType(type);
    }, [toggleType]);

    const handleTypeChangeInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleTypeChange(e.target.value as ExerciseType);
        },
        [handleTypeChange]
    );

    const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPage(FIRST_PAGE);
        setSearch(e.target.value);
    }, []);

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(FIRST_PAGE);
        setSortBy(e.target.value as ExerciseSortOption);
    }, []);

    if (isLoading) {
        return (
            <div className="client-progress client-progress--status">
                <section className="client-progress__status-card">
                    <h2 className="client-progress__status-title">Загрузка прогресса</h2>
                    <p className="client-progress__status-text">Подтягиваем упражнения, активность и историю клиента.</p>
                </section>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="client-progress client-progress--status">
                <section className="client-progress__status-card client-progress__status-card--error">
                    <h2 className="client-progress__status-title">Не удалось открыть раздел прогресса</h2>
                    <p className="client-progress__status-text">{errorMessage}</p>
                    <button className="client-progress__status-action" onClick={handleRetry} type="button">
                        Повторить загрузку
                    </button>
                </section>
            </div>
        );
    }

    if (!progressData) {
        return (
            <div className="client-progress client-progress--status">
                <section className="client-progress__status-card">
                    <h2 className="client-progress__status-title">Прогресс пока пуст</h2>
                    <p className="client-progress__status-text">Когда появятся тренировки и замеры, они будут показаны здесь.</p>
                </section>
            </div>
        );
    }

    return (
        <div className="client-progress">
            <header className="client-progress__header">
                <div>
                    <span className="client-progress__eyebrow">Аналитика по клиенту</span>
                    <h2 className="client-progress__title">Прогресс клиента: {clientName || clientEmail}</h2>
                    <p className="client-progress__subtitle">
                        Быстрый обзор активности, динамики упражнений и истории наблюдений.
                    </p>
                </div>
                <div className="client-progress__header-meta">
                    <span className="client-progress__meta-label">Последнее обновление</span>
                    <strong className="client-progress__meta-value">{lastUpdate || LAST_UPDATE_FALLBACK}</strong>
                </div>
            </header>

            <section className="client-progress__summary">
                <div className="client-progress__summary-grid">
                    {summaryCards.map(summaryCard => (
                        <SummaryCard
                            hint={summaryCard.hint}
                            key={summaryCard.label}
                            label={summaryCard.label}
                            value={summaryCard.value}
                        />
                    ))}
                </div>
            </section>

            <section className="client-progress__filters">
                <div className="client-progress__filters-card">
                    <div className="client-progress__filters-top">
                        <div className="client-progress__filters-copy">
                            <h3 className="client-progress__section-title">Упражнения</h3>
                            <p className="client-progress__section-subtitle">
                                Показано {visibleRangeStart}-{visibleRangeEnd} из {filteredExercises.length} упражнений
                            </p>
                        </div>
                        <button className="client-progress__clear-button" onClick={clearFilters} type="button">
                            Сбросить фильтры
                        </button>
                    </div>

                    <div className="client-progress__filter-row">
                        <label className="client-progress__field">
                            <span className="client-progress__field-label">Поиск</span>
                            <input
                                className="client-progress__search-input"
                                onChange={onSearchChange}
                                placeholder="Поиск по упражнениям"
                                type="text"
                                value={search}
                            />
                        </label>

                        <label className="client-progress__field client-progress__field--compact">
                            <span className="client-progress__field-label">Сортировка</span>
                            <select className="client-progress__select" onChange={handleSortChange} value={sortBy}>
                                {SORT_OPTIONS.map(sortOption => (
                                    <option key={sortOption.value} value={sortOption.value}>
                                        {sortOption.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className="client-progress__type-filters">
                    {TYPES.map(type => (
                        <label
                            className={`client-progress__type-option ${selectedTypes.includes(type) ? 'client-progress__type-option--active' : ''}`}
                            key={type}
                        >
                            <input
                                className="client-progress__type-checkbox"
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                value={type}
                                onChange={handleTypeChangeInput}
                            />
                            <span className="client-progress__type-label">{TYPE_LABELS[type]}</span>
                            <span className="client-progress__type-count">{exerciseTypeCounts[type]}</span>
                        </label>
                    ))}
                </div>
            </section>

            <section className="client-progress__exercises">
                {paginatedExercises.length === 0
                    ? (
                        <div className="client-progress__empty-card">
                            <h3 className="client-progress__empty-title">{EXERCISES_EMPTY_TEXT}</h3>
                            <p className="client-progress__empty-text">
                                Попробуйте снять часть фильтров или изменить запрос поиска.
                            </p>
                        </div>
                    )
                    : (
                        paginatedExercises.map((exercise, index) => (
                            <ExerciseCard exercise={exercise} key={`${exercise.name}-${exercise.type}-${index}`} />
                        ))
                    )}

                {filteredExercises.length > ZERO_VALUE && (
                    <div className="client-progress__pagination">
                        <button disabled={page === FIRST_PAGE} onClick={handlePrevPage} type="button">
                            Назад
                        </button>
                        <span className="client-progress__pagination-text">Страница {page} из {totalPages}</span>
                        <button disabled={page === totalPages} onClick={handleNextPage} type="button">
                            Далее
                        </button>
                    </div>
                )}
            </section>

            <section className="client-progress__activity-graph">
                <h3 className="client-progress__section-title">Активность по периодам</h3>
                {activityGraphData.length > ZERO_VALUE
                    ? (
                        <ActivityGraphAdvanced
                            data={activityGraphData.map(point => ({
                                actualWorkouts: point.actualWorkouts || ZERO_VALUE,
                                comment: point.comment || '',
                                date: point.date,
                                plannedWorkouts: point.plannedWorkouts || ZERO_VALUE,
                            }))}
                        />
                    )
                    : (
                        <div className="client-progress__empty-card">
                            <h4 className="client-progress__empty-title">{ACTIVITY_EMPTY_TEXT}</h4>
                            <p className="client-progress__empty-text">
                                После накопления данных здесь появится сравнение плана и факта.
                            </p>
                        </div>
                    )}
            </section>

            <section className="client-progress__history">
                <h3 className="client-progress__section-title">История тренировок и заметки</h3>
                {historyNotes.length > ZERO_VALUE
                    ? (
                        <ul className="client-progress__history-list">
                            {historyNotes.map((note, index) => (
                                <li className="client-progress__history-note" key={`${note}-${index}`}>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    )
                    : (
                        <div className="client-progress__empty-card">
                            <h4 className="client-progress__empty-title">История пока пуста</h4>
                            <p className="client-progress__empty-text">{HISTORY_EMPTY_TEXT}</p>
                        </div>
                    )}
            </section>
        </div>
    );
};

export default ClientProgress;
