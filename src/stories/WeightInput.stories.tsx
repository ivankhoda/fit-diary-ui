import React from 'react';
import { action } from '@storybook/addon-actions';
import { StoryObj } from '@storybook/react';
import { ExerciseInterface } from '../store/exercisesStore';
import WeightInput from '../components/Common/WeightInput';


export default {
    component: WeightInput,
    title: 'Components/WeightInput',
};

type Story = StoryObj<typeof WeightInput>;

const mockExercise: ExerciseInterface = {

    id: 1,
    name: 'Bench Press',
    repetitions: 10,
    type_of_measurement: 'weight_and_repetitions',
    weight: '100',
};

export const WeightInputDefault: Story = {
    render: () => (
        <WeightInput onChange={action('Repetitions Changed')} exercise={mockExercise} />
    ),
};
