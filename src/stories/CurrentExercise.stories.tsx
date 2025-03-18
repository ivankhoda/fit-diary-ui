import React from 'react';
import { StoryFn, Meta as MetaType } from '@storybook/react';
import { CurrentExercise, CurrentExerciseProps } from '../components/User/workouts/CurrentWorkout/CurrentExercise/CurrentExercise';
import { ExerciseInterface } from '../store/exercisesStore';

const mockExercise: ExerciseInterface = {
    distance: '',
    id: 1,
    name: 'Bench Press',
    repetitions: 10,
    type_of_measurement: 'weight_and_reps',
    weight: '100',
};

const handleRepetitionsChange = (exercise: ExerciseInterface) => console.log('Repetitions changed:', exercise);
const handleWeightChange = (exercise: ExerciseInterface) => console.log('Weight changed:', exercise);
const handleDistanceChange = (exercise: ExerciseInterface) => console.log('Distance changed:', exercise);
const handleDurationChange = (duration: string, exercise?: ExerciseInterface) => console.log('Duration changed:', duration, exercise);
const setDone = () => console.log('Exercise marked as done');

export default {
    argTypes: {
        exercise: { control: 'object' },
        handleDistanceChange: { action: 'distanceChanged' },
        handleDurationChange: { action: 'durationChanged' },
        handleRepetitionsChange: { action: 'repetitionsChanged' },
        handleWeightChange: { action: 'weightChanged' },
        setDone: { action: 'setDone' },
    },
    component: CurrentExercise,
    exercise: { control: 'object' },
    handleDistanceChange: { action: 'distanceChanged' },
    handleDurationChange: { action: 'durationChanged' },
    handleRepetitionsChange: { action: 'repetitionsChanged' },
    handleWeightChange: { action: 'weightChanged' },
    setDone: { action: 'setDone' },
    title: 'Components/CurrentExercise',
} as MetaType<typeof CurrentExercise>;

const Template: StoryFn<CurrentExerciseProps> = args => <CurrentExercise {...args} />;

export const Default = Template.bind({});
Default.args = {
    exercise: mockExercise,
    handleDistanceChange,
    handleDurationChange,
    handleRepetitionsChange,
    handleWeightChange,
    setDone,
};

export const RepsOnly = Template.bind({});
RepsOnly.args = {
    exercise: {
        ...mockExercise,
        type_of_measurement: 'reps',
        weight: '',
    },
    handleDistanceChange,
    handleDurationChange,
    handleRepetitionsChange,
    handleWeightChange,
    setDone,
};

export const DurationOnly = Template.bind({});
DurationOnly.args = {
    exercise: {
        ...mockExercise,
        repetitions: 0,
        type_of_measurement: 'duration',
        weight: '',
    },
    handleDistanceChange,
    handleDurationChange,
    handleRepetitionsChange,
    handleWeightChange,
    setDone,
};

export const DurationAndReps = Template.bind({});
DurationAndReps.args = {
    exercise: {
        ...mockExercise,
        type_of_measurement: 'duration_and_reps',
        weight: '',
    },
    handleDistanceChange,
    handleDurationChange,
    handleRepetitionsChange,
    handleWeightChange,
    setDone,
};

export const Cardio = Template.bind({});
Cardio.args = {
    exercise: {
        ...mockExercise,
        distance: '5.0',
        repetitions: 0,
        type_of_measurement: 'cardio',
        weight: '',

    },
    handleDistanceChange,
    handleDurationChange,
    handleRepetitionsChange,
    handleWeightChange,
    setDone,
};

export const DurationAndDistance = Template.bind({});
DurationAndDistance.args = {
    exercise: {
        ...mockExercise,
        distance: '3.5',
        repetitions: 0,
        type_of_measurement: 'duration_and_distance',
        weight: '',

    },
    handleDistanceChange,
    handleDurationChange,
    handleRepetitionsChange,
    handleWeightChange,
    setDone,
};
