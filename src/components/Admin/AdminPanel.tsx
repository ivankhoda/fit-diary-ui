import React, { useState, useCallback } from 'react';
import AsidePanel from './AsidePanel/AsidePanel';
import './AdminPanel.style.scss';

interface AdminPanelProps {
    children?: React.ReactNode;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ children }) => {
    const [isAsideVisible, setIsAsideVisible] = useState(true);

    // Memoized toggle function to show/hide the aside panel
    const toggleAside = useCallback(() => {
        setIsAsideVisible(prev => !prev);
    }, []);

    return (
        <div className={'admin-grid'}>
            <header className="admin-header">
                <h1>Admin Panel</h1>
                <button onClick={toggleAside} className="toggle-aside-button">
                    {isAsideVisible ? 'Hide Menu' : 'Show Menu'}
                </button>
            </header>
            {isAsideVisible && (
                <aside className={`admin-aside ${isAsideVisible ? '' : 'aside-hidden'}`}>
                    <AsidePanel />
                </aside>
            )}
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
};

export default AdminPanel;
