/* eslint-disable sort-keys */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
/* eslint-disable no-alert */
/* eslint-disable max-lines-per-function */
import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import './SimpleModal.style.scss';
import ExercisesController from '../../../controllers/ExercisesController';
import WorkoutsController from '../../../controllers/WorkoutsController';
import ExercisesStore from '../../../store/exercisesStore';
import WorkoutsStore from '../../../store/workoutStore';
import NewWorkout from '../../User/workouts/NewWorkout/NewWorkout';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
  workoutsStore?: WorkoutsStore;
  exercisesStore?: ExercisesStore;
  workoutsController?: WorkoutsController;
  exercisesController?: ExercisesController;
}

const NewWorkoutModal: React.FC<Props> = observer(
    ({ visible, onClose,  ...storeProps }) => {
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

        if (!visible) {return null;}

        return (
            <div className="modal-backdrop">
                <div className="modal-container wide" ref={modalRef}>
                    <NewWorkout
                        {...storeProps}
                    />
                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                        <button onClick={onClose}>Отмена</button>
                    </div>
                </div>
            </div>
        );
    }
);

export default inject(
    'workoutsStore',
    'exercisesStore',
    'workoutsController',
    'exercisesController'
)(NewWorkoutModal);
