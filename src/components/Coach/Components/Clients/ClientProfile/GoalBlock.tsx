import React from 'react';

export interface GoalBlockProps {
  title: string;
  deadline?: string;
  progress: number;
  details?: string[];
}

const GoalBlock: React.FC<GoalBlockProps> = ({ title, deadline, progress, details }) => (
    <div className="goal-block">
        <h3>Цель</h3>
        <div className="goal-block__main">
            <span className="goal-block__title">{title}</span>
            {deadline && <span className="goal-block__deadline">Дедлайн: {deadline}</span>}
            <span className="goal-block__progress">Прогресс: {progress}%</span>
        </div>
        {details && details.length > 0 && (
            <ul className="goal-block__details">
                {details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
        )}
    </div>
);

export default GoalBlock;
