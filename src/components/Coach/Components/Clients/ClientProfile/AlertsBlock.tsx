import React from 'react';

export interface AlertItem {
  text: string;
  severity: 'low' | 'medium' | 'high';
}

interface AlertsBlockProps {
  alerts: AlertItem[];
}

const AlertsBlock: React.FC<AlertsBlockProps> = ({ alerts }) => (
    <div className="alerts-block">
        <h3>Риски</h3>
        <ul>
            {alerts.map((a, i) => (
                <li key={i} className={`alert-severity--${a.severity}`}>{a.text}</li>
            ))}
        </ul>
    </div>
);

export default AlertsBlock;
