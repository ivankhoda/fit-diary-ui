/* eslint-disable complexity */
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
    const {currentPlan} = plansStore;
    const isCoachPlan = currentPlan?.coach_plan === true;

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

            const isoStr =
            typeof dateStr === 'string'
                ? dateStr.replace(' ', 'T').replace(' UTC', 'Z')
                : dateStr.toISOString();

            const date = new Date(isoStr);
            return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
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
            if (isCoachPlan) {return;}

            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));

            setFieldErrors(prev => {
                const rest = { ...prev };
                delete rest[name];
                return rest;
            });
        }, [isCoachPlan]
    );

    const handleGoalChange = useCallback((selectedGoalId: number | null) => {
        if (isCoachPlan) {return;}
        setFormData(prev => ({
            ...prev,
            training_goal_id: selectedGoalId
        }));

        setFieldErrors(prev => {
            const rest = { ...prev };
            delete rest.training_goal_id;
            return rest;
        });
    }, [isCoachPlan]);

    const handleStatusChange = useCallback((status: string) => {
        if (isCoachPlan) {return;}
        /*
         * If (plansStore.activePlans.some(plan => plan.status === 'active') && status ==='active') {
         *     setFieldErrors(prev => ({ ...prev, status: 'Уже есть активный план' }));
         *     return;
         * }
         */

        setFieldErrors(prev => {
            const rest = { ...prev };
            delete rest.status;
            return rest;
        });
        setFormData(prev => ({
            ...prev,
            status,
        }));
    }, [plansStore, isCoachPlan]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (isCoachPlan) { return; }

        setGeneralError('');
        setFieldErrors({});

        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            errors.name = 'Название обязательно';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const cleanData = getCleanPlanData(formData);

        try {
            if (isEditMode && id) {
                plansController.updatePlan(Number(id), cleanData);
            } else {
                plansController.createPlan(cleanData, navigate);
            }
        } catch {
            setGeneralError('Не удалось сохранить план. Попробуйте снова.');
        }
    }, [formData,
        id,
        isEditMode,
        isCoachPlan]);

    const handleDelete = useCallback(() => {
        if (!isEditMode || !id || isCoachPlan) {return;}

        try {
            plansController.deletePlan(Number(id));
            navigate('/plans');
        } catch {
            setGeneralError('Не удалось удалить план.');
        }
    }, [id,
        isEditMode,
        navigate,
        isCoachPlan]);

    const handleCancel = useCallback(() => {
        navigate('/plans');
    }, [navigate]);

    return (
        <div className="plan-form">
            <h2>{isEditMode ? 'Редактирование плана' : 'Создание нового плана'}</h2>

            {isCoachPlan && (
                <div className="info-message">
                    Этот план назначен тренером и не может быть изменен.
                </div>
            )}

            {generalError && <div className="error-message general-error">{generalError}</div>}

            <form onSubmit={handleSubmit} className="plan-form__form">
                <div className="form-group">
                    <label htmlFor="name">Название *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}

                        disabled={isCoachPlan}
                        maxLength={50}
                        className={fieldErrors.name ? 'input-error' : ''}
                    />

                    <small className="field-hint">Макс. 50 символов</small>
                    {fieldErrors.name && <div className="error-message">{fieldErrors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        disabled={isCoachPlan}
                        maxLength={500}
                        className={fieldErrors.description ? 'input-error' : ''}
                    />
                    <small className="field-hint">Макс. 500 символов</small>
                    {fieldErrors.description && <div className="error-message">{fieldErrors.description}</div>}
                </div>

                <div className='form-group'>
                    <TrainingGoalSelector
                        visible
                        trainingGoals={trainingGoalsStore.activeGoals}
                        value={formData.training_goal_id}
                        onChange={handleGoalChange}
                        disabled={isCoachPlan}
                    />
                    {fieldErrors.training_goal_id && <div className="error-message">{fieldErrors.training_goal_id}</div>}
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
                            disabled={isCoachPlan}
                            className={fieldErrors.start_date ? 'input-error' : ''}
                        />
                        {fieldErrors.start_date && <div className="error-message">{fieldErrors.start_date}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="end_date">Дата окончания</label>
                        <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            disabled={isCoachPlan}
                            className={fieldErrors.end_date ? 'input-error' : ''}
                        />
                        {fieldErrors.end_date && <div className="error-message">{fieldErrors.end_date}</div>}
                    </div>
                </div>

                <div className='form-group'>
                    <PlanStatusSelector
                        visible
                        value={formData.status || 'draft'}
                        onChange={handleStatusChange}
                        disabled={isCoachPlan}
                    />
                    {fieldErrors.status && <div className="error-message">{fieldErrors.status}</div>}
                </div>

                {isEditMode && id && <WorkoutDaysSection
                    planId={Number(id)}
                    availableWorkouts={workoutsStore.workouts.map(w => ({ id: w.id, name: w.name }))}
                    disabled={isCoachPlan}
                />}

                <div className="form-actions">
                    {isEditMode && (
                        <>
                            <button type="button" className="secondary" onClick={handleDelete} disabled={isCoachPlan}>
                                Удалить
                            </button>
                            <button type="button" className="secondary" onClick={handleCancel}>
                                Отмена
                            </button>
                        </>
                    )}
                    <button type="submit" disabled={isCoachPlan || Object.keys(fieldErrors).length > 0 || !formData.name} >
                        {isEditMode ? 'Сохранить' : 'Создать'}
                    </button>
                </div>
            </form>

            <hr />

        </div>
    );
}));

export default PlanForm;
