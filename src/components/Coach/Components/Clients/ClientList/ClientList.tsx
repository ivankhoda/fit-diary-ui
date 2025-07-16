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

            <div className="client-list__grid">
                <React.Fragment>
                    {paginatedClients.map(client => (
                        <ClientCard key={client.id} client={client} />
                    ))}
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
                </React.Fragment>
            </div>
        </div>
    );
};

export default inject('clientsStore', 'clientsController')(observer(ClientList));
