import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import './CommonPlans.style.scss';
import { coachPlansController } from '../../Coach/controllers/global';
import { coachPlansStore } from '../../Coach/store/global';
import PlanCard from '../../User/Plans/PlanCard/PlanCard';

const CommonPlans: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPlans = async() => {
            try {
                setIsLoading(true);
                await coachPlansController.getPlans();
            } catch (err) {
                console.error('Failed to load common plans:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (coachPlansStore?.plans?.length === 0) {
            loadPlans();
        }
    }, []);

    if (isLoading && coachPlansStore.plans?.length === 0) {
        return <div className="common-plans__loading">Загружаем планы...</div>;
    }

    const publicPlans = coachPlansStore.plans.filter(p => p?.status === 'active');

    return (
        <div className="common-plans">
            <h1 className="common-plans__title">Тренировочные планы</h1>

            {publicPlans.length === 0
                ? (
                    <p className="common-plans__empty">Пока нет доступных планов</p>
                )
                : (
                    <div className="common-plans__list">
                        {publicPlans.map(plan => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                )}
        </div>
    );
};

export default observer(CommonPlans);
