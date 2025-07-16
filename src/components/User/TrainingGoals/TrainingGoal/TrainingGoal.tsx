/* eslint-disable max-lines-per-function */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-statements */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import './TrainingGoal.style.scss';

import ExerciseSelector from './ExerciseSelector';

import { CATEGORY_OPTIONS, CATEGORY_TO_TYPES, GOAL_TYPE_FIELD_META, GOAL_TYPE_OPTIONS } from './TrainingGoalConstants';
import { trainingGoalsController, exercisesController } from '../../../../controllers/global';

import { exercisesStore, trainingGoalsStore } from '../../../../store/global';
// Import ParentGoalSelect from './ParentGoalSelect';
import { TrainingGoalInterface } from '../../../../store/trainingGoalsStore';
import { GoalValueInput } from './GoalValueInput';
import SelectField from './SelectField';
import DateField from './DateField';

const TrainingGoal: React.FC = inject('trainingGoalsStore', 'exercisesStore', 'exercisesController')(observer(() => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id) && !isNaN(Number(id));
    const [formData, setFormData] = useState<TrainingGoalInterface>({
        comment: '',
        current_value: 0,
        deadline: new Date().toISOString().split('T')[0],
        exercise_id: null,
        goal_category: '',
        goal_type: '',
        is_completed: false,
        name: '',
        parent_goal_id: null,
        target_value: 0,
    });

    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState<{ name?: string; goal_category?: string }>({});

    useEffect(() => {
        if (isEditMode && id) {
            trainingGoalsController.getGoalDetails(Number(id));
        }
    }, [id, isEditMode]);

    useEffect(() => {
        const goal = trainingGoalsStore.currentGoal;

        if (goal) {
            setFormData({
                ...goal,
                deadline: goal.deadline.toString().split('T')[0],
            });
            if (goal.exercise_id) {
                exercisesController.getExercises();
            }
        }
    }, [trainingGoalsStore.currentGoal]);

    useEffect(() => {
        if (trainingGoalsStore.goals.length === 0) {
            trainingGoalsController.getGoals();
        }
    }, []);

    const shouldShowExerciseSelect = ['strength',
        'technique',
        'rehabilitation',
        'endurance',
        'speed'].includes(formData.goal_category);

    useEffect(() => {
        if (shouldShowExerciseSelect && !exercisesStore.generalExercises.length) {
            exercisesController.getExercises();
        }
    }, [shouldShowExerciseSelect]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: ['target_value', 'current_value'].includes(name)
                ? parseFloat(value.replace(',', '.')) || 0
                : value
        }));

        setFormErrors(prevErrors => ({
            ...prevErrors,
            // eslint-disable-next-line no-undefined
            [name]: undefined
        }));
    }, []);

    const handleChangeComplete = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:  checked
        }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFormErrors({});

        const errors: { name?: string; goal_category?: string } = {};

        if (!formData.name.trim()) {
            errors.name = 'Введите название цели';
        }

        if (!formData.goal_category) {
            errors.goal_category = 'Выберите категорию';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (isEditMode && id) {
                trainingGoalsController.updateGoal(Number(id), formData);
            } else {
                trainingGoalsController.createGoal(formData);
            }
            navigate('/training_goals');
        } catch {
            setError('Не удалось сохранить цель. Попробуйте снова.');
        }
    }, [formData,
        id,
        isEditMode]);

    const handleDelete = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditMode || !id) {return;}

        setError('');
        try {
            trainingGoalsController.deleteGoal(Number(id));
            navigate('/training_goals');
        } catch {
            setError('Не удалось удалить цель.');
        }
    }, [id, isEditMode]);

    const handleGoalTypeChange = useCallback((value: string) => {
        setFormData({current_value: 0, target_value: 0, ...formData});
        setFormData(prev => ({
            ...prev,
            goal_type: value,
        }));
    }, [formData]);

    /*
     * Const handleParentGoalChange = useCallback((value: number | null) => {
     *     setFormData({current_value: 0, target_value: 0, ...formData});
     *     setFormData(prev => ({
     *         ...prev,
     *         parent_goal_id: value,
     *     }));
     * }, [formData]);
     */

    const handleExerciseChange = useCallback((value: number | null) => {
        setFormData({current_value: 0, target_value: 0, ...formData});
        setFormData(prev => ({
            ...prev,
            exercise_id: value,
        }));
    }, [formData]);

    const meta = GOAL_TYPE_FIELD_META[formData.goal_type];

    const shouldShowInputs = ['strength',
        'endurance',
        'speed',
        'weight'].includes(formData.goal_category);

    return (
        <div className="training-goal-form">
            <h2>{isEditMode ? 'Редактирование цели' : 'Создание новой цели'}</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className='training-goal-form__form'>

                <div className="form-group">
                    <label htmlFor="name">Название цели</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={formErrors.name ? 'input-error' : ''}
                    />
                    {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Комментарий</label>
                    <textarea id="comment" name="comment" value={formData.comment} onChange={handleChange} rows={3} />
                </div>

                <div className="form-group">
                    <SelectField
                        id="goal_category"
                        name="goal_category"
                        label="Категория"
                        value={formData.goal_category}
                        onChange={handleChange}
                        options={CATEGORY_OPTIONS}
                        required
                    />
                    {formErrors.goal_category && <div className="error-message">{formErrors.goal_category}</div>}
                </div>

                <SelectField
                    id="goal_type"
                    name="goal_type"
                    label="Тип цели"
                    value={formData.goal_type}
                    onChange={e => handleGoalTypeChange(e.target.value as string)}
                    options={CATEGORY_TO_TYPES[formData.goal_category]?.map(value => {
                        const opt = GOAL_TYPE_OPTIONS.find(o => o.value === value);
                        return opt ? { label: opt.label, value: opt.value } : null;
                    }).filter(Boolean) as { label: string; value: string }[]}

                />

                {/* <ParentGoalSelect
                    goals={trainingGoalsStore.goals}
                    value={formData.parent_goal_id}
                    onChange={handleParentGoalChange}
                /> */}
                <ExerciseSelector
                    visible={shouldShowExerciseSelect}
                    exercises={exercisesStore.generalExercises}
                    value={formData.exercise_id}
                    onChange={handleExerciseChange}
                />
                {isEditMode && (
                    <div className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            id="is_completed"
                            name="is_completed"
                            onChange={handleChangeComplete}
                            checked={formData.is_completed}
                        />
                        <label htmlFor="is_completed">Цель достигнута</label>
                    </div>
                )}

                {meta&& shouldShowInputs && formData.goal_type && <div className="goal-type-row">

                    <label>
                        {meta?.currentLabel}

                        <GoalValueInput
                            meta={meta}
                            name="current_value"
                            value={formData.current_value}
                            onChange={handleChange}
                            setFormData={setFormData}
                        />
                    </label>

                    <label>
                        {meta?.targetLabel}
                        <GoalValueInput
                            meta={meta}
                            name="target_value"
                            value={formData.target_value}
                            onChange={handleChange}
                            setFormData={setFormData}
                        />
                    </label>
                </div>}

                <DateField
                    id="deadline"
                    name="deadline"
                    label="Дедлайн"
                    value={formData.deadline}
                    onChange={handleChange}

                />

                <div className="form-actions">
                    {isEditMode && <button type="button" className="secondary" onClick={handleDelete} disabled={!isEditMode}>
                        Удалить
                    </button>}

                    <button type="button" className="secondary" onClick={() => navigate('/training_goals')}>
                        Отмена
                    </button>
                    <button type="submit">
                        {'Сохранить'}
                    </button>
                </div>
            </form>
        </div>
    );
}));

export default TrainingGoal;
