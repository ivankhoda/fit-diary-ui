import React from 'react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  note?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, note }) => (
    <div className="kpi-card">
        <span className="kpi-card__label">{label}</span>
        <strong className="kpi-card__value">{value}</strong>
        {note && <span className="kpi-card__note">{note}</span>}
    </div>
);

export default KpiCard;
