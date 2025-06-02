import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import './Plans.style.scss';
import { plansStore } from '../../../store/global';
import { plansController } from '../../../controllers/global';

import PlanCard from './PlanCard/PlanCard';

type PlanStatus = 'draft' | 'active' | 'completed' | 'paused';

const statusOptions: { label: string; value: PlanStatus }[] = [
    { label: 'Активные', value: 'active' },
    { label: 'Черновики', value: 'draft' },
    { label: 'Приостановленные', value: 'paused' },
    { label: 'Завершенные', value: 'completed' },
];

const Plans: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<PlanStatus>('draft');

    const navigate = useNavigate();

    useEffect(() => {
        const loadPlans = async() => {
            try {
                setIsLoading(true);
                await plansController.getPlans();
            } catch (err) {
                console.error('Failed to load plans:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (plansStore?.plans?.length === 0) {
            loadPlans();
        }
        setSelectedStatus('active');
    }, []);

    const handleCreateClick = useCallback(() => {
        plansStore.setCurrentPlan(null);
        navigate('/plans/create');
    }, [navigate]);

    const filteredPlans = plansStore.plans.filter(plan => plan?.status === selectedStatus);

    if (isLoading && plansStore.plans.length === 0) {
        return <div className="plans__loading">Загружаем планы...</div>;
    }

    return (
        <div className="container plans">
            <div className="plans__header">
                <h1>Мои планы</h1>
                <div onClick={handleCreateClick} className="button">
                    Новый план
                </div>
            </div>

            <div className="plans__tabs">
                {statusOptions.map(({ label, value }) => (
                    <button
                        key={value}
                        className={`plans__tab-button ${value === selectedStatus ? 'active' : ''}`}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={() => setSelectedStatus(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {filteredPlans.length === 0
                ? (
                    <p>У вас пока нет тренировочных планов с выбранным статусом</p>
                )
                : (
                    <div className="plans-list">
                        {filteredPlans.map(x => (
                            <PlanCard key={x.id} plan={x} />
                        ))}
                    </div>
                )}
        </div>
    );
};

export default observer(Plans);
