import React from 'react';
import { ClientInterface } from '../../../store/clientsStore';

interface ClientOverviewProps {
    client: ClientInterface;
}

const ClientOverview = ({ client }: ClientOverviewProps): JSX.Element => {
    const {overview} = client;

    if (!overview) {return <div>Нет данных</div>;}

    return (
        <section className="client-overview">
            <div className="client-overview__hero">
                <div className="client-overview__identity">
                    <div className={`client-overview__status client-overview__status--${overview.activity.tone}`}>
                        {overview.activity.label}
                    </div>
                    <h1 className="client-overview__name">{client.name || 'Без имени'}</h1>
                    <p className="client-overview__subtitle">{overview.activity.description}</p>
                    <div className="client-overview__contacts">
                        {overview.contacts.map(contact => (
                            <span key={contact} className="client-overview__contact-chip">{contact}</span>
                        ))}
                    </div>
                </div>

                <div className="client-overview__primary-action">
                    <span className="client-overview__primary-label">{overview.primary_action.label}</span>
                    <strong className="client-overview__primary-value">{overview.primary_action.value}</strong>
                    <span className="client-overview__primary-note">{overview.primary_action.note}</span>
                </div>
            </div>

            <div className="client-overview__metrics">
                {overview.metrics.map(metric => (
                    <article key={metric.label} className="client-overview__metric-card">
                        <span className="client-overview__metric-label">{metric.label}</span>
                        <strong className="client-overview__metric-value">{metric.value}</strong>
                        <span className="client-overview__metric-note">{metric.note}</span>
                    </article>
                ))}
            </div>

            <div className="client-overview__signals">
                {overview.signals.map(signal => (
                    <article key={signal.label} className="client-overview__signal-card">
                        <span className="client-overview__signal-label">{signal.label}</span>
                        <p className="client-overview__signal-value">{signal.value}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ClientOverview;
