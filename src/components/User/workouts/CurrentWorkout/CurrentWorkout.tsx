/* eslint-disable max-lines-per-function */
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

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import ProgressBar from '../../../Common/ProgressBar';

interface Props {
    workout?: WorkoutInterface;
}

export const CurrentWorkout: React.FC<Props> =
    inject('exercisesStore', 'exercisesController', 'workoutsStore', 'workoutsController')(observer((): React.JSX.Element => {
        const [selectedExercise, setSelectedExercise] = useState<ExerciseInterface | null>(null);
        const [selectedExercises, setSelectedExercises] = useState<ExerciseInterface[]>([]);
        const [weight, setWeight] = useState(selectedExercise?.weight?.toString() || '0');
        const [repetitions, setRepetitions] = useState(selectedExercise?.repetitions?.toString() || '0');
        const [duration, setDuration] = useState(selectedExercise?.duration ? selectedExercise?.duration : '');
        const [distance, setDistance] = useState(selectedExercise?.distance?.toString() || '0');

        const { workoutId } = useParams<{ workoutId: string }>();

        const [sets] = useState(exercisesStore.currentUserExerciseSets);
        const navigate = useNavigate();
        const currentWorkout = workoutsStore.currentUserWorkout;
        const {currentUserExercise} = exercisesStore;
        const {currentExercise} = exercisesStore;

        useEffect(() => {
            if (!currentWorkout) {workoutsController.getUserWorkout(workoutId);}
            if (currentExercise) {handleExerciseClick(currentExercise);}
        }, [navigate,
            sets,
            currentWorkout,
            selectedExercise,
            currentExercise,
            currentUserExercise]);

        useEffect(() => {
            if (currentWorkout) {setSelectedExercises(currentWorkout.workout_exercises);}
        }, [currentWorkout]);

        const handleWeight = useCallback((w: string) => {setSelectedExercise(prev => ({...prev,weight: w}));
            setWeight(w);
        }, [weight]);

        const handleReps = useCallback((r: string) => {setSelectedExercise(prev => ({...prev,repetitions: Number(r)}));
            setRepetitions(r);
        }, [repetitions]);

        const handleDuration = useCallback((d: string) => {setSelectedExercise(prev => ({...prev,duration: Number(d)}));
            setDuration(d);
        }, [duration]);

        const handleDistance = useCallback((d: string) => {setSelectedExercise(prev => ({...prev,distance: d}));
            setDistance(d);
        }, [distance]);

        const handleExerciseClick = useCallback((exercise: ExerciseInterface) => {
            exercisesStore.setCurrentExercise(null);

            if(exercise.id !== currentUserExercise?.workout_exercise_id) {exercisesStore.setCurrentUserExercise(null); }

            const updates: Partial<ExerciseInterface> = {
                distance: exercise.distance?.toString() || '0.0',
                duration: exercise.duration ? Number(exercise.duration) : 0,
                repetitions: exercise.repetitions || 0,
                weight: exercise.weight?.toString() || '0',
            };

            const typeConfig: Record<string, (keyof typeof updates)[]> = {
                cardio: ['duration', 'distance'],
                duration: ['duration'],
                duration_and_distance: ['duration', 'distance'],
                duration_and_reps: ['duration', 'repetitions'],
                reps: ['repetitions'],
                weight_and_reps: ['weight', 'repetitions'],
            };

            const fieldsToUpdate = typeConfig[exercise.type_of_measurement] || [];
            const newState: Partial<ExerciseInterface> = fieldsToUpdate.reduce((acc, field) => ({ ...acc, [field]: updates[field] }), {});
            setSelectedExercise(exercise);
            setWeight(newState.weight ?? '0');
            setRepetitions(newState.repetitions?.toString() ?? '0');
            setDuration(newState.duration ?? '');
            setDistance(newState.distance ?? '0.0');
        }, [currentWorkout,
            selectedExercise,
            setSelectedExercise,
            repetitions]);

        const handleExerciseStartClick = useCallback((exercise: ExerciseInterface) => {
            workoutsController.startOrResumeExercise(exercise.exercise_id, currentWorkout.id, exercise.id);
        }, [currentWorkout]);

        const setDone = useCallback(() => {
            if (!selectedExercise) {return;}

            const { type_of_measurement } = selectedExercise;
            const { id } = exercisesStore.currentUserExercise;

            const values = { distance, duration, repetitions, weight };

            const measurementConfig: Record<string, (keyof typeof values)[]> = {
                cardio: ['duration', 'distance'],
                duration: ['duration'],
                duration_and_distance: ['duration', 'distance'],
                duration_and_reps: ['duration', 'repetitions'],
                reps: ['repetitions'],
                weight_and_reps: ['weight', 'repetitions'],
            };

            const requiredFields = measurementConfig[type_of_measurement];

            if (requiredFields && requiredFields.every(field => values[field] !== '' && values[field] !== '0')) {
                const payload = requiredFields.reduce((acc, field) => ({ ...acc, [field]: values[field] }), { id });
                workoutsController.setDone(selectedExercise, payload);
            } else {
                console.log('Unknown or invalid type of measurement:', type_of_measurement);
            }
        }, [selectedExercise,
            weight,
            repetitions,
            duration,
            distance]);

        const deleteSet = useCallback((id: string, userExerciseId: number) => {workoutsController.deleteSet(id, userExerciseId);}, []);

        const exerciseDone = useCallback(() => () => {setSelectedExercise(null);}, []);

        const handleFinishClick = useCallback(() => {
            if (currentWorkout) {
                workoutsController.finishWorkout(currentWorkout.id, navigate);
            }
        }, [currentWorkout?.id]);

        const handleExerciseClickFactory = (exercise: ExerciseInterface) => () => {handleExerciseClick(exercise);};

        const handleFinishExercise = useCallback(() => {
            workoutsController.finishExercise(selectedExercise.exercise_id, currentWorkout.id, selectedExercise.id);
        }, [selectedExercise]);

        return currentWorkout
            ? (
                <div className='workout-container'>
                    <h2 className='workout-name'>{currentWorkout.name}</h2>

                    {currentWorkout.workout_exercises.length > 0
                        ? (
                            <div className="exercises-container">
                                <DndProvider backend={TouchBackend}>
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={15}
                                        slidesPerView={1}
                                        pagination={{ clickable: true }}
                                        className="exercise-swiper"

                                    >
                                        {selectedExercises.length > 0 &&
                                        selectedExercises.map(exercise => (
                                            <SwiperSlide key={exercise.id}>
                                                <SelectedExercise
                                                    key={exercise.id}
                                                    exercise={exercise}
                                                    mode="view"
                                                    onClick={handleExerciseClickFactory(exercise)}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </DndProvider>
                            </div>
                        )
                        : (<p>Нет упраженений для тренировки.</p>)}

                    {selectedExercise && <CurrentExercise exercise={selectedExercise}
                        setDone={setDone}
                        exerciseDone={exerciseDone}
                        handleWeightChange={handleWeight}
                        handleRepetitionsChange={handleReps}
                        handleDurationChange={handleDuration}
                        handleDistanceChange={handleDistance}
                        startExerciseClick={handleExerciseStartClick}
                        finishExerciseClick={handleFinishExercise}
                        currentUserExercise={exercisesStore.currentUserExercise}
                    />
                    }
                    {currentWorkout.completion_rate > 0 && <ProgressBar value={currentWorkout.completion_rate} />}
                    {currentWorkout?.user_exercises?.length > 0 && (
                        <UserExercisesList userExercises={currentWorkout.user_exercises.slice().sort((a, b) => a.id - b.id)} deleteSet={deleteSet}/>)}

                    <button className='save-btn' onClick={handleFinishClick}>
                        {i18next.t('workout.finish')}
                    </button>
                </div>
            )
            : (
                <div>Нет тренировки.</div>
            );
    }));
