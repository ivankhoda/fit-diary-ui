/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
import React, { useMemo} from 'react';
import './ActivityGraph.style.scss';

interface ActivityDataPoint {
  date: string;
  plannedWorkouts: number;
  actualWorkouts: number;
  comment: string;
}

interface ActivityGraphAdvancedProps {
  data: ActivityDataPoint[];
  defaultPeriod?: 'week' | 'month' | 'quarter';
}

const formatDate = (iso: string) => iso;

const getTrendText = (trend: number) => {
    if (trend > 0) {return '↑ Растёт';}
    if (trend < 0) {return '↓ Падает';}
    return '→ Стабильна';
};

const ActivityGraphAdvanced: React.FC<ActivityGraphAdvancedProps> = ({
    data,

}) => {
    const filteredData = useMemo(() => data, [data]);

    const trend = useMemo(() => {
        if (filteredData.length < 2) {return null;}

        const first = filteredData[0].actualWorkouts;
        const last = filteredData[filteredData.length - 1].actualWorkouts;
        return (last - first) / (filteredData.length - 1);
    }, [filteredData]);

    return (
        <section className="activity-graph-advanced">
            <h3 className="activity-graph-advanced__title">График активности</h3>

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
                            if (actualWorkouts >= plannedWorkouts) {status = 'success';}
                            else if (actualWorkouts === 0) {status = 'missed';}

                            return (
                                <tr
                                    key={date}
                                    className={`activity-graph-advanced__row activity-graph-advanced__row--${status}`}
                                >
                                    <td>{formatDate(date)}</td>
                                    <td>{plannedWorkouts}</td>
                                    <td>{actualWorkouts}</td>
                                    <td>{comment}</td>
                                    <td>
                                        {status === 'success' && (
                                            <span className="status-badge status-badge--success">✔</span>
                                        )}
                                        {status === 'partial' && (
                                            <span className="status-badge status-badge--partial">~</span>
                                        )}
                                        {status === 'missed' && (
                                            <span className="status-badge status-badge--missed">✘</span>
                                        )}
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
                        <p>Тренд активности: {getTrendText(trend)}</p>
                    )}
            </div>
        </section>
    );
};

export default ActivityGraphAdvanced;
