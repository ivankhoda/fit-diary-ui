import React, { useEffect } from 'react';
import ClientCard from './ClientCard';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import { clientsController } from '../../controllers/global';
import { clientsStore } from '../../store/global';

const ClientList: React.FC = () => {
    useEffect(() => {
        clientsController.fetchClients();
    }, []);

    return (
        <div className="grid gap-4">
            {clientsStore.clients.map(client => (
                <ClientCard key={client.id} client={client} />
            ))}
        </div>
    );
};

export default inject('clientsStore', 'clientsController')(observer(ClientList));
