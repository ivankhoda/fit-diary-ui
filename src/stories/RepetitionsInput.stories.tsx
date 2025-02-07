import React from 'react';
import { action } from '@storybook/addon-actions';
import RepetitionsInput from '../components/Common/RepetitionsInput';
import { StoryObj } from '@storybook/react';
import { ExerciseInterface } from '../store/exercisesStore';


export default {
    component: RepetitionsInput,
    title: 'Components/RepetitionsInput',
};

type Story = StoryObj<typeof RepetitionsInput>;

const mockExercise: ExerciseInterface = {

    id: 1,
    name: 'Press',
    repetitions: 10,

    type_of_measurement: 'repetitions',
};

export const RepetitionsInputDefault: Story = {
    render: () => (
        <RepetitionsInput onChange={action('Repetitions Changed')} exercise={mockExercise} />
    ),
};
