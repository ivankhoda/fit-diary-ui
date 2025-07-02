import React from 'react';

import './CoachWorkingPanel.style.scss';

interface CoachPanelProps {
    children?: React.ReactNode;
}

const CoachPanel: React.FC<CoachPanelProps> = ({ children }) => (
    <div className={'admin-grids' }>

        <main className="admin-main">
            {children}
        </main>
    </div>
);

export default CoachPanel;
