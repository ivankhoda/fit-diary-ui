import React, { useCallback, useEffect, useRef } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';
import './SimpleModal.style.scss';

import { clientsController } from '../../controllers/global';
import { clientsStore } from '../../store/global';

interface Props {
    visible: boolean;
    onClose: () => void;
    workoutId: number;
    onAssign: (clientId: number, workoutId: number) => Promise<void>;
    clientsStore?: typeof clientsStore;
    clientsController?: typeof clientsController;
}

const AssignWorkoutModal: React.FC<Props> = observer(({
    visible,
    onClose,
    workoutId,
    onAssign,
    clientsStore: injectedClientsStore,
    clientsController: injectedClientsController
}) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (visible && injectedClientsStore?.clients.length === 0) {
            injectedClientsController?.fetchClients();
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible,
        onClose,
        injectedClientsStore,
        injectedClientsController]);

    if (!visible) {return null;}

    const clients = injectedClientsStore?.clients || [];

    const options = [
        { label: 'Выбрать всех', value: 'ALL' }, ...clients.map(client => ({ label: client.name || client.email, value: client.id })),
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = useCallback(async(selected: any) => {
        if (!selected) {return;}

        const selectedValues = Array.isArray(selected) ? selected.map(s => s.value) : [selected.value];

        if (selectedValues.includes('ALL')) {
            const allClientIds = clients.map(c => c.id);
            await Promise.all(allClientIds.map(id => onAssign(id, workoutId)));
        } else {
            const newClients = selectedValues.filter(v => v !== 'ALL');
            await Promise.all(newClients.map(id => onAssign(id, workoutId)));
        }
    }, [clients,
        onAssign,
        workoutId,
        onClose]);
    console.log('AssignWorkoutModal rendered , clients:', clients);
    return (
        <div className="simple-modal-overlay">
            <div className="simple-modal" ref={modalRef}>
                <h3>Назначить тренировку</h3>
                <Select
                    isMulti
                    options={options}
                    onChange={handleChange}
                    classNamePrefix="react-select"
                    placeholder="Выберите клиентов..."
                />
                <div className="modal-actions">
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
});

export default inject('clientsStore', 'clientsController')(AssignWorkoutModal);
