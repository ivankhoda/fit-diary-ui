/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-statements */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useState, useCallback } from 'react';
import { exercisesStore } from '../../../store/global';
import { WorkoutInterface } from '../../../store/workoutStore';

interface Props {
    workout?: WorkoutInterface;
}

export const UserWorkout: React.FC<Props> =
    inject('exercisesStore', 'exercisesController', 'workoutsStore', 'workoutsController')(observer(({ workout }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [currentUserWorkout, setUserCurrentWorkout] = useState(workout);
        const [currentExercise, setCurrentExercise] = useState(exercisesStore.currentExercise);

        /*
         * Const toggleEditing = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
         *     event.preventDefault();
         *     setEditing(!editing);
         *     setEditedExercise(exercise);
         * };
         */

        /*
         * Const saveExercise = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
         *     event.preventDefault();
         *     exercisesController.editWorkoutExercise(editedExercise);
         *     setEditing(false);
         * };
         */

        /*
         * Const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         *     e.preventDefault();
         *     console.log(e.target.value);
         *     const { name, value } = e.target;
         *     setEditedExercise({ ...editedExercise, [name]: value });
         * };
         */

        const done = useCallback(() => {
            console.log('exercise done');
        }, []);

        const skip = useCallback(() => {
            console.log('exercise skip');
        }, []);

        const pass = useCallback(() => {
            console.log('exercise pass');
        }, []);

        return (
            <div>
                <p>{'name'}</p>
                <p>{'state'}</p>
                <button className='save-btn' onClick={done}>Done</button>
                <button className='save-btn' onClick={skip}>Skip</button>
                <button className='delete-btn' onClick={pass}>Archive</button>
            </div>
        );
    }));
