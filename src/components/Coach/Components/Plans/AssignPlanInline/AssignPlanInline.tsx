import React, { useCallback, useEffect } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';

import { clientsStore } from '../../../store/global';
import { clientsController } from '../../../controllers/global';

interface Props {
    planId: number;
    onAssign: (clientId: number, planId: number) => void;
    clientsStore?: typeof clientsStore;
    clientsController?: typeof clientsController;
    open?: boolean
}

const AssignPlanInline: React.FC<Props> = observer(({
    planId,
    onAssign,
    clientsStore: injectedClientsStore,
    clientsController: injectedClientsController,
}) => {
    useEffect(() => {
        if (injectedClientsStore?.clients.length === 0) {
            injectedClientsController?.fetchClients();
        }
    }, [injectedClientsStore, injectedClientsController]);

    const clients = injectedClientsStore?.clients || [];

    const options = [
        { label: 'Выбрать всех', value: 'ALL' }, ...clients.map(client => ({
            label: client.name || client.email,
            value: client.id
        })),
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange =  useCallback(async(selected: any) => {
        if (!selected) {return;}

        const selectedValues = Array.isArray(selected)
            ? selected.map(s => s.value)
            : [selected.value];

        if (selectedValues.includes('ALL')) {
            const allClientIds = clients.map(c => c.id);
            await Promise.all(allClientIds.map(id => onAssign(id, planId)));
        } else {
            const newClients = selectedValues.filter(v => v !== 'ALL');
            await Promise.all(newClients.map(id => onAssign(id, planId)));
        }
    },[]);

    return (
        <div className="assign-plan-inline">
            <h4>Назначить клиентам</h4>
            <Select
                isMulti
                options={options}
                onChange={handleChange}
                classNamePrefix="react-select"
                placeholder="Выберите клиентов..."
            />
        </div>
    );
});

export default inject('clientsStore', 'clientsController')(AssignPlanInline);
