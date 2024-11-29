/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-statements */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { FormEvent, useEffect, useState, useCallback } from 'react';
import { workoutsController } from '../../../../../controllers/global';
import { exercisesStore, workoutsStore } from '../../../../../store/global';
import './CurrentExercise.style.scss';

export const CurrentExercise: React.FC =
    inject('exercisesStore', 'exercisesController', 'workoutsStore', 'workoutsController')(observer((): React.JSX.Element => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [currentWorkout, setCurrentWorkout] = useState(workoutsStore.currentUserWorkout);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [currentExercise, setCurrentExercise] = useState(exercisesStore.currentUserExercise);

        const [repetitions, setRepetitions] = useState('');
        const [weight, setWeight] = useState('');
        const [sets] = useState(exercisesStore.currentUserExerciseSets);

        useEffect(() => {
            workoutsController.getUserWorkout();
        }, [currentWorkout,
            workoutsStore,
            exercisesStore,
            currentExercise,
            sets]);

        const handleRepetitionsChange = useCallback((e: FormEvent<HTMLInputElement>) => {
            e.preventDefault();
            const val = e.target as HTMLInputElement;
            setRepetitions(val.value);
        }, []);

        const handleWeightChange = useCallback((e: FormEvent<HTMLInputElement>) => {
            e.preventDefault();
            const val = e.target as HTMLInputElement;
            setWeight(val.value);
        }, []);

        const setDone = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            workoutsController.setDone(exercisesStore.currentUserExercise?.id, repetitions, weight);
            setWeight('');
            setRepetitions('');
        }, [repetitions, weight]);

        const exerciseDone = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            workoutsController.exerciseDone(currentExercise.id);
        }, [currentExercise]);
        console.log(exercisesStore.currentUserExercise, 'ex store');
        return (


            <div className='current-exercise'>
                <h2>Упражнение</h2>
                <div className='current-exercise_info'>
                    <p>{exercisesStore.currentUserExercise?.name}</p>
                    <p>{exercisesStore.currentUserExercise?.sets}</p>
                    <p>{exercisesStore.currentUserExercise?.repetitions}</p>
                    <p>{exercisesStore.currentUserExercise?.weight}</p>
                </div>
                <div className='current-exercise_inputs'>
                    <input
                        className='current-exercise_input'
                        type="text"
                        placeholder="Вес"
                        value={weight}
                        onInput={handleWeightChange}
                    />
                    <input
                        className='current-exercise_input'
                        type="text"
                        placeholder="Повторeния"
                        value={repetitions}
                        onInput={handleRepetitionsChange}
                    />
                </div>
                <button className='save-btn' onClick={setDone}>Подход сделан</button>
                <button className='save-btn' onClick={exerciseDone}>Закончить упражнение</button>
                <p>Выполнено подходов</p>
                {exercisesStore.currentUserExerciseSets?.length > 0 && exercisesStore.currentUserExerciseSets
                    .map((s, i) => <p key={s.id}>{`${i + 1} ${s.repetitions} - ${s.result}`}</p>)
                }
            </div>
        );
    }));
