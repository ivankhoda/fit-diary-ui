import React, { PropsWithChildren, useEffect, useRef } from "react";
import "./WorkingPanel.style.scss";
import { useLocation } from "react-router";
import { inject, observer } from "mobx-react";
import { StartWidget } from "../Widgets/StartWidget";
import UserController from "../../../controllers/UserController";
import UserStore from "../../../store/userStore";
import FloatingWidget from "../Widgets/FloatingWidget";
import { CurrentWorkoutWidget } from "../Widgets/CurrentWorkoutWidget/CurrentWorkoutWidget";
import { LastWorkoutsWidget } from "../Widgets/LastWorkoutWidget/LastWorkoutWidget";
import { ActivePlanWidget } from "../Widgets/ActivePlanWidget/ActivePlanWidget";

import { useCapacitorKeyboardAvoiding } from "../../Common/useCapacitorKeyboardAvoiding";
import BackButton from "../../Common/BackButton/BackButton";
import { Small } from "../../../stories/Button.stories";
import SmallControlPanel from "../../Common/SmallControlPanel/SmallControlPanel";

interface WorkingPanelProps {
  children: any;
  userStore?: UserStore;
  userController?: UserController;
}

export const WorkingPanel: React.FC<PropsWithChildren<WorkingPanelProps>> = inject(
  "userStore",
  "userController"
)(
  observer(({ children, userStore, userController }) => {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (userController) {
        userController.getUser();
      }
    }, [userController]);
    useEffect(() => {

}, );

 const isIOS = /iPad|iPhone|iPod/u.test(navigator.userAgent) && !('MSStream' in window);
 if (isIOS) {
    useCapacitorKeyboardAvoiding(containerRef);
 }



    return (
      <div className="working-panel" id="working-panel" ref={containerRef} >
        {location.pathname !== "/" && <SmallControlPanel/>}
    {location.pathname === "/"  && <div className="widgets">
      {userStore?.userProfile && (!userStore?.userProfile?.has_exercises && !userStore?.userProfile?.has_workouts) && (
        <StartWidget />
      )}

      {userStore?.userProfile?.active_plan?.has_active_plan && (
        <FloatingWidget>
          <ActivePlanWidget />
        </FloatingWidget>
      )}

      {/* {location.pathname === "/" && userStore?.userProfile && !userStore.userProfile.has_active_workout || !userStore?.userProfile?.active_plan?.has_active_plan && (
        <FloatingWidget>
          <LastWorkoutsWidget />
        </FloatingWidget>
      )} */}

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
