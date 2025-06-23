// Pages/ClientProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { clientsController, coachWorkoutsController } from '../../../controllers/global';
import { ClientInterface } from '../../../store/clientsStore';

import AssignWorkoutSection from './AssignWorkoutSection/AssignWorkoutSection';
import Tabs from './Tabs/Tabs';

import './ClientProfilePage.scss';
import BackButton from '../../../../Common/BackButton/BackButton';
import ClientProgress from './ClientProgress/ClientProgress';

const ClientProfilePage = (): JSX.Element => {
    const { clientId } = useParams<{ clientId: string }>();
    const [client, setClient] = useState<ClientInterface | null>(null);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        if (!clientId) {return;}

        const id = Number(clientId);
        clientsController.fetchClientById(id).then(setClient);
        coachWorkoutsController.getWorkouts();
        coachWorkoutsController.getWorkoutsForClient(id);
    }, [clientId]);

    if (!client) {return <div className="client-profile__loading">Загрузка клиента...</div>;}

    return (
        <div className="client-profile">
            <BackButton/>
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'info' && (
                <div className="client-profile__info">
                    <h1 className="client-profile__name">{client.name || 'Без имени'}</h1>
                    <p className="client-profile__email">{client.email}</p>
                </div>
            )}

            {activeTab === 'assignWorkout' && <AssignWorkoutSection clientId={Number(clientId)} />}

            {activeTab === 'assignPlan' && (
                <div className="client-profile__placeholder">
                    Функционал назначения плана скоро будет доступен.
                </div>
            )}

            {activeTab === 'progress' && (
                <ClientProgress clientId={clientId} />
            )}

            {activeTab === 'goals' && (
                <div className="client-profile__placeholder">
                    Раздел будет добавлен позже.
                </div>
            )}
        </div>
    );
};

export default observer(ClientProfilePage);
