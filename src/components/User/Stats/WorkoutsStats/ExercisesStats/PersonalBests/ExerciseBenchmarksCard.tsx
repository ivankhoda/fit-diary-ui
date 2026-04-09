import React from 'react';
import { t } from 'i18next';
import { ExerciseBenchmarkDisplayItem } from './mapPersonalBestsToDisplayItems';

interface ExerciseBenchmarksCardProps {
    isRefreshing?: boolean;
    items: ExerciseBenchmarkDisplayItem[];
}

export const ExerciseBenchmarksCard: React.FC<ExerciseBenchmarksCardProps> = ({
    isRefreshing = false,
    items,
}) => {
    if (items.length === 0) {
        return (
            <section className="exercise-benchmarks-card">
                <div className="exercise-benchmarks-card__header">
                    <h3>{t('exerciseStats.personalBests.title')}</h3>
                    {isRefreshing && (
                        <span className="exercise-benchmarks-card__status">
                            {t('exerciseStats.personalBests.refreshing')}
                        </span>
                    )}
                </div>
                <div className="exercise-benchmarks-card__empty">
                    {t('exerciseStats.personalBests.empty')}
                </div>
            </section>
        );
    }

    return (
        <section className="exercise-benchmarks-card">
            <div className="exercise-benchmarks-card__header">
                <h3>{t('exerciseStats.personalBests.title')}</h3>
                {isRefreshing && (
                    <span className="exercise-benchmarks-card__status">
                        {t('exerciseStats.personalBests.refreshing')}
                    </span>
                )}
            </div>
            <div className="exercise-benchmarks-card__grid">
                {items.map(item => (
                    <article key={item.key} className="exercise-benchmarks-card__item">
                        <span className="exercise-benchmarks-card__label">{item.label}</span>
                        <strong className="exercise-benchmarks-card__value">{item.value}</strong>
                    </article>
                ))}
            </div>
        </section>
    );
};
