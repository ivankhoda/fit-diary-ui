import React, { useCallback, useEffect, useRef, useState } from 'react';
import ExerciseSelector from '../../User/TrainingGoals/TrainingGoal/ExerciseSelector';
import { ExerciseInterface } from '../../../store/exercisesStore';
import './SimpleModal.style.scss';
import { inject, observer } from 'mobx-react';
import { exercisesController, workoutsController } from '../../../controllers/global';
import { exercisesStore } from '../../../store/global';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (exercise: ExerciseInterface) => void;
    currentWorkoutId?: number;
}

const AddExerciseModal: React.FC<Props> = observer(({ visible, onClose, onSelect, currentWorkoutId }) => {
    const [selectedExercise, setSelectedExercise] = useState<ExerciseInterface | null>(null);

    useEffect(() => {
        if (visible && exercisesStore.generalExercises.length === 0) {
            exercisesController.getExercises();
        }
    }, [visible]);

    const handleExerciseChange = useCallback((id: number) => {
        const exercise = exercisesStore.generalExercises.find(e => e.id === id) as ExerciseInterface | undefined;
        setSelectedExercise(exercise || null);
    }, []);

    if (!visible) {return null;}

    const handleSave = useCallback(() => {
        if (selectedExercise) {
            workoutsController.startOrResumeExercise(selectedExercise.id, currentWorkoutId);
            onClose();
        }
    }, [selectedExercise, onSelect]);

    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="modal-backdrop">
            <div className="modal-container" ref={modalRef}>
                <ExerciseSelector
                    visible={true}
                    exercises={exercisesStore.generalExercises}
                    value={selectedExercise && typeof selectedExercise.id === 'number' ? selectedExercise.id : null}
                    onChange={handleExerciseChange}
                />
                <div className="modal-actions">
                    <button onClick={handleSave} disabled={!selectedExercise}>Начать упражнение</button>
                    <button onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
});

export default inject('exercisesStore', 'exercisesController')(AddExerciseModal);
