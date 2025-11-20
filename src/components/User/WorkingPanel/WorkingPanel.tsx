import React, { PropsWithChildren, useRef } from 'react';
import './WorkingPanel.style.scss';
import { useLocation } from 'react-router';
import { inject, observer } from 'mobx-react';
import { StartWidget } from '../Widgets/StartWidget';
import UserStore from '../../../store/userStore';
import FloatingWidget from '../Widgets/FloatingWidget';
import { CurrentWorkoutWidget } from '../Widgets/CurrentWorkoutWidget/CurrentWorkoutWidget';
import { ActivePlanWidget } from '../Widgets/ActivePlanWidget/ActivePlanWidget';

import { useCapacitorKeyboardAvoiding } from '../../Common/useCapacitorKeyboardAvoiding';
import SmallControlPanel from '../../Common/SmallControlPanel/SmallControlPanel';
import { isIOS } from '../../../utils/isIos';

interface WorkingPanelProps {
  children: React.ReactNode;
  userStore?: UserStore;
}

export const WorkingPanel: React.FC<PropsWithChildren<WorkingPanelProps>> = inject( 'userStore','userController')(
    observer(({ children, userStore }) => {
        const location = useLocation();
        const containerRef = useRef<HTMLDivElement>(null);

        if (isIOS) {
            useCapacitorKeyboardAvoiding(containerRef);
        }

        return (
            <div className="working-panel" id="working-panel" ref={containerRef} >
                {location.pathname !== '/' && <SmallControlPanel/>}
                {location.pathname === '/'  &&
        <div className="widgets">
            {userStore?.userProfile && (!userStore?.userProfile?.has_exercises && !userStore?.userProfile?.has_workouts) && (
                <StartWidget />
            )}

            {userStore?.userProfile?.active_plan?.has_active_plan && (
                <FloatingWidget>
                    <ActivePlanWidget />
                </FloatingWidget>
            )}

            {userStore?.userProfile?.has_active_workout && (
                <FloatingWidget>
                    <div className="widget-content">
                        <CurrentWorkoutWidget />
                    </div>
                </FloatingWidget>
            )}
        </div>}
                {children}
            </div>

        );
    })
);
