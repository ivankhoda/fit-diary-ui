// Src/stories/AdminSelectedExercise.stories.tsx
import React, { useCallback, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TimeInput from '../components/Common/TimeInput';
import { ExerciseInterface } from '../store/exercisesStore';

// Mock exercise data
const mockExercise: ExerciseInterface = {
    duration: 300,
    id: 1,
    name: 'Plank',
    repetitions: 10,
    sets: 3,
    type_of_measurement: 'duration',
};

console.log(mockExercise);

// Meta for TimeInput component
const meta: Meta<typeof TimeInput> = {
    component: TimeInput,
    title: 'Components/TimeInput',
};

export default meta;

// Story type for TimeInput
type Story = StoryObj<typeof TimeInput>;

// Default TimeInput story
export const DefaultTimeInput: Story = {
    args: {
        onChange: (duration: string, exercise: ExerciseInterface) => {
            console.log('Duration:', duration, 'Exercise:', exercise);
        },
    },
};

// TimeInput with initial value
export const TimeInputWithInitialValue: Story = {
    args: {
        onChange: (duration: string, exercise: ExerciseInterface) => {
            console.log('Duration:', duration, 'Exercise:', exercise);
        },
    },
    render: args => {
        const [time, setTime] = useState('02:30');
        console.log('Time:', time);

        const handleChange = useCallback((duration: string, exercise: ExerciseInterface) => {
            setTime(duration);
            args.onChange(duration, exercise);
        }, []);

        return (
            <TimeInput
                {...args}
                onChange={handleChange}
            />
        );
    },
};

// TimeInput with placeholder
export const TimeInputWithPlaceholder: Story = {
    args: {
        onChange: (duration: string, exercise: ExerciseInterface) => {
            console.log('Duration:', duration, 'Exercise:', exercise);
        },
    },
};

// TimeInput with max length
export const TimeInputWithMaxLength: Story = {
    args: {
        onChange: (duration: string, exercise: ExerciseInterface) => {
            console.log('Duration:', duration, 'Exercise:', exercise);
        },
    },
};
