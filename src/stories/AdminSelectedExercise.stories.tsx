import { Meta, StoryObj } from '@storybook/react';
import { AdminExerciseProfile } from '../components/Admin/store/AdminExercisesStore';
import AdminSelectedExercise from '../components/Admin/WorkoutsManagement/CreateWorkout/AdminSelectedExercise/AdminSelectedExercise';



const mockExercise: AdminExerciseProfile = {
    distance: '0',
    duration: null,
    id: 1,
    name: 'Bench Press',
    repetitions: 10,
    sets: 3,
    type_of_measurement: 'weight_and_reps',
    weight: '100',
};

const mockDurationExercise: AdminExerciseProfile = {
    duration: 300,
    id: 1,
    name: 'Plank',
    repetitions: 10,
    sets: 3,
    type_of_measurement: 'duration',
};


const handleExerciseDetailChange = (id: number, field: string, value: string): void => {
    console.log(`Exercise ${id} - ${field} changed to ${value}`);
};

const handleExerciseDelete = (exerciseId: number): void => {
    console.log(`Exercise ${exerciseId} deleted`);
};

const editWorkoutExercise = (editedExercise: AdminExerciseProfile): void => {
    console.log('Exercise edited:', editedExercise);
};


const meta: Meta<typeof AdminSelectedExercise> = {
    args: {
        editWorkoutExercise,
        exercise: mockExercise,
        handleExerciseDelete,
        handleExerciseDetailChange,
        mode: 'edit',
    },
    component: AdminSelectedExercise,
    title: 'Components/AdminSelectedExercise',
};

export default meta;


type Story = StoryObj<typeof AdminSelectedExercise>;

export const EditModeWeightAndReps: Story = {
    args: {
        exercise: { ...mockExercise, type_of_measurement: 'weight_and_reps' },
        mode: 'edit',
    },
};

export const ViewModeWeightAndReps: Story = {
    args: {
        exercise: { ...mockExercise, type_of_measurement: 'weight_and_reps' },
        mode: 'view',
    },
};

export const EditModeDuration: Story = {

    args: {
        exercise: { ...mockDurationExercise },
        mode: 'edit',
    },
};

export const EditModeCardio: Story = {
    args: {
        exercise: { ...mockDurationExercise, distance: '5', type_of_measurement: 'cardio' },
        mode: 'edit',
    },
};
