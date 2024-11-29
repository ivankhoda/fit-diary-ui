/* eslint-disable no-useless-constructor */

import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import ExercisesController from '../../../../controllers/ExercisesController';
import ExercisesStore from '../../../../store/exercisesStore';
import WorkoutsStore from '../../../../store/workoutStore';
import ExerciseRepsInput from '../../workouts/NewWorkout/ExerciseRepsInput';
import ExerciseSelect from '../../workouts/NewWorkout/ExerciseSelect';
import ExerciseSetInput from '../../workouts/NewWorkout/ExerciseSetInput';
import ExerciseWeightSelect from '../../workouts/NewWorkout/ExerciseWeightSelect';
import './WorkoutExerciseForm.style.scss';

interface WorkoutExerciseFormProps {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
    workoutsStore?: WorkoutsStore;
}

const WorkoutExerciseForm: React.FC<WorkoutExerciseFormProps> = inject(
    'exercisesStore',
    'exercisesController'
)(
    observer(({ exercisesStore, exercisesController }) => {
        // Function to add an exercise
        const addExercise = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
            event.preventDefault();

            const { repetitions, sets, weight } = exercisesStore || {};

            // Ensure we have all required values
            if (repetitions === null || sets === null || weight === null) {
                return;
            }

            exercisesController?.addWorkoutExercise();
        }, [exercisesStore, exercisesController]);

        // Check if button should be displayed
        const isButtonDisabled = () => !(
            exercisesStore?.exerciseForWorkout?.id &&
                exercisesStore?.repetitions !== null &&
                exercisesStore?.sets !== null &&
                exercisesStore?.weight !== null
        );

        return (
            <div>
                <h2>Добавить упражнение</h2>
                <div className='inputs-container'>
                    <ExerciseSelect />
                    <ExerciseSetInput />
                    <ExerciseRepsInput />
                    <ExerciseWeightSelect />
                </div>
                <button
                    className="add-exercise-btn"
                    type='button'
                    onClick={addExercise}
                    disabled={isButtonDisabled()}
                >
                    Сохранить
                </button>
            </div>
        );
    })
);

export default WorkoutExerciseForm;
