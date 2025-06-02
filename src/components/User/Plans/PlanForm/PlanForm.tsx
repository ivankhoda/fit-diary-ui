/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import './PlanForm.style.scss';

import { plansController, trainingGoalsController, workoutsController } from '../../../../controllers/global';
import { plansStore, trainingGoalsStore, workoutsStore } from '../../../../store/global';
import { PlanInterface } from '../../../../store/plansStore';

import WorkoutDaysSection from '../WorkoutDaysSection/WorkoutDaysSection';
import TrainingGoalSelector from './TrainingGoalSelector';
import PlanStatusSelector from './StatusSelector';

const PlanForm: React.FC = inject('plansStore')(observer(() => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id) && !isNaN(Number(id));

    const [formData, setFormData] = useState<PlanInterface>({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        training_goal_id: null,
        status: 'draft'
    });

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [generalError, setGeneralError] = useState('');

    const getCleanPlanData = (data: any): PlanInterface => ({
        name: data.name,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        training_goal_id: data.training_goal_id,
        status: data.status
    });

    useEffect(() => {
        if (isEditMode && id) {
            plansController.getPlanDetails(Number(id));
        }
        if(plansStore.activePlans.length === 0) {
            plansController.getPlans();
        }
    }, [id,
        isEditMode,
        plansStore]);

    useEffect(() => {
        if(workoutsStore.workouts.length === 0) {
            workoutsController.getWorkouts();
        }
    }, []);

    useEffect(() => {
        if(trainingGoalsStore.activeGoals.length === 0) {
            trainingGoalsController.getGoals();
        }
    }, []);

    useEffect(() => {
        const plan = plansStore.currentPlan;

        const formatDate = (dateStr: string | Date | null): string => {
            if (!dateStr) {return '';}

            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        };

        if (plan) {
            setFormData({
                name: plan.name,
                description: plan.description || '',
                start_date: formatDate(plan.start_date),
                end_date: plan.end_date ? formatDate(plan.end_date) : '',
                training_goal_id: plan.training_goal?.id,
                status: plan?.status
            });
        }
    }, [plansStore.currentPlan]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }, []
    );

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');
        setFieldErrors({});

        const cleanData = getCleanPlanData(formData);

        try {
            if (isEditMode && id) {
                plansController.updatePlan(Number(id), cleanData);
            } else {
                plansController.createPlan(cleanData);
            }
        } catch {
            setGeneralError('Не удалось сохранить план. Попробуйте снова.');
        }
    }, [formData,
        id,
        isEditMode]);

    const handleDelete = useCallback(() => {
        if (!isEditMode || !id) {return;}

        try {
            plansController.deletePlan(Number(id));
            navigate('/plans');
        } catch {
            setGeneralError('Не удалось удалить план.');
        }
    }, [id,
        isEditMode,
        navigate]);

    const handleCancel = useCallback(() => {
        navigate('/plans');
    }, [navigate]);

    const handleGoalChange = useCallback((selectedGoalId: number | null) => {
        setFormData(prev => ({
            ...prev,
            training_goal_id: selectedGoalId
        }));
    }, []);

    const handleStatusChange = useCallback((status: string) => {
        if (plansStore.activePlans.some(plan => plan.status === 'active') && status ==='active') {
            setFieldErrors(prev => ({ ...prev, status: 'Уже есть активный план' }));
            return;
        }

        setFieldErrors(prev => ({ ...prev, status: '' }));
        setFormData(prev => ({
            ...prev,
            status,
        }));
    }, [plansStore]);

    return (
        <div className="plan-form">
            <h2>{isEditMode ? 'Редактирование плана' : 'Создание нового плана'}</h2>

            {generalError && <div className="error-message general-error">{generalError}</div>}

            <form onSubmit={handleSubmit} className="plan-form__form">
                <div className="form-group">
                    <label htmlFor="name">Название</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <div className='form-group'>

                    <TrainingGoalSelector
                        visible
                        trainingGoals={trainingGoalsStore.activeGoals}
                        value={formData.training_goal_id}
                        onChange={handleGoalChange}
                    />
                </div>

                <div className='plan_date'>
                    <div className="form-group">
                        <label htmlFor="start_date">Дата начала</label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="end_date">Дата окончания</label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className='form-group'>

                    <PlanStatusSelector
                        visible={true}
                        value={formData.status || 'draft'}
                        onChange={handleStatusChange}

                    />
                    {fieldErrors.status && <div className="error-message">{fieldErrors.status}</div>}

                </div>
                {id && <WorkoutDaysSection
                    planId={Number(id)}
                    availableWorkouts={workoutsStore.workouts.map(w => ({ id: w.id, name: w.name }))}
                />}
                <div className="form-actions">
                    {isEditMode && (
                        <>
                            <button type="button" className="secondary" onClick={handleDelete}>
                                Удалить
                            </button>
                            <button type="button" className="secondary" onClick={handleCancel}>
                                Отмена
                            </button>
                        </>
                    )}
                    <button type="submit">
                        {isEditMode ? 'Сохранить' : 'Создать'}
                    </button>
                </div>
            </form>

            <hr />

        </div>
    );
}));

export default PlanForm;
