import React, { useEffect } from 'react';
import './ClientWorkoutsOverview.style.scss';

import { observer, inject } from 'mobx-react';
import { ClientWorkoutSummary } from '../../../store/CoachWorkoutsStore';

export interface ClientWorkoutsOverviewProps {
    clientId: number;
    coachWorkoutsStore?: unknown;
    coachWorkoutsController?: unknown;
}

const stateLabels: Record<string, string> = {
    completed: 'Завершена',
    in_progress: 'В процессе',
    planned: 'Запланирована',
};

const ClientWorkoutsOverview: React.FC<ClientWorkoutsOverviewProps> = observer(props => {
    const { clientId, coachWorkoutsStore, coachWorkoutsController } = props as {
        clientId: number;
        coachWorkoutsStore?: unknown;
        coachWorkoutsController?: unknown;
    };

    useEffect(() => {
        (coachWorkoutsController as { getUserWorkouts?: (id: number) => void })?.getUserWorkouts?.(clientId);
    }, [clientId, coachWorkoutsController]);

    const workouts = (coachWorkoutsStore as { userWorkouts ?: ClientWorkoutSummary[] })?.userWorkouts || [];
    const loading = (coachWorkoutsStore as { loading?: boolean })?.loading;
    const error = (coachWorkoutsStore as { error?: string })?.error;

    console.log(workouts, 'workouts in overview');

    if (loading) {
        return <div className="client-workouts-overview__empty">Загрузка...</div>;
    }
    if (error) {
        return <div className="client-workouts-overview__empty" style={{ color: 'red' }}>{error}</div>;
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
                            <th>Статус</th>
                            <th>Длительность</th>
                            <th>Выполнено</th>
                            <th>Ожидаемый RPE</th>
                            <th>RPE</th>
                            <th>Объем</th>
                            <th>Упражнений</th>
                            <th>Отклонения</th>
                            <th>Комментарий</th>
                            <th>План тренера</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workouts.map((w: ClientWorkoutSummary) => (
                            <tr key={w.id}>
                                <td>{w.date}</td>
                                <td>{w.name}</td>
                                <td>{stateLabels[w.state] || w.state}</td>
                                <td>{w.duration}</td>
                                <td>{w.summary.completion_percent}%</td>
                                <td>{w.summary.estimated_rpe}</td>
                                <td>{w.summary.rpe}</td>
                                <td>{w.summary.total_volume}</td>
                                <td>{w.summary.exercises_count}</td>
                                <td>{w.summary.deviations_count}</td>
                                <td>{w.summary.has_comment ? 'Да' : ''}</td>
                                <td>{w.summary.planned_by_trainer ? 'Да' : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
export default inject('coachWorkoutsStore', 'coachWorkoutsController')(ClientWorkoutsOverview);
