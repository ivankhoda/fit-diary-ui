import React from 'react';

import './CoachWorkingPanel.style.scss';
import SmallControlPanel from '../../../Common/SmallControlPanel/SmallControlPanel';

interface CoachPanelProps {
    children?: React.ReactNode;
}

const CoachPanel: React.FC<CoachPanelProps> = ({ children }) => (
    <div className={'admin-grids' }>

        <main className="admin-main">
            {location.pathname !== '/' && <SmallControlPanel/>}
            {children}
        </main>
    </div>
);

export default CoachPanel;
