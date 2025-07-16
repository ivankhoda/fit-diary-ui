import React from 'react';
import ClientManager from '../Components/Clients/ClientManager';
import ClientProfilePage from '../Components/Clients/ClientProfile/ClientProfilePage';
import Workouts from '../Components/Workouts/Workouts';
import NewWorkout from '../Components/Workouts/NewWorkout/NewWorkout';
import CoachWorkoutsArchived from '../Components/Workouts/CoachWorkoutsArchived';
import Exercises from '../Components/Exercises/Exercises';
import Exercise from '../Components/Exercises/Exercise/Exercise';
import Plans from '../Components/Plans/Plans';
import PlanForm from '../Components/Plans/PlanForm/PlanForm';
import AboutApp from '../AboutApp/AboutApp';

export const coachRoutes = [
    {Component:  <div/>, name: 'panel', path: '/'},

    {Component:  <ClientManager/>, name: 'clients', path: '/clients'},
    {Component:  <ClientProfilePage/>, name: 'clientProfile', path: '/coach/clients/:clientId'},
    {Component:  <Workouts/>, name: 'workouts', path: '/workouts'},
    {Component:  <NewWorkout />, name: 'Workout', path: '/workouts/:workoutId/edit'},
    {Component:  <CoachWorkoutsArchived/>, name: 'Workouts', path: '/workouts/archive'},
    {Component: <Exercises/>, name: 'Exercises', path: '/exercises'},
    {Component: <Exercise/>, name: 'Exercise', path: '/exercises/:id'},
    {Component: <Plans/>, name: 'Plans', path: '/plans' },
    {Component: <PlanForm/>, name: 'PlanForm', path: '/plans/create' },
    {Component:  <PlanForm />, name: 'Plan', path: '/plans/:id'},
    {Component:  <AboutApp/>, name: 'about', path: '/about'},
];
