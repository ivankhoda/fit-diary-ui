// Pages/ClientProfile/Tabs.tsx
import React, { useCallback } from 'react';
import './Tabs.scss';

interface TabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'info', label: 'Информация' },
    { id: 'goals', label: 'Цели' },
    { id: 'assignWorkout', label: 'Назначенные тренировки' },
    { id: 'assignPlan', label: 'Назначить план' },
    { id: 'progress', label: 'Прогресс' },

];

const Tabs: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
    const handleTabClick = useCallback((tabId: string) => {
        onTabChange(tabId);
    }, [onTabChange]);

    const tabClickHandlers = React.useMemo(
        () =>
            tabs.reduce<Record<string, () => void>>((acc, tab) => {
                acc[tab.id] = () => handleTabClick(tab.id);
                return acc;
            }, {}),
        [handleTabClick]
    );

    return (
        <div className="tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tabs__item ${activeTab === tab.id ? 'tabs__item--active' : ''}`}
                    onClick={tabClickHandlers[tab.id]}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
