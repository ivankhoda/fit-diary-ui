import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminSelectedExercise from './AdminSelectedExercise';
jest.mock('i18next', () => ({
    t: (key: string) => key,
}));
describe('AdminSelectedExercise Component', () => {
    const mockHandleExerciseDetailChange = jest.fn();
    const mockHandleExerciseDelete = jest.fn();
    const mockEditWorkoutExercise = jest.fn();


    const defaultProps = {
        editWorkoutExercise: mockEditWorkoutExercise,
        exercise: {
            distance: '0',
            duration: 0,
            id: 1,
            name: 'Push Up',
            repetitions: 10,
            sets: 3,
            type_of_measurement: 'weight_and_reps',
            weight: '20',
        },
        handleExerciseDelete: mockHandleExerciseDelete,
        handleExerciseDetailChange: mockHandleExerciseDetailChange,
        mode: 'edit' as 'edit' | 'view',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders exercise name', () => {
        render(<AdminSelectedExercise {...defaultProps} />);
        expect(screen.getByText('Push Up')).toBeInTheDocument();
    });

    test('renders weight and reps fields for type_of_measurement = weight_and_reps', () => {
        render(  <AdminSelectedExercise
            exercise={defaultProps.exercise}
            handleExerciseDetailChange={mockHandleExerciseDetailChange}
            handleExerciseDelete={mockHandleExerciseDelete}
            editWorkoutExercise={mockEditWorkoutExercise}
            mode="edit"
        />);

        expect(screen.getByLabelText('exercise.reps')).toBeInTheDocument();
        expect(screen.getByLabelText('exercise.weight')).toBeInTheDocument();
    });

    test('calls handleExerciseDetailChange on reps input change', () => {
        render(<AdminSelectedExercise {...defaultProps} />);

        const repsInput = screen.getByLabelText('exercise.reps');
        fireEvent.change(repsInput, { target: { value: '12' } });

        expect(mockHandleExerciseDetailChange).toHaveBeenCalledWith(1, 'repetitions', '12');
    });

    test('calls handleExerciseDetailChange on weight input change', () => {
        render(<AdminSelectedExercise {...defaultProps} />);

        const weightInput = screen.getByLabelText('exercise.weight');
        fireEvent.change(weightInput, { target: { value: '25' } });

        expect(mockHandleExerciseDetailChange).toHaveBeenCalledWith(1, 'weight', '25');
    });

    test('renders duration field for type_of_measurement = duration', () => {
        const durationProps = {
            ...defaultProps,
            exercise: {
                ...defaultProps.exercise,
                duration: 120,
                type_of_measurement: 'duration',
            },
        };

        render(<AdminSelectedExercise {...durationProps} />);

        expect(screen.getByLabelText('exercise.duration')).toBeInTheDocument();
    });

    test('renders distance field for type_of_measurement = duration_and_distance', () => {
        const durationProps = {
            ...defaultProps,
            exercise: {
                ...defaultProps.exercise,
                distance: '100',
                duration: 120,
                type_of_measurement: 'duration_and_distance',
            },
        };

        render(<AdminSelectedExercise {...durationProps} />);

        expect(screen.getByLabelText('exercise.distance')).toBeInTheDocument();
    });

    test('calls handleExerciseDelete when delete button is clicked', () => {
        render(<AdminSelectedExercise {...defaultProps} />);

        const deleteButton = screen.getByRole('button', { name: /trash/iu });

        fireEvent.click(deleteButton);

        expect(mockHandleExerciseDelete).toHaveBeenCalledWith(1);
    });

    test('renders readonly mode correctly', () => {
        const viewModeProps: typeof defaultProps = {
            ...defaultProps,
            mode: 'view',
        };

        render(<AdminSelectedExercise {...viewModeProps} />);

        expect(screen.getByText(/exercise.reps/u)).toBeInTheDocument();
        expect(screen.queryByLabelText('exercise.reps')).not.toBeInTheDocument();
    });

    test('handles duration input change correctly', () => {
        const durationProps = {
            ...defaultProps,
            exercise: {
                ...defaultProps.exercise,
                duration: 0,
                type_of_measurement: 'duration',
            },
        };

        render(<AdminSelectedExercise {...durationProps} />);

        const durationInput = screen.getByLabelText('exercise.duration');
        fireEvent.change(durationInput, { target: { value: '02:00' } });

        expect(mockHandleExerciseDetailChange).toHaveBeenCalledWith(1, 'duration', '120');
    });
});
