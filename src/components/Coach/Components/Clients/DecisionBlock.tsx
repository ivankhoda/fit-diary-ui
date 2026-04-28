import React from 'react';

type Decision = {
    action?: string;
    alerts?: string[];
    priority?: 'high' | 'medium' | 'low';
    reason: string;
    score?: number;
};

interface DecisionBlockProps {
    decision?: Decision;
    alerts?: string[];
    t: (key: string) => string;
}

const DecisionBlock: React.FC<DecisionBlockProps> = ({ decision, alerts, t }) => {
    if (!decision && (!alerts || alerts.length === 0)) {
        return null;
    }

    return (
        <>

            {alerts && alerts.length > 0 && (
                <div
                    className="client-card__alerts-block"
                    style={{ margin: '12px 0 0 0' }}
                >
                    <div
                        className="client-card__alerts-title"
                        style={{ color: '#e53935', fontWeight: 600 }}
                    >
                        {t('clientCard.alerts_title') || 'Alerts'}:
                    </div>
                    <div
                        className="client-card__alerts-list"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8,
                            marginTop: 4,
                        }}
                    >
                        {alerts.map((alert, idx) => (
                            <span
                                key={alert + idx}
                                className="client-card__alert-badge"
                                style={{
                                    background: '#ffebee',
                                    borderRadius: 8,
                                    color: '#b71c1c',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    padding: '2px 10px',
                                }}
                            >
                                {alert}
                            </span>
                        ))}
                    </div>
                </div>

            )}
            {decision && (
                <div className="client-card__decision-block">

                    {decision.action && (
                        <div className="client-card__decision-action">
                            {decision.action}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DecisionBlock;
