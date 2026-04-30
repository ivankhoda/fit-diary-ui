import React from 'react';
import './ClientOverview.style.scss';
import { ClientInterface } from '../../../store/clientsStore';

import CTASection from './CTASection';

import { t } from 'i18next';
import ClientGoalsBlock from '../ClientGoalsBlock';
import DecisionBlock from '../DecisionBlock';
import ClientWorkoutsOverview from './ClientWorkoutsOverview';
import coachSettingsStore from '../../../../../store/coachSettingsStore';

type OverViewClientInterface = {
    client: ClientInterface;
};

const { useState, useCallback, useEffect } = React;

const ClientOverview = ({ client }: OverViewClientInterface): JSX.Element => {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'user_workouts'>(coachSettingsStore.clientOverviewTab);

    useEffect(() => {
        setSelectedTab(coachSettingsStore.clientOverviewTab);
    }, []);

    const handleTabOverview = useCallback(() => {
        setSelectedTab('overview');
        coachSettingsStore.setClientOverviewTab('overview');
    }, []);

    const handleTabWorkouts = useCallback(() => {
        setSelectedTab('user_workouts');
        coachSettingsStore.setClientOverviewTab('user_workouts');
    }, []);

    // CTA handlers (replace with real logic)
    const handleAssignWorkout = useCallback(() => {
        console.log('Назначить тренировку');
    }, []);
    const handleWriteMessage = useCallback(() => {
        console.log('Написать в чат');
    }, []);
    /*
     * Const handleAddNote = useCallback(() => {
     *     console.log('Добавить заметку');
     * }, []);
     */

    const { decision, alerts } = client;

    return (
        <section className="client-overview">
            <header className="client-overview__header">
                <span className="client-overview__name">{client.name || 'Без имени'}</span>
                {client.email && <span className="client-overview__email">{client.email}</span>}
            </header>

            {Array.isArray(client.goals_summary) && client.goals_summary.length > 0 && (
                <ClientGoalsBlock goals={client.goals_summary} t={t} />
            )}

            <DecisionBlock decision={decision} alerts={alerts} t={t} />

            {/* Recommended action */}
            <CTASection
                primary={{ label: 'Назначить тренировку', onClick: handleAssignWorkout }}
                secondary={{ label: 'Написать в чат', onClick: handleWriteMessage }}
            />

            {/* Tabs */}
            <nav className="client-overview__tabs tabs">
                <button
                    className={`tabs__item${selectedTab === 'overview' ? ' tabs__item--active' : ''}`}
                    type="button"
                    onClick={handleTabOverview}
                >
                    Обзор
                </button>
                <button
                    className={`tabs__item${selectedTab === 'user_workouts' ? ' tabs__item--active' : ''}`}
                    type="button"
                    onClick={handleTabWorkouts}
                >
                    Тренировки
                </button>
            </nav>

            {selectedTab === 'user_workouts' && <ClientWorkoutsOverview clientId={client.id} />}
        </section>
    );
};

export default ClientOverview;
