import React from 'react';
import './UserWorkoutsStats.style.scss';
import { inject, observer } from 'mobx-react';
import UserController from '../../../../controllers/UserController';
import UserStore from '../../../../store/userStore';
import WorkoutProgressGrid from './WorkoutProgressGrid/WorkoutProgressGrid';

interface UserWorkoutsStatsProps {
  userStore?: UserStore;
  userController?: UserController;
}

const UserWorkoutsStats: React.FC<UserWorkoutsStatsProps> = () => (
    <div className="user-workouts-stats">
        <h2>Статистика тренировок</h2>
        <div className="workout-progress-chart">
            <WorkoutProgressGrid/>
        </div>
    </div>
);

export default inject('userStore', 'userController')(observer(UserWorkoutsStats));
