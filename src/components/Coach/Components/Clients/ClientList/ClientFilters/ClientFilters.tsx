import React, { useCallback } from 'react';

import './ClientFilters.style.scss';

type ClientFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  activityStatus: 'all' | 'active' | 'inactive';
  onActivityStatusChange: (value: 'all' | 'active' | 'inactive') => void;
  sortBy: 'alphabet' | 'lastActive';
  onSortByChange: (value: 'alphabet' | 'lastActive') => void;
};

const ClientFilters: React.FC<ClientFiltersProps> = ({
    search,
    onSearchChange,
    activityStatus,
    onActivityStatusChange,
    sortBy,
    onSortByChange,
}) => {
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    },[]);

    const handleActivityStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onActivityStatusChange(e.target.value as 'all' | 'active' | 'inactive');
    }, [onActivityStatusChange]);

    const handleSortByChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortByChange(e.target.value as 'alphabet' | 'lastActive');
    }, [onSortByChange]);

    return (
        <div className="client-filters">
            <div className="client-filters__group">
                <label className="client-filters__label">Поиск</label>
                <input
                    className="client-filters__input"
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Имя или email"
                />
            </div>

            <div className="client-filters__group">
                <label className="client-filters__label">Активность</label>
                <select
                    className="client-filters__select"
                    value={activityStatus}
                    onChange={handleActivityStatusChange}
                >
                    <option value="all">Все</option>
                    <option value="active">Активные</option>
                    <option value="inactive">Неактивные</option>
                </select>
            </div>

            <div className="client-filters__group">
                <label className="client-filters__label">Сортировка</label>
                <select
                    className="client-filters__select"
                    value={sortBy}
                    onChange={handleSortByChange}
                >
                    <option value="alphabet">По алфавиту</option>
                    <option value="lastActive">По последней активности</option>
                </select>
            </div>
        </div>
    );
};

export default ClientFilters;
