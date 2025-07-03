/* eslint-disable max-statements */
// ⬆️ твой импорт остается без изменений
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import './Plans.style.scss';
import { coachPlansStore } from '../../store/global';
import { coachPlansController } from '../../controllers/global';

import PlanCard from './PlanCard/PlanCard';

type PlanStatus = 'draft' | 'active' | 'completed' | 'paused';

const statusOptions: { label: string; value: PlanStatus }[] = [
    { label: 'Активные', value: 'active' },
    { label: 'Черновики', value: 'draft' },
    { label: 'Приостановленные', value: 'paused' },
    { label: 'Завершенные', value: 'completed' },
];

const ITEMS_PER_PAGE = 6;

const Plans: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<PlanStatus>('draft');
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const loadPlans = async() => {
            try {
                setIsLoading(true);
                await coachPlansController.getPlans();
            } catch (err) {
                console.error('Failed to load plans:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (coachPlansStore?.plans?.length === 0) {
            loadPlans();
        }
        setSelectedStatus('active');
    }, []);

    const handleCreateClick = useCallback(() => {
        coachPlansStore.setCurrentPlan(null);
        navigate('/plans/create');
    }, [navigate]);

    const filteredPlans = coachPlansStore.plans.filter(plan => plan?.status === selectedStatus);

    // Пагинация
    const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPlans = filteredPlans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleStatusChange = (value: PlanStatus) => {
        setSelectedStatus(value);
        setCurrentPage(1);
    };

    const handleStatusChangeFactory = (value: PlanStatus) => () => {
        handleStatusChange(value);
    };

    const handlePageClick = (page: number) => () => {
        setCurrentPage(page);
    };

    if (isLoading && coachPlansStore.plans?.length === 0) {
        return <div className="plans__loading">Загружаем планы...</div>;
    }

    return (
        <div className="container plans">
            <div className="plans__header">
                <h1>Мои планы</h1>
                <div onClick={handleCreateClick} className="button">
                    Новый план
                </div>
                <div className="plans__tabs">
                    {statusOptions.map(({ label, value }) => (
                        <button
                            key={value}
                            className={`plans__tab-button ${value === selectedStatus ? 'active' : ''}`}
                            onClick={handleStatusChangeFactory(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredPlans.length === 0
                ? (
                    <p>У вас пока нет тренировочных планов с выбранным статусом</p>
                )
                : (
                    <>
                        <div className="plans-list">
                            {paginatedPlans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="plans__pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`plans__page-button ${currentPage === i + 1 ? 'active' : ''}`}
                                        onClick={handlePageClick(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
        </div>
    );
};

export default observer(Plans);
