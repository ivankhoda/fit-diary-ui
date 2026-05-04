import React, { useEffect } from 'react';
import './ClientWorkoutsOverview.style.scss';

import { observer, inject } from 'mobx-react';
import { ClientWorkoutSummary } from '../../../store/CoachWorkoutsStore';

type SignalTone = 'good' | 'negative' | 'positive' | 'warning';

type WorkoutSignal = {
    id: string;
    label: string;
    tone: SignalTone;
    value: string;
};

type CoachWorkoutsStore = {
    error?: string;
    loading?: boolean;
    userWorkouts?: ClientWorkoutSummary[];
};

type CoachWorkoutsController = {
    getUserWorkouts?: (id: number) => void;
};

export interface ClientWorkoutsOverviewProps {
    clientId: number;
    coachWorkoutsStore?: unknown;
    coachWorkoutsController?: unknown;
}

const getWorkoutSignals = (summary: ClientWorkoutSummary['summary']): WorkoutSignal[] => {
    const signals: WorkoutSignal[] = [];

    if (summary.negative_deviations_count && summary.negative_deviations_count > 0) {
        signals.push({
            id: 'negative-deviations',
            label: 'Негативные отклонения',
            tone: 'negative',
            value: String(summary.negative_deviations_count),
        });
    }

    if (summary.positive_deviations_count && summary.positive_deviations_count > 0) {
        signals.push({
            id: 'positive-deviations',
            label: 'Позитивные отклонения',
            tone: 'positive',
            value: String(summary.positive_deviations_count),
        });
    }

    if (typeof summary.rpe_delta === 'number' && summary.rpe_delta !== 0) {
        signals.push({
            id: 'rpe-delta',
            label: summary.rpe_delta > 0 ? 'RPE выше плана' : 'RPE ниже плана',
            tone: summary.rpe_delta > 0 ? 'warning' : 'good',
            value: `${summary.rpe_delta > 0 ? '+' : ''}${summary.rpe_delta}`,
        });
    }

    return signals;
};

const ClientWorkoutsOverview: React.FC<ClientWorkoutsOverviewProps> = observer(props => {
    const { clientId, coachWorkoutsStore, coachWorkoutsController } = props as {
        clientId: number;
        coachWorkoutsController?: CoachWorkoutsController;
        coachWorkoutsStore?: CoachWorkoutsStore;
    };

    useEffect(() => {
        coachWorkoutsController?.getUserWorkouts?.(clientId);
    }, [clientId, coachWorkoutsController]);

    const workouts = coachWorkoutsStore?.userWorkouts || [];
    const loading = coachWorkoutsStore?.loading;
    const error = coachWorkoutsStore?.error;

    if (loading) {
        return <div className="client-workouts-overview__empty">Загрузка...</div>;
    }
    if (error) {
        return <div className="client-workouts-overview__empty client-workouts-overview__empty--error">{error}</div>;
    }
    if (!workouts.length) {
        return <div className="client-workouts-overview__empty">Нет тренировок</div>;
    }

    return (
        <div className="client-workouts-overview">
            <div className="client-workouts-overview__table-wrapper">
                <table className="client-workouts-overview__table">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Название</th>
                            <th>Длительность</th>
                            <th>Выполнено</th>
                            <th>Ожидаемый RPE</th>
                            <th>RPE</th>
                            <th>Сигналы</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workouts.map((w: ClientWorkoutSummary) => {
                            const signals = getWorkoutSignals(w.summary);

                            return (
                                <tr key={w.id}>
                                    <td data-label="Дата">{w.date}</td>
                                    <td data-label="Название">{w.name}</td>
                                    <td data-label="Длительность">{w.duration}</td>
                                    <td data-label="Выполнено">{w.summary.completion_percent}%</td>
                                    <td data-label="Ожидаемый RPE">{w.summary.estimated_rpe}</td>
                                    <td data-label="RPE">{w.summary.rpe}</td>
                                    <td className="client-workouts-overview__signals-cell" data-label="Сигналы">
                                        <div className="client-workouts-overview__signals">
                                            {signals.length > 0
                                                ? signals.map(signal => (
                                                    <div
                                                        key={`${w.id}-${signal.id}`}
                                                        className={[
                                                            'client-workouts-overview__signal', `client-workouts-overview__signal--${signal.tone}`,
                                                        ].join(' ')}
                                                    >
                                                        <span className="client-workouts-overview__signal-label">{signal.label}</span>
                                                        <span className="client-workouts-overview__signal-value">{signal.value}</span>
                                                    </div>
                                                ))
                                                : (
                                                    <span className="client-workouts-overview__signal-empty">Без отклонений</span>
                                                )}
                                        </div>
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
export default inject('coachWorkoutsStore', 'coachWorkoutsController')(ClientWorkoutsOverview);
