/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable sort-keys */
import { inject, observer } from 'mobx-react';
import React from 'react';

import AdminPanel from '../../AdminPanel';

import './WorkoutData.style.scss';

import AdminCreateWorkout from '../CreateWorkout/AdminCreateWorkout';

const WorkoutData: React.FC = () => (
    <AdminPanel>
        <div className="workout-data-modal">
            <AdminCreateWorkout/>
        </div>
    </AdminPanel>
);

export default inject('adminWorkoutsStore', 'adminWorkoutsController', 'adminUsersStore', 'adminExercisesStore')(observer(WorkoutData));
