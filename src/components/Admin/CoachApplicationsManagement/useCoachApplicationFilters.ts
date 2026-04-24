import { useCallback, useState } from 'react';
import { CoachApplicationFilter } from '../../../store/coachApplicationsStore';

type SortDirection = 'asc' | 'desc';

type UseCoachApplicationFiltersResult = {
    clearFilters: () => void;
    currentPage: number;
    handlePageChange: (data: { selected: number }) => void;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSort: (sortKey: string) => void;
    handleStatusChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    searchName: string;
    sortDirection: SortDirection;
    sortKey: string;
    statusFilter: CoachApplicationFilter;
};

const DEFAULT_FILTER: CoachApplicationFilter = 'pending';

export const useCoachApplicationFilters = (): UseCoachApplicationFiltersResult => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchName, setSearchName] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [sortKey, setSortKey] = useState<string>('created_at');
    const [statusFilter, setStatusFilter] = useState<CoachApplicationFilter>(DEFAULT_FILTER);

    const clearFilters = useCallback(() => {
        setSearchName('');
        setSortKey('created_at');
        setSortDirection('asc');
        setStatusFilter(DEFAULT_FILTER);
        setCurrentPage(0);
    }, []);

    const handlePageChange = useCallback((data: { selected: number }) => {
        setCurrentPage(data.selected);
    }, []);

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(event.target.value);
        setCurrentPage(0);
    }, []);

    const handleSort = useCallback((nextSortKey: string) => {
        setCurrentPage(0);

        if (nextSortKey === sortKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            return;
        }

        setSortKey(nextSortKey);
        setSortDirection('asc');
    }, [sortDirection, sortKey]);

    const handleStatusChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(event.target.value as CoachApplicationFilter);
        setCurrentPage(0);
    }, []);

    return {
        clearFilters,
        currentPage,
        handlePageChange,
        handleSearchChange,
        handleSort,
        handleStatusChange,
        searchName,
        sortDirection,
        sortKey,
        statusFilter,
    };
};
