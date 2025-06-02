/* eslint-disable no-magic-numbers */
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { plansStore, userStore } from '../../../../store/global';
import { plansController } from '../../../../controllers/global';

import './ActivePlanWidget.style.scss';
import { CurrentWorkoutDayInfo } from './CurrentWorkoutDay';
import { PlanHeader } from './PlanHeader';

export const ActivePlanWidget = observer((): React.JSX.Element | null => {
    const { currentPlan } = plansStore;
    const { userProfile } = userStore;

    useEffect(() => {
        if (userProfile?.active_plan?.plan_id && !currentPlan) {
            plansController.getPlanDetails(userProfile.active_plan.plan_id);
        }
    }, [userProfile?.active_plan?.plan_id, currentPlan]);

    if (!currentPlan) {
        return null;
    }

    return (
        <div className="active-plan-widget">
            <h3 className="widget-title">Активный план</h3>
            <div className="plan-info">
                <PlanHeader name={currentPlan.name} description={currentPlan.description} />
                <CurrentWorkoutDayInfo day={currentPlan.current_workout_day} planId={currentPlan.id} />
            </div>
        </div>
    );
});
