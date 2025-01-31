/* eslint-disable max-lines-per-function */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { exercisesStore, workoutsStore } from '../../../../store/global';
import { WorkoutInterface } from '../../../../store/workoutStore';
import { ExerciseInterface } from '../../../../store/exercisesStore';
import './CurrentWorkout.style.scss';
import './CurrentExercise/CurrentExercise.style.scss';
import { workoutsController } from '../../../../controllers/global';
import { useNavigate, useParams } from 'react-router';
import SelectedExercise from '../NewWorkout/SelectedExercise';
import { CurrentExercise } from './CurrentExercise/CurrentExercise';
import { UserExercisesList } from './UserExercisesList/UserExercisesList';
import i18next from 'i18next';

interface Props {
    workout?: WorkoutInterface;
}

export const CurrentWorkout: React.FC<Props> =
    inject('exercisesStore', 'exercisesController', 'workoutsStore', 'workoutsController')(observer((): React.JSX.Element => {
        const [selectedExercise, setSelectedExercise] = useState<ExerciseInterface | null>(null);
        const [selectedExercises, setSelectedExercises] = useState<ExerciseInterface[]>([]);
        const [weight, setWeight] = useState('');
        const [repetitions, setRepetitions] = useState('');
        const [duration, setDuration] = useState('00:00');
        const [distance, setDistance] = useState('0.0');

        const { workoutId } = useParams<{ workoutId: string }>();

        const [sets] = useState(exercisesStore.currentUserExerciseSets);
        const navigate = useNavigate();
        const currentWorkout = workoutsStore.currentUserWorkout;

        useEffect(() => {
            if (!currentWorkout){
                workoutsController.getUserWorkout(workoutId);
            }
            if(currentWorkout){
                setSelectedExercises(currentWorkout.workout_exercises|| [].sort((a, b) => a.id - b.id));
            }
        }, [navigate,
            sets,
            currentWorkout]);

        const handleWeight = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setWeight(exercise.weight?.toString() || '0');
        };

        const handleWeightAndReps = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setWeight(exercise.weight?.toString() || '0');
            setRepetitions(exercise.repetitions?.toString() || '0');
        };

        const handleReps = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setRepetitions(exercise.repetitions?.toString() || '0');
        };

        const handleDuration = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setDuration(exercise.duration?.toString() || '00:00');
        };

        const handleDurationAndReps = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setDuration(exercise.duration?.toString() || '00:00');
            setRepetitions(exercise.repetitions?.toString() || '0');
        };

        const handleCardio = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setDuration(exercise.duration?.toString() || '00:00');
            setDistance(exercise.distance?.toString() || '0.0');
        };

        const handleDistance = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setDistance(exercise.distance?.toString() || '0.0');
        };


        const handleDurationAndDistance = (exercise: ExerciseInterface) => {
            setSelectedExercise(exercise);
            setDuration(exercise.duration?.toString() || '00:00');
            setDistance(exercise.distance?.toString() || '0.0');
        };

        const handleExerciseClick = (exercise: ExerciseInterface) => {
            workoutsController.startOrResumeExercise(exercise.exercise_id, currentWorkout.id, exercise.id);

            switch (exercise.type_of_measurement) {
            case 'weight_and_reps':
                handleWeightAndReps(exercise);
                break;

            case 'reps':
                handleReps(exercise);
                break;

            case 'duration':
                handleDuration(exercise);
                break;

            case 'duration_and_reps':
                handleDurationAndReps(exercise);
                break;

            case 'cardio':
                handleCardio(exercise);
                break;

            case 'duration_and_distance':
                handleDurationAndDistance(exercise);
                break;

            default:
                console.warn('Unknown type_of_measurement:', exercise.type_of_measurement);
                break;
            }
        };

        const setDone = () => {
            if (selectedExercise) {
                const {  type_of_measurement } = selectedExercise;
                const {id} = exercisesStore.currentExercise;

                if (type_of_measurement === 'weight_and_reps') {
                    if(weight === '0' || repetitions === 'NaN') {
                        return;
                    }
                    workoutsController.setDone(selectedExercise, { id, repetitions, weight });
                } else if (type_of_measurement === 'reps') {
                    if(repetitions !== 'NaN') {
                        workoutsController.setDone(selectedExercise, { id, repetitions });
                    }
                } else if (type_of_measurement === 'duration') {
                    if(duration !== '0'){
                        workoutsController.setDone(selectedExercise, { duration, id });
                    }
                } else if (type_of_measurement === 'duration_and_distance') {
                    if(duration === '0' || distance === '0'){
                        return;
                    }
                    workoutsController.setDone(selectedExercise, { distance, duration, id });
                } else if (type_of_measurement === 'duration_and_reps') {
                    if(duration === '0' || repetitions === 'NaN'){
                        return;
                    }
                    workoutsController.setDone(selectedExercise, { duration, id, repetitions });
                } else if (type_of_measurement === 'cardio') {
                    if(duration === '0' || distance === '0'){
                        return;
                    }
                    workoutsController.setDone(selectedExercise, { distance, duration, id });
                } else {
                    console.log('Unknown type of measurement:', type_of_measurement);
                }
            }
        };



        const deleteSet = useCallback((id: string, userExerciseId: number) => {
            workoutsController.deleteSet(id, userExerciseId);
        }, []);

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
                        ? ( <div className="exercises-container">
                            {selectedExercises.length > 0 && selectedExercises.map(exercise => (
                                <React.Fragment key={exercise.id}>
                                    <SelectedExercise
                                        key={exercise.id}
                                        exercise={exercise}
                                        mode='view'
                                        onClick={() => handleExerciseClick(exercise)}
                                    />

                                </React.Fragment>
                            ))}
                        </div>)
                        : (<p>Нет упраженений для тренировки.</p>)}

                    {selectedExercise && <CurrentExercise exercise={selectedExercise}
                        setDone={setDone}
                        exerciseDone={exerciseDone}
                        handleWeightChange={handleWeight}
                        handleRepetitionsChange={handleReps}
                        handleDurationChange={handleDuration}
                        handleDistanceChange={handleDistance}/>
                    }

                    {currentWorkout.user_exercises.length > 0 && (
                        <UserExercisesList userExercises={currentWorkout.user_exercises} deleteSet={deleteSet}/>)}

                    <button className='save-btn' onClick={handleFinishClick}>
                        {i18next.t('workout.finish')}
                    </button>
                </div>
            )
            : (
                <div>Нет тренировки.</div>
            );
    }));
