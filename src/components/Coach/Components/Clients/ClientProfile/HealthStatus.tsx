/* eslint-disable sort-keys */
import React from 'react';

interface HealthStatusProps {
  status: 'normal' | 'attention' | 'risk';
  adherence: number;
  trend: string;
  mood?: string;
}

const statusMap = {
    normal: { label: 'В норме', color: 'green' },
    attention: { label: 'Требует внимания', color: 'yellow' },
    risk: { label: 'Риск оттока', color: 'red' },
};

const HealthStatus: React.FC<HealthStatusProps> = ({ status, adherence, trend, mood }) => {
    const { label, color } = statusMap[status];
    return (
        <div className={`health-status health-status--${color}`}>
            <span className="health-status__label">{label}</span>
            <span className="health-status__adherence">adherence: {adherence}%</span>
            <span className="health-status__trend">тренд: {trend}</span>
            {mood && <span className="health-status__mood">самочувствие: {mood}</span>}
        </div>
    );
};

export default HealthStatus;
