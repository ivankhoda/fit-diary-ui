import React from 'react';
import { Commands } from '../components/Commands/Commands';
import Exercises from '../components/User/Exercises/Exercises';
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
import ExercisesStats from '../components/User/Stats/WorkoutsStats/ExercisesStats/ExercisesStats';
import Exercise from '../components/User/Exercises/Exercise/Exercise';
import { ConfirmRegistration } from '../components/Auth/ConfirmationRegistration/ConfirmRegistration';
import WorkoutSummary from '../components/User/workouts/WorkoutSummary/WorkoutSummary';
import UserWorkoutsArchived from '../components/User/workouts/UserWorkoutsArchived';
import TrainingGoals from '../components/User/TrainingGoals/TrainingGoals';
import TrainingGoal from '../components/User/TrainingGoals/TrainingGoal/TrainingGoal';
import Plans from '../components/User/Plans/Plans';
import PlanForm from '../components/User/Plans/PlanForm/PlanForm';
import UserProfile from '../components/User/Cabinet/UserProfile';
import TermsOfUse from '../terms/TermsOfUse';
import PrivacyPolicy from '../privacy/PrivacyPolicy';
import AboutApp from '../components/User/About/AboutApp';
import AccountDeletion from '../deletion/AccountDeletion';

// eslint-disable-next-line func-style
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const ResetPasswordWithToken: React.FC = () => {
    const query = useQuery();
    const token = query.get('reset_password_token');
    return <ResetPassword token={token} />;
};

export const ConfirmRegistrationWithToken: React.FC = () => {
    const query = useQuery();
    const token = query.get('confirmation_token');

    return <ConfirmRegistration token={token} />;
};

export const routes = [
    {Component:  <Commands />, name: 'Commands', path: '/commands'},
    {Component:  <TrainingGoals />, name: 'Goals', path: '/training_goals'},
    {Component:  <TrainingGoal />, name: 'Goal', path: '/training-goals/:id'},
    {Component:  <Plans />, name: 'Plans', path: '/plans'},
    {Component:  <PlanForm />, name: 'Plan', path: '/plans/:id'},
    {Component:  <Workouts />, name: 'Workouts', path: '/workouts'},
    {Component:  <UserWorkoutsInProgress />, name: 'Workouts in progress', path: '/workouts/in-progress'},
    {Component:  <UserWorkouts />, name: 'Workouts done', path: '/workouts/done'},
    {Component:  <UserWorkoutsArchived />, name: 'Workouts archive', path: '/workouts/archive'},
    {Component:  <NewWorkout />, name: 'Exercise', path: '/workout/new'},
    {Component:  <NewWorkout />, name: 'Workout', path: '/workouts/:workoutId/edit'},
    {Component:  <WorkoutSummary />, name: 'Workout', path: '/workouts/:workoutId/summary'},
    {Component:  <CurrentWorkout />, name: 'CurrentUserWorkout', path: '/workout/:workoutId'},
    {Component:  <Exercises />, name: 'Exercise', path: '/exercises'},
    {Component:  <Exercise />, name: 'Exercise', path: '/exercises/:id'},
    {Component:  <WorkoutExerciseForm />, name: 'WorkoutExerciseForm', path: '/workout/exercise'},
    {Component:  <PasswordRecovery />, name: 'PasswordRecovery', path: '/password/recovery'},
    {Component:  <SelfStats />, name: 'SelfStats', path: '/self-stats'},
    {Component: <ExercisesStats/>, name: 'ExercisesStats', path: '/exercises-stats'},
    {Component:  <ResetPasswordWithToken />, name: 'ResetPassswordWithToken', path: '/password/reset?reset_password_token=:token'},
    {Component:  <ConfirmRegistrationWithToken />, name: 'ResetPassswordWithToken', path: 'users/confirmation?confirmation_token=:token'},
    {Component:  <UserProfile />, name: 'profile', path: '/profile'},
    {Component:  <PrivacyPolicy/>, name: 'privacy-policy', path: '/privacy-policy'},
    {Component:  <TermsOfUse/>, name: 'terms', path: '/terms-of-use'},
    {Component:  <AccountDeletion/>, name: 'deletion', path: '/about-deletion'},
    {Component:  <AboutApp/>, name: 'about', path: '/about'},

];
