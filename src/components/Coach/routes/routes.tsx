import React from 'react';
import ClientManager from '../Components/Clients/ClientManager';
import ClientProfilePage from '../Components/Clients/ClientProfile/ClientProfilePage';
import Workouts from '../Components/Workouts/Workouts';
import NewWorkout from '../Components/Workouts/NewWorkout/NewWorkout';
import CoachWorkoutsArchived from '../Components/Workouts/CoachWorkoutsArchived';

export const coachRoutes = [
    {Component:  <div/>, name: 'panel', path: '/'},

    {Component:  <ClientManager/>, name: 'clients', path: '/clients'},
    {Component:  <ClientProfilePage/>, name: 'clientProfile', path: '/coach/clients/:clientId'},
    {Component:  <Workouts/>, name: 'workouts', path: '/workouts'},
    {Component:  <NewWorkout />, name: 'Workout', path: '/workouts/:workoutId/edit'},
    {Component:  <CoachWorkoutsArchived/>, name: 'Workouts', path: '/workouts/archive'},
];
