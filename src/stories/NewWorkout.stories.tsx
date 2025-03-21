/* eslint-disable sort-keys */
// NewWorkout.stories.tsx

import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import NewWorkout, { NewWorkoutProps } from '../components/User/workouts/NewWorkout/NewWorkout';
import { action } from '@storybook/addon-actions';
import { MemoryRouter } from 'react-router';
import '../components/User/workouts/NewWorkout/NewWorkout.style.scss';

// Mocking the stores and controllers as per the dependencies
const mockWorkoutsStore = {
    draftWorkout: {
        description: 'A good morning workout.',

        exercises: [
            { id: 1, name: 'Push-ups' }, { id: 2, name: 'Squats' },
        ],
        name: 'Morning Workout',

        users: [
            { email: 'user1@example.com', id: 1,  }, { email: 'user2@example.com', id: 2,  },
        ],
    },
};

const mockExercisesStore = {
    generalExercises: [
        { id: 1, name: 'Push-ups' },
        { id: 2, name: 'Squats' },
        { id: 3, name: 'Lunges' },
    ],
};

const mockWorkoutsController = {
    getUsersWithPermissions: action('Get Users With Permissions'),
    getWorkout: action('Get Workout'),
    saveWorkout: action('Save Workout'),
    updateWorkout: action('Update Workout'),

};

const mockExercisesController = {
    addWorkoutExercise: action('Add Workout Exercise'),
    deleteWorkoutExercise: action('Delete Workout Exercise'),
    editWorkoutExercise: action('Edit Workout Exercise'),
    getExercises: action('Get Exercises'),

};

// Default export with metadata
export default {
    argTypes: {
        exercisesController: { control: 'object' },
        exercisesStore: { control: 'object' },
        workoutsController: { control: 'object' },
        workoutsStore: { control: 'object' },
    },
    component: NewWorkout,
    title: 'Components/NewWorkout',
} as Meta;

// Default Story
const Template: StoryFn<NewWorkoutProps> = args => (
    <MemoryRouter>
        <NewWorkout {...args} />
    </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
    exercisesController: mockExercisesController,
    exercisesStore: mockExercisesStore,
    workoutsController: mockWorkoutsController,
    workoutsStore: mockWorkoutsStore,
};

export const EditingWorkout = Template.bind({});
EditingWorkout.args = {
    ...Default.args,
    workoutsStore: {
        draftWorkout: {
            name: 'Evening Workout',
            description: 'A light evening workout.',
            exercises: [
                { id: 3, name: 'Lunges' }, { id: 1, name: 'Push-ups' },
            ],
            users: [{ id: 1, email: 'user1@example.com' }],
        },
    },
};

export const NoExercisesSelected = Template.bind({});
NoExercisesSelected.args = {
    ...Default.args,
    workoutsStore: {
        draftWorkout: {
            name: 'No Exercises',
            description: 'No exercises selected.',
            exercises: [],
            users: [],
        },
    },
};

export const WithUsers = Template.bind({});
WithUsers.args = {
    ...Default.args,
    workoutsStore: {
        draftWorkout: {
            name: 'Workout with Users',
            description: 'This workout has selected users.',
            exercises: [
                { id: 1, name: 'Push-ups' }, { id: 2, name: 'Squats' },
            ],
            users: [
                { id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' },
            ],
        },
    },
};
