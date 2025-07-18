import React, { useRef } from 'react';

import './CoachWorkingPanel.style.scss';
import SmallControlPanel from '../../../Common/SmallControlPanel/SmallControlPanel';
import { isIOS } from '../../../../utils/isIos';
import { useCapacitorKeyboardAvoiding } from '../../../Common/useCapacitorKeyboardAvoiding';
import { useLocation } from 'react-router';

interface CoachPanelProps {
    children?: React.ReactNode;
}

const CoachPanel: React.FC<CoachPanelProps> = ({ children }) => {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    if (isIOS) {
        useCapacitorKeyboardAvoiding(containerRef);
    }

    if (isIOS) {
        useCapacitorKeyboardAvoiding(containerRef);
    }

    return (<div className={'admin-grids'} ref={containerRef}>

        <main className="admin-main">
            {location.pathname !== '/' && <SmallControlPanel/>}
            {children}
        </main>
    </div>);
};

export default CoachPanel;
