// Pages/ClientProfilePage.tsx
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { clientsController, coachWorkoutsController } from '../../../controllers/global';
import { ClientInterface } from '../../../store/clientsStore';
import { clientsStore } from '../../../store/global';

import AssignWorkoutSection from './AssignWorkoutSection/AssignWorkoutSection';
import Tabs from './Tabs/Tabs';

import './ClientProfilePage.scss';

import ClientPlanAssignments from './ClientPlanAssignments';
import ClientOverview from './ClientOverview';

const DEFAULT_TAB = 'overview';

const getClientDisplayName = (client: ClientInterface): string => client.name || client.email || `Клиент #${client.id}`;

type ClientSwitcherState = {
    handleClientSelect: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleNextClient: () => void;
    handlePreviousClient: () => void;
    nextClient: ClientInterface | null;
    previousClient: ClientInterface | null;
    sortedClients: ClientInterface[];
};

const useClientSwitcher = (selectedClientId: number): ClientSwitcherState => {
    const navigate = useNavigate();

    const sortedClients = useMemo(
        () => [...clientsStore.clients].sort((leftClient, rightClient) =>
            getClientDisplayName(leftClient).localeCompare(getClientDisplayName(rightClient))),
        [clientsStore.clients],
    );

    const currentClientIndex = useMemo(
        () => sortedClients.findIndex(sortedClient => sortedClient.id === selectedClientId),
        [selectedClientId, sortedClients],
    );

    const previousClient = currentClientIndex > 0 ? sortedClients[currentClientIndex - 1] : null;
    const nextClient = currentClientIndex >= 0 && currentClientIndex < sortedClients.length - 1
        ? sortedClients[currentClientIndex + 1]
        : null;

    const handleClientNavigation = useCallback((targetClientId: number) => {
        navigate(`/coach/clients/${targetClientId}`);
    }, [navigate]);

    const handlePreviousClient = useCallback(() => {
        if (previousClient) {
            handleClientNavigation(previousClient.id);
        }
    }, [handleClientNavigation, previousClient]);

    const handleNextClient = useCallback(() => {
        if (nextClient) {
            handleClientNavigation(nextClient.id);
        }
    }, [handleClientNavigation, nextClient]);

    const handleClientSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        handleClientNavigation(Number(event.target.value));
    }, [handleClientNavigation]);

    return {
        handleClientSelect,
        handleNextClient,
        handlePreviousClient,
        nextClient,
        previousClient,
        sortedClients,
    };
};

const ClientProfilePage = (): JSX.Element => {
    const { clientId } = useParams<{ clientId: string }>();
    const [client, setClient] = useState<ClientInterface | null>(null);
    const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

    const selectedClientId = Number(clientId);
    const { handleClientSelect, handleNextClient, handlePreviousClient, nextClient, previousClient, sortedClients } =
        useClientSwitcher(selectedClientId);

    useEffect(() => {
        if (!clientId) {return;}

        const id = Number(clientId);

        if (clientsStore.clients.length === 0) {
            clientsController.fetchClients();
        }

        clientsController.fetchClientById(id).then(setClient);
        coachWorkoutsController.getWorkouts();
        coachWorkoutsController.getWorkoutsForClient(id);
    }, [clientId]);

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
    }, []);

    if (!client) {return <div className="client-profile__loading">Загрузка клиента...</div>;}

    return (
        <div className="client-profile">
            <header className="client-profile__header">
                <div className="client-profile__header-copy">
                    <span className="client-profile__eyebrow">Профиль клиента</span>
                    <h1 className="client-profile__page-title">{getClientDisplayName(client)}</h1>
                    <p className="client-profile__page-subtitle">
                        Быстрый переход между клиентами без возврата в общий список.
                    </p>
                </div>

                <div className="client-profile__switcher">
                    <button
                        className="client-profile__switcher-button"
                        disabled={!previousClient}
                        onClick={handlePreviousClient}
                        type="button"
                    >
                        ← {previousClient ? getClientDisplayName(previousClient) : 'Предыдущего нет'}
                    </button>

                    <label className="client-profile__switcher-select-wrap">
                        <span className="client-profile__switcher-label">Быстрый выбор</span>
                        <select
                            className="client-profile__switcher-select"
                            onChange={handleClientSelect}
                            value={client.id}
                        >
                            {sortedClients.map(sortedClient => (
                                <option key={sortedClient.id} value={sortedClient.id}>
                                    {getClientDisplayName(sortedClient)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        className="client-profile__switcher-button"
                        disabled={!nextClient}
                        onClick={handleNextClient}
                        type="button"
                    >
                        {nextClient ? `${getClientDisplayName(nextClient)} →` : 'Следующего нет'}
                    </button>
                </div>
            </header>

            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
            <ClientOverview client={client} />
            {/* {activeTab === 'overview' && client && (

            )} */}

            {activeTab === 'assignWorkout' && <AssignWorkoutSection clientId={Number(clientId)} />}

            {activeTab === 'assignPlan' && (
                <ClientPlanAssignments client={client} onClientChange={setClient} />
            )}

            {/* {activeTab === 'progress' && (
                <ClientProgress clientId={clientId} />
            )} */}

            {activeTab === 'goals' && (
                <div className="client-profile__placeholder">
                    Раздел будет добавлен позже.
                </div>
            )}
        </div>
    );
};

export default observer(ClientProfilePage);
