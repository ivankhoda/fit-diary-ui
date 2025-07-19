import React, { useCallback, useEffect, useRef, useState } from 'react';
import ExerciseSelector from '../../User/TrainingGoals/TrainingGoal/ExerciseSelector';
import { ExerciseInterface } from '../../../store/exercisesStore';
import './SimpleModal.style.scss';
import { inject, observer } from 'mobx-react';
import { exercisesController, workoutsController } from '../../../controllers/global';
import { exercisesStore } from '../../../store/global';
import { createPortal } from 'react-dom';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (exercise: ExerciseInterface) => void;
    currentWorkoutId?: number;
}

const AddExerciseModal: React.FC<Props> = observer(({ visible, onClose, onSelect, currentWorkoutId }) => {
    const [selectedExercise, setSelectedExercise] = useState<ExerciseInterface | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const modalRoot = document.getElementById('modal-root');

    useEffect(() => {
        if (visible && exercisesStore.generalExercises.length === 0) {
            exercisesController.getExercises();
        }
    }, [visible]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            setSelectedExercise(null);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, onClose]);

    const handleExerciseChange = useCallback((id: number) => {
        const exercise = exercisesStore.generalExercises.find(e => e.id === id) || null;
        setSelectedExercise(exercise);
    }, []);

    const handleSave = useCallback(() => {
        if (selectedExercise) {
            workoutsController.startOrResumeExercise(selectedExercise.id, currentWorkoutId);
            onSelect(selectedExercise);
            onClose();
        }
    }, [selectedExercise,
        currentWorkoutId,
        onClose,
        onSelect]);

    if (!visible || !modalRoot) {
        return null;
    }

    return createPortal(
        <div className="simple-modal-overlay-plan">
            <div className="simple-modal" ref={modalRef}>
                <ExerciseSelector
                    visible={true}
                    exercises={exercisesStore.generalExercises}
                    value={selectedExercise?.id || null}
                    onChange={handleExerciseChange}
                />
                <div className="modal-actions">
                    <button onClick={handleSave} disabled={!selectedExercise}>Начать упражнение</button>
                    <button onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>,
        modalRoot
    );
});

export default inject('exercisesStore', 'exercisesController')(AddExerciseModal);
