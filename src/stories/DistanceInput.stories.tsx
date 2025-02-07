import React from 'react';
import { action } from '@storybook/addon-actions';

import { StoryObj } from '@storybook/react';
import { ExerciseInterface } from '../store/exercisesStore';
import DistanceInput from '../components/Common/DistanceInput';


export default {
    component: DistanceInput,
    title: 'Components/DistanceInput',
};

type Story = StoryObj<typeof DistanceInput>;

const mockExercise: ExerciseInterface = {
    distance: '1000',
    id: 1,
    name: 'Running',
    type_of_measurement: 'duration_and_distance',
};

export const WeightInputDefault: Story = {
    render: () => (
        <DistanceInput onChange={action('Repetitions Changed')} exercise={mockExercise} />
    ),
};
