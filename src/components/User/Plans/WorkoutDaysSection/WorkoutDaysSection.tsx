/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { observer, inject } from 'mobx-react';

import PlansStore, { WorkoutDayInterface } from '../../../../store/plansStore';
import { plansController } from '../../../../controllers/global';
import WorkoutDayForm from '../WorkoutDay/WorkoutDayForm';
import './WorkoutDaysSection.style.scss';

interface Workout {
  id: number;
  name: string;
}

interface Props {
  planId: number;
  availableWorkouts: Workout[];
  plansStore?: PlansStore;
}

const WorkoutDaysSection: React.FC<Props> = inject('plansStore')(observer(({
    planId,
    availableWorkouts,
    plansStore,
}) => {
    const workoutDays = plansStore?.currentPlan?.workout_days || [];

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDayId, setEditingDayId] = useState<number | null>(null);

    const handleAddClick = useCallback(() => {
        setEditingDayId(null);
        setIsFormOpen(true);
    }, []);

    const handleCancel = useCallback(() => {
        setEditingDayId(null);
        setIsFormOpen(false);
    }, []);

    const handleDelete = useCallback(async(dayId: number) => {
        try {
            await plansController.deleteWorkoutDay(planId, dayId);
        } catch (error) {
            console.error('Ошибка при удалении тренировочного дня:', error);
        }
    }, [planId]);

    const handleUpdate = useCallback(async(dayData: any) => {
        await plansController.updateWorkoutDay(planId, dayData);
        setEditingDayId(null);
    }, [planId]);

    const handleCreate = useCallback(async(dayData: WorkoutDayInterface) => {
        await plansController.addWorkoutDayToPlan(planId, dayData);
        setIsFormOpen(false);
    }, [planId]);

    return (
        <div className="workout-days-section">
            <h3>Тренировочные дни</h3>

            <div className="workout-days-list" aria-label="Список тренировочных дней">
                {workoutDays.map((day, i) => (
                    <div key={day.id} className="workout-day-item">
                        <WorkoutDayForm
                            num={i+1}
                            day={day}
                            availableWorkouts={availableWorkouts}
                            onCancel={() => setEditingDayId(null)}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            isEditing={editingDayId === day.id}
                            onEdit={() => setEditingDayId(day.id)}
                        />
                    </div>
                ))}
            </div>

            {workoutDays.length === 0 && !isFormOpen && (
                <p>Нет тренировочных дней</p>
            )}

            {!isFormOpen && (
                <button onClick={handleAddClick}>Добавить тренировочный день</button>
            )}

            {isFormOpen && (
                <div className="new-workout-day-form">
                    <WorkoutDayForm
                        onCreate={handleCreate}
                        onCancel={handleCancel}
                        availableWorkouts={availableWorkouts}
                        isEditing
                    />
                </div>
            )}
        </div>
    );
}));

export default WorkoutDaysSection;
