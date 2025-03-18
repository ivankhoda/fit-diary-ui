import React from 'react';
import AdminPanel from '../AdminPanel';
import Dashboard from '../Dashboard/Dashboard';
import UserList from '../UserManagement/UserList';
import UserData from '../UserManagement/UserData/UserData';
import ExerciseList from '../ExercisesManagement/ExerciseList';
import ExerciseData from '../ExercisesManagement/ExerciseData/ExerciseData';
import ExerciseCreateForm from '../ExercisesManagement/ExerciseData/ExerciseCreateForm';
import WorkoutsList from '../WorkoutsManagement/WorkoutsList';
import WorkoutData from '../WorkoutsManagement/WorkoutData/WorkoutData';
import UserWorkoutsList from '../WorkoutsManagement/UserWorkouts/UserWorkoutsList';

import UserPermissionsList from '../UserManagement/UserPermissonsList/UserPermissionsList';
import AdminCreateWorkout from '../WorkoutsManagement/CreateWorkout/AdminCreateWorkout';

export const adminRoutes = [
    {Component:  <AdminPanel/>, name: 'panel', path: '/'},
    {Component:  <Dashboard/>, name: 'dashboard', path: '/dashboard'},
    {Component:  <UserList/>, name: 'users', path: '/users'},
    {Component:  <UserData/>, name: 'user/data', path: '/users/:userId'},
    {Component:  <UserWorkoutsList/>, name: 'user/workouts_list', path: '/users/:userId/workouts'},
    {Component:  <UserPermissionsList/>, name: 'user/permissions_list', path: '/users/:userId/permissions'},
    {Component:  <ExerciseList/>, name: 'exercise', path: '/exercises'},
    {Component:  <ExerciseData/>, name: 'exercise/data', path: '/exercises/:exerciseId'},
    {Component:  <ExerciseCreateForm/>, name: 'exercise/create', path: '/exercises/create'},
    {Component:  <WorkoutsList/>, name: 'workouts', path: 'workouts'},
    {Component:  <WorkoutData/>, name: 'workouts/data', path: 'workouts/:workoutId'},
    {Component:  <AdminCreateWorkout />, name: 'Workout', path: 'workouts/:workoutId/edit'},

];
