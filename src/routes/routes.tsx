import React from 'react';
import { Commands } from '../components/Commands/Commands';
import Exercises from '../components/User/Exercises/Exercises';
import { UserWorkout } from '../components/User/UserWorkout/UserWorkout';
import WorkoutExerciseForm from '../components/User/WorkoutExercise/WorkoutExerciseForm/WorkoutExerciseForm';
import { CurrentWorkout } from '../components/User/workouts/CurrentWorkout/CurrentWorkout';
import NewWorkout from '../components/User/workouts/NewWorkout/NewWorkout';
import Workouts from '../components/User/workouts/Workouts';
import UserWorkouts from '../components/User/workouts/UserWorkouts';
import UserWorkoutsInProgress from '../components/User/workouts/UserWorkoutsInProgress';
import { PasswordRecovery } from '../components/Auth/PasswordRecovery';
import { ResetPassword } from '../components/Auth/ResetPassword';
import { useLocation } from 'react-router';
import SelfStats from '../components/User/Stats/SelfStats/SelfStats';
import UserWorkoutsStats from '../components/User/Stats/WorkoutsStats/UserWorkoutsStats';
import ExercisesStats from '../components/User/Stats/WorkoutsStats/ExercisesStats/ExercisesStats';
import Exercise from '../components/User/Exercises/Exercise/Exercise';
import { ConfirmRegistration } from '../components/Auth/ConfirmationRegistration/ConfirmRegistration';
import Permissions from '../components/User/Permissons/Permissions';
import NewPermission from '../components/User/Permissons/NewPermission';

// eslint-disable-next-line func-style
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const ResetPasswordWithToken: React.FC = () => {
    const query = useQuery();
    const token = query.get('reset_password_token');
    console.log(token);
    return <ResetPassword token={token} />;
};

export const ConfirmRegistrationWithToken: React.FC = () => {
    const query = useQuery();
    const token = query.get('confirmation_token');

    return <ConfirmRegistration token={token} />;
};

export const routes = [
    {Component:  <Commands />, name: 'Commands', path: '/commands'},
    {Component:  <Workouts />, name: 'Workouts', path: '/workouts'},
    {Component:  <UserWorkoutsInProgress />, name: 'Workouts in progress', path: '/workouts/in-progress'},
    {Component:  <UserWorkouts />, name: 'Workouts done', path: '/workouts/done'},
    {Component:  <NewWorkout />, name: 'Exercise', path: '/workout/new'},
    {Component:  <NewWorkout />, name: 'Workout', path: '/workouts/:workoutId/edit'},
    {Component:  <CurrentWorkout />, name: 'CurrentUserWorkout', path: '/workout/:workoutId'},
    {Component:  <Exercises />, name: 'Exercise', path: '/exercises'},
    {Component:  <Exercise />, name: 'Exercise', path: '/exercises/:id'},
    {Component:  <WorkoutExerciseForm />, name: 'WorkoutExerciseForm', path: '/workout/exercise'},
    {Component:  <UserWorkout />, name: 'UserWorkout', path: '/workout/current'},
    {Component:  <PasswordRecovery />, name: 'PasswordRecovery', path: '/password/recovery'},
    {Component:  <SelfStats />, name: 'SelfStats', path: '/self-stats'},
    {Component: <UserWorkoutsStats/>, name: 'UserWorkoutsStats', path: '/workouts-stats'},
    {Component: <Permissions/>, name: 'UserPermissions', path: '/permissions'},
    {Component: <NewPermission/>, name: 'NewUserPermissions', path: '/permissions/new'},
    {Component: <ExercisesStats/>, name: 'ExercisesStats', path: '/exercises-stats'},
    {Component:  <ResetPasswordWithToken />, name: 'ResetPassswordWithToken', path: '/password/reset?reset_password_token=:token'},
    {Component:  <ConfirmRegistrationWithToken />, name: 'ResetPassswordWithToken', path: 'users/confirmation?confirmation_token=:token'},
];
