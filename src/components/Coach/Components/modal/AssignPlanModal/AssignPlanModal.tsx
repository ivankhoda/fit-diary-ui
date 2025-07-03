import React, { useCallback, useEffect, useRef } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';
import { createPortal } from 'react-dom';

import './SimpleModal.style.scss';
import { clientsStore } from '../../../store/global';
import { clientsController } from '../../../controllers/global';

interface Props {
    visible: boolean;
    onClose: () => void;
    planId: number;
    onAssign: (clientId: number, planId: number) => Promise<void>;
    clientsStore?: typeof clientsStore;
    clientsController?: typeof clientsController;
}

const AssignPlanModal: React.FC<Props> = observer(({
    visible,
    onClose,
    planId,
    onAssign,
    clientsStore: injectedClientsStore,
    clientsController: injectedClientsController
}) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const modalRoot = document.getElementById('modal-root');

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

    if (!visible || !modalRoot) { return null; }

    const clients = injectedClientsStore?.clients || [];

    const options = [
        { label: 'Выбрать всех', value: 'ALL' }, ...clients.map(client => ({
            label: client.name || client.email,
            value: client.id
        })),
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = useCallback(async(selected: any) => {
        if (!selected) { return; }

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
    }, [clients,
        onAssign,
        planId]);

    return createPortal(
        <div className="simple-modal-overlay-plan">
            <div className="simple-modal" ref={modalRef}>
                <h3>Назначить план</h3>
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
        </div>,
        modalRoot
    );
});

export default inject('clientsStore', 'clientsController')(AssignPlanModal);
