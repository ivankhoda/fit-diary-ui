/* eslint-disable max-statements */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { clientsController } from '../../../controllers/global';

import ClientCard from '../ClientCard';
import ClientFilters from './ClientFilters/ClientFilters';
import { clientsStore } from '../../../store/global';

import './ClientList.style.scss';

const ITEMS_PER_PAGE = 12;
const MAX_VISIBLE_PAGES = 5;
const CLIENT_ATTENTION_DAYS_THRESHOLD = 7;
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const ONE_DAY_IN_MS = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;

type ClientListSummaryItem = {
    label: string;
    value: number;
};

const getClientListSummary = (clients: typeof clientsStore.clients): ClientListSummaryItem[] => {
    const activeClientsCount = clients.filter(client => Boolean(client.lastActive)).length;
    const noPlanClientsCount = clients.filter(client => {
        const assignedPlansCount = client.assigned_plans_by_coach?.length || 0;

        return assignedPlansCount === 0 && !client.planTitle && !client.plan?.name;
    }).length;
    const needsAttentionCount = clients.filter(client => {
        if (!client.lastActive) {
            return true;
        }

        const inactiveDays = (Date.now() - new Date(client.lastActive).getTime()) / ONE_DAY_IN_MS;
        return inactiveDays >= CLIENT_ATTENTION_DAYS_THRESHOLD;
    }).length;

    return [
        { label: 'Всего', value: clients.length },
        { label: 'С активностью', value: activeClientsCount },
        { label: 'Без плана', value: noPlanClientsCount },
        { label: 'Требуют внимания', value: needsAttentionCount },
    ];
};

const ClientList: React.FC = () => {
    const [search, setSearch] = useState('');
    const [activityStatus, setActivityStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortBy, setSortBy] = useState<'alphabet' | 'lastActive'>('alphabet');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        clientsController.fetchClients();
    }, []);

    const filteredClients = useMemo(() => {
        let result = [...clientsStore.clients];

        if (search.trim()) {
            result = result.filter(client =>
                (client.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (client.email || '').toLowerCase().includes(search.toLowerCase()));
        }

        if (activityStatus === 'active') {
            result = result.filter(client => client.lastActive);
        } else if (activityStatus === 'inactive') {
            result = result.filter(client => !client.lastActive);
        }

        if (sortBy === 'alphabet') {
            result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortBy === 'lastActive') {
            result.sort((a, b) => {
                const aDate = a.lastActive ? new Date(a.lastActive).getTime() : 0;
                const bDate = b.lastActive ? new Date(b.lastActive).getTime() : 0;
                return bDate - aDate;
            });
        }

        return result;
    }, [search,
        activityStatus,
        sortBy,
        clientsStore.clients]);

    const listSummary = useMemo(
        () => getClientListSummary(filteredClients),
        [filteredClients],
    );

    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getPageNumbers = () => {
        const pages = [];
        // eslint-disable-next-line no-magic-numbers
        const half = Math.floor(MAX_VISIBLE_PAGES / 2);
        let start = Math.max(1, currentPage - half);
        const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

        if (end - start < MAX_VISIBLE_PAGES - 1) {
            start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
        }

        // eslint-disable-next-line no-plusplus
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFirstPageClick = useCallback(() => handlePageChange(1), []);
    const handlePrevPageClick = useCallback(() => handlePageChange(currentPage - 1), [currentPage, totalPages]);
    const handleNextPageClick = useCallback(() => handlePageChange(currentPage + 1), [currentPage, totalPages]);
    const handleLastPageClick = useCallback(() => handlePageChange(totalPages), [totalPages]);
    const handlePageNumberClick = (page: number) => handlePageChange(page);

    // Factory to avoid inline arrow function in JSX
    const handlePageNumberClickFactory = (page: number) => () => handlePageNumberClick(page);

    return (
        <div className="client-list">
            <ClientFilters
                search={search}
                onSearchChange={setSearch}
                activityStatus={activityStatus}
                onActivityStatusChange={setActivityStatus}
                sortBy={sortBy}
                onSortByChange={setSortBy}
            />

            <div className="client-list__toolbar">
                <p className="client-list__result-count">
                    Показано {filteredClients.length} из {clientsStore.clients.length}
                </p>
                <div className="client-list__summary">
                    {listSummary.map(summaryItem => (
                        <div key={summaryItem.label} className="client-list__summary-item">
                            <span className="client-list__summary-value">{summaryItem.value}</span>
                            <span className="client-list__summary-label">{summaryItem.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="client-list__grid">
                {paginatedClients.length > 0
                    ? paginatedClients.map(client => (
                        <ClientCard key={client.id} client={client} />
                    ))
                    : (
                        <div className="client-list__empty">
                            По текущим фильтрам спортсмены не найдены. Попробуйте снять часть ограничений.
                        </div>
                    )}

                {totalPages > 1 && (
                    <div className="client-list__pagination">
                        <button
                            className="client-list__pagination-button"
                            onClick={handleFirstPageClick}
                            disabled={currentPage === 1}
                        >
                        « Первая
                        </button>
                        <button
                            className="client-list__pagination-button"
                            onClick={handlePrevPageClick}
                            disabled={currentPage === 1}
                        >
                        ‹
                        </button>
                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                className={`client-list__pagination-page ${page === currentPage ? 'active' : ''}`}
                                onClick={handlePageNumberClickFactory(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="client-list__pagination-button"
                            onClick={handleNextPageClick}
                            disabled={currentPage === totalPages}
                        >
                        ›
                        </button>
                        <button
                            className="client-list__pagination-button"
                            onClick={handleLastPageClick}
                            disabled={currentPage === totalPages}
                        >
                        Последняя »
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default inject('clientsStore', 'clientsController')(observer(ClientList));
