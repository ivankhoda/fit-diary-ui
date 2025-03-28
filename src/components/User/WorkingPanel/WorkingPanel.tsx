import React, { PropsWithChildren, useEffect } from "react";
import "./WorkingPanel.style.scss";
import { useLocation } from "react-router";
import { inject, observer } from "mobx-react";
import { StartWidget } from "../Widgets/StartWidget";
import UserController from "../../../controllers/UserController";
import UserStore from "../../../store/userStore";

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

    useEffect(() => {
      if (userController) {
        userController.getUser();
      }
    }, [userController]);

    return (
      <div className="working-panel">
        {location.pathname === "/" && userStore?.userProfile &&  (!userStore?.userProfile?.has_exercises && !userStore?.userProfile?.has_workouts) && (
          <div className="widgets">
            <StartWidget />
          </div>
        )}
        {children}
      </div>
    );
  })
);
