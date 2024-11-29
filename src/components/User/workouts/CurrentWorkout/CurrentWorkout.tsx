/* eslint-disable max-statements */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { exercisesStore, workoutsStore } from '../../../../store/global';
import { WorkoutInterface } from '../../../../store/workoutStore';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import './CurrentWorkout.style.scss';
import { workoutsController } from '../../../../controllers/global';
import { useNavigate, useParams } from 'react-router';

interface Props {
    workout?: WorkoutInterface;
}

export const CurrentWorkout: React.FC<Props> =
    inject('exercisesStore', 'exercisesController', 'workoutsStore', 'workoutsController')(observer((): React.JSX.Element => {
        const [selectedExercise, setSelectedExercise] = useState<ExerciseInterface | null>(null);
        const [weight, setWeight] = useState('');
        const [repetitions, setRepetitions] = useState('');
        const [expandedExercises, setExpandedExercises] = useState<{ [key: number]: boolean }>({});
        const { workoutId } = useParams<{ workoutId: string }>();

        const [sets] = useState(exercisesStore.currentUserExerciseSets);
        const navigate = useNavigate();
        const currentWorkout = workoutsStore.currentUserWorkout;




        useEffect(() => {
            if (!currentWorkout){
                workoutsController.getUserWorkout(workoutId);
            }
        }, [navigate, sets]);

        const toggleExpanded = (exerciseId: number) => {
            setExpandedExercises(prevState => ({
                ...prevState,
                [exerciseId]: !prevState[exerciseId],
            }));
        };

        const handleToggleExpanded = (id: number) => () => {
            toggleExpanded(id);
        };

        const handleExerciseClick = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setWeight(exercise.weight.toString());
            setRepetitions(exercise.repetitions.toString());

            workoutsController.startOrResumeExercise(exercise.id, currentWorkout.id);
        };

        const handleClick = (exercise: ExerciseInterface) => (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            handleExerciseClick(exercise);
        };

        const handleWeightChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            setWeight(event.target.value);
        };

        const handleRepetitionsChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            setRepetitions(event.target.value);
        };

        const setDone = () => () => {
            if (selectedExercise) {
                workoutsController.setDone(selectedExercise.id, weight, repetitions);
            }
        };

        const deleteSet = (id: string, userExerciseId: number) => () => {
            workoutsController.deleteSet(id, userExerciseId);
        };

        const exerciseDone = () => () => {
            setSelectedExercise(null);
        };

        const handleFinishClick = useCallback(() => {
            if (currentWorkout) {
                workoutsController.finishWorkout(currentWorkout.id);
            }
        }, [currentWorkout?.id]);



        return currentWorkout
            ? (
                <div className='workout-container'>
                    <h2 className='workout-name'>{currentWorkout.name}</h2>
                    {currentWorkout.workout_exercises.length > 0
                        ? (
                            <div className="exercises-container">
                                <p className="exercises-title">Упражнения:</p>
                                {currentWorkout.workout_exercises.map((exercise: ExerciseInterface) => (
                                    <div key={exercise.id} className="exercise-item" onClick={handleClick(exercise)}>
                                        <p className="exercise-name"><strong>{exercise.name}</strong></p>
                                        <p className="exercise-details">
                                    Повторы: {exercise.repetitions} | Подходы: {exercise.sets} | Вес: {exercise?.weight}
                                        </p>
                                        {exercise.number_of_sets && exercise.number_of_sets.length > 0 && (
                                            <div>
                                                <p className="sets-summary" onClick={handleToggleExpanded(exercise.id)}>
                                                    Подходов: {exercise.number_of_sets.length}
                                                </p>
                                                {expandedExercises[exercise.id] && (
                                                    <div className="set-details">
                                                        {exercise.number_of_sets.map((set, index) => (
                                                            <p key={set.id}>
                                                                {index + 1} - Повторы: {set.repetitions}, Вес: {set.result}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                        : (
                            <p>Нет упраженений для тренировки.</p>
                        )}

                    {selectedExercise && (
                        <div className="current-exercise">
                            <h2>Текущее Упражнение: {selectedExercise.name}</h2>
                            <div className="current-exercise_info">
                                <p>Подходы: {selectedExercise.sets}</p>
                                <p>Повторы: {selectedExercise.repetitions}</p>
                                <p>Вес: {selectedExercise.weight}</p>
                            </div>

                            <div className="current-exercise_inputs">
                                <input
                                    className="current-exercise_input"
                                    type="number"
                                    placeholder="Weight"
                                    value={weight}
                                    onChange={handleWeightChange()}
                                />
                                <input
                                    className="current-exercise_input"
                                    type="number"
                                    placeholder="Reps"
                                    value={repetitions}
                                    onChange={handleRepetitionsChange()}
                                />
                            </div>

                            <button className="save-btn" onClick={setDone()}>
                            Подход сделан
                            </button>
                            <button className="save-btn" onClick={exerciseDone()}>
                            Упражнение сделано
                            </button>
                        </div>
                    )}

                    {currentWorkout.user_exercises.length > 0 && (
                        <div className="user-exercises-container">
                            <h2>Упражнения сделаны:</h2>
                            {currentWorkout.user_exercises.map((userExercise: ExerciseInterface) => (
                                userExercise.number_of_sets && userExercise.number_of_sets.length > 0 &&
                                <div key={userExercise.id} className="exercise-item">
                                    <p className="exercise-name">
                                        <strong>{userExercise.name}</strong>
                                    </p>
                                    <p className="exercise-details">
                                    Повторы: {userExercise.repetitions} | Подходы: {userExercise.sets} | Вес: {userExercise?.weight}
                                    </p>

                                    {userExercise.number_of_sets && userExercise.number_of_sets.length > 0 && (
                                        <div className="user-set-details">
                                            {userExercise.number_of_sets.map((set, index) => (
                                                <div key={set.id}>
                                                    <p>
                                                        {index + 1} - Повторы: {set.repetitions}, Вес: {set.result}
                                                    </p>
                                                    <button onClick={deleteSet(set.id, userExercise.id)}>X</button>
                                                </div>
                                            ))}

                                        </div>
                                    )}
                                </div>
                            ))
                            }
                        </div>
                    )}

                    <button className='save-btn' onClick={handleFinishClick}>
                    Завершить
                    </button>
                </div>
            )
            : (
                <div>Нет тренировки.</div>
            );
    }));
