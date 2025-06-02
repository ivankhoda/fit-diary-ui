import React from 'react';

export const PlanHeader = ({ name, description }: { name: string; description?: string }): JSX.Element => (
    <div className="plan-header">
        <div className="plan-name">{name}</div>
        {description && <div className="plan-description">{description}</div>}
    </div>
);
