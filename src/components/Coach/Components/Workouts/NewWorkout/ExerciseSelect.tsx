/* eslint-disable no-useless-constructor */

import { inject, observer } from 'mobx-react';
import React, { ChangeEvent, useState, useCallback, useEffect } from 'react';
import ExercisesController from '../../../../../controllers/ExercisesController';
import ExercisesStore, { ExerciseInterface } from '../../../../../store/exercisesStore';

interface ExerciseSelectInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

const ExerciseSelect: React.FC<ExerciseSelectInterface> = inject(
    'exercisesStore',
    'exercisesController'
)(
    observer(({ exercisesStore, exercisesController }) => {
        const [name, setName] = useState('');
        const [isExerciseSelected, setIsExerciseSelected] = useState(false);

        // Handle search input changes
        const handleSearch = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const inputName = event.target.value;
                setName(inputName);

                // Clear selection if user starts typing again
                if (isExerciseSelected) {
                    exercisesStore.setExerciseForWorkout(null);
                    setIsExerciseSelected(false);
                }

                if (inputName === '') {
                    exercisesStore.setFilteredExercises([]);
                } else {
                    exercisesController.getFilteredExercises(inputName);
                }
            },
            [exercisesController,
                exercisesStore,
                isExerciseSelected]
        );

        // Handle exercise selection from dropdown
        const handleExerciseSelect = useCallback(
            (exercise: ExerciseInterface) => {
                setName(exercise.name);
                exercisesStore.setExerciseForWorkout(exercise);
                setIsExerciseSelected(true);
            },
            [exercisesStore]
        );

        // Reset dropdown items when user starts a new search
        useEffect(() => {
            if (!isExerciseSelected && name) {
                exercisesController.getFilteredExercises(name);
            }
        }, [exercisesController,
            name,
            isExerciseSelected]);

        // Handle backspace to clear selected exercise
        const handleBackspaceClear = useCallback(
            (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Backspace' && name === '') {
                    exercisesStore.setExerciseForWorkout(null);
                    setIsExerciseSelected(false);
                }
            },
            [name, exercisesStore]
        );

        // Memoized function to avoid inline arrow function in `onClick`
        const createExerciseClickHandler = useCallback(
            (exercise: ExerciseInterface) => () => handleExerciseSelect(exercise),
            [handleExerciseSelect]
        );

        return (
            <>
                <input
                    type="text"
                    placeholder="Искать упражнение"
                    value={name}
                    onChange={handleSearch}
                    onKeyDown={handleBackspaceClear}
                />
                <div>
                    {!isExerciseSelected &&
                        exercisesStore.filteredExercises &&
                        exercisesStore.filteredExercises.map(exercise => (
                            <div
                                key={exercise.id}
                                className="dropdown-item"
                                onClick={createExerciseClickHandler(exercise)}
                            >
                                {exercise.name}
                            </div>
                        ))}
                </div>
            </>
        );
    })
);

export default ExerciseSelect;
