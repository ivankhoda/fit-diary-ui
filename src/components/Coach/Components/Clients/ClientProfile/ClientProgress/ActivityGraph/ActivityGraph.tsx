/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
import React, { useCallback, useState } from 'react';

interface ActivityDataPoint {
  date: string;
  plannedWorkouts: number;
  actualWorkouts: number;
  comment?: string;
}

interface ActivityGraphAdvancedProps {
  data?: ActivityDataPoint[];
  defaultPeriod?: 'week' | 'month' | 'quarter';
}

const stubData: ActivityDataPoint[] = [
    { date: '2025-06-01', plannedWorkouts: 3, actualWorkouts: 2, comment: 'Пропущена тренировка 2 июня' },
    { date: '2025-06-08', plannedWorkouts: 3, actualWorkouts: 1, comment: 'Клиент жаловался на усталость' },
    { date: '2025-06-15', plannedWorkouts: 3, actualWorkouts: 3, comment: 'Отличный прогресс' },
    { date: '2025-06-22', plannedWorkouts: 3, actualWorkouts: 3 },
    { date: '2025-06-29', plannedWorkouts: 3, actualWorkouts: 2 },
    { date: '2025-07-06', plannedWorkouts: 3, actualWorkouts: 1, comment: 'Переезд, снизил активность' },
    { date: '2025-07-13', plannedWorkouts: 3, actualWorkouts: 3 },
];

const periods = {
    week: 7,
    month: 30,
    quarter: 90,
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const getTrendText = (trend: number) => {
    if (trend > 0) {return '↑ Растёт';}
    if (trend < 0) {return '↓ Падает';}
    return '→ Стабильна';
};

const ActivityGraphAdvanced: React.FC<ActivityGraphAdvancedProps> = ({
    data = stubData,
    defaultPeriod = 'quarter',
}) => {
    const [period, setPeriod] = useState(defaultPeriod);

    const handlePeriodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setPeriod(e.target.value as keyof typeof periods);
    }, []);

    // Фильтруем данные по выбранному периоду от текущей даты назад
    const now = new Date();
    const filteredData = data.filter(point => {
        const pointDate = new Date(point.date);
        const diffDays = (now.getTime() - pointDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= periods[period];
    });

    // Вычисляем тренд (простая линия между первой и последней точкой)
    const trend = (() => {
        if (filteredData.length < 2) {return null;}

        const first = filteredData[0].actualWorkouts;
        const last = filteredData[filteredData.length - 1].actualWorkouts;
        const slope = (last - first) / (filteredData.length - 1);
        return slope;
    })();

    return (
        <section className="activity-graph-advanced">
            <h3 className="activity-graph-advanced__title">График активности</h3>

            <div className="activity-graph-advanced__filters">
                <label>
                    <select
                        className="activity-graph-advanced__select"
                        value={period}
                        onChange={handlePeriodChange}
                    >
                        <option value="week">Неделя</option>
                        <option value="month">Месяц</option>
                        <option value="quarter">Квартал</option>
                    </select>
                </label>
            </div>

            <div className="activity-graph-advanced__table-wrapper">
                <table className="activity-graph-advanced__table">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>План</th>
                            <th>Факт</th>
                            <th>Комментарий</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(({ date, plannedWorkouts, actualWorkouts, comment }) => {
                            let status: 'success' | 'missed' | 'partial' = 'partial';
                            if (actualWorkouts >= plannedWorkouts) {
                                status = 'success';
                            } else if (actualWorkouts === 0) {
                                status = 'missed';
                            } else {
                                status = 'partial';
                            }

                            return (
                                <tr key={date} className={`activity-graph-advanced__row activity-graph-advanced__row--${status}`}>
                                    <td>{formatDate(date)}</td>
                                    <td>{plannedWorkouts}</td>
                                    <td>{actualWorkouts}</td>
                                    <td>{comment || '-'}</td>
                                    <td>
                                        {status === 'success' && <span className="status-badge status-badge--success">✔</span>}
                                        {status === 'partial' && <span className="status-badge status-badge--partial">~</span>}
                                        {status === 'missed' && <span className="status-badge status-badge--missed">✘</span>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="activity-graph-advanced__trend">
                {trend === null
                    ? (
                        <p>Недостаточно данных для вычисления тренда</p>
                    )
                    : (
                        <p>
                        Тренд активности: {getTrendText(trend)}
                        </p>
                    )}
            </div>
        </section>
    );
};

export default ActivityGraphAdvanced;
