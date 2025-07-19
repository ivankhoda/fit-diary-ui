/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */
import React, { useState, useCallback, useEffect } from 'react';
import Modal from 'react-modal';
import i18n, { t } from 'i18next';
import './ExerciseModal.style.scss';
import ExercisesController from '../../../../controllers/ExercisesController';
import { categoryMap, difficultyMap, measurementKeys, muscleGroups } from '../../../Admin/ExercisesManagement/maps';

export interface ExerciseFormData {
  category: string;
  created_at: string;
  description: string;
  difficulty: string;
  duration: number;
  id: string;
  muscle_groups: string[];
  type_of_measurement: string;
  name: string;
  updated_at: string;
  public: boolean
}

type Props = {
  onClose: () => void;
  onSave: () => void;
  exercisesController: ExercisesController;
  exercise?: ExerciseFormData | null;
  isOpen?: boolean;
};

const ExerciseCreateModal: React.FC<Props> = ({ isOpen, onClose, onSave, exercisesController, exercise }) => {
    const [formData, setFormData] = useState<ExerciseFormData>({
        category: '',
        created_at: '',
        description: '',
        difficulty: '',
        duration: 0,
        id: '',
        muscle_groups: [],
        name: '',
        type_of_measurement: '',
        updated_at: '',
        public: false
    });

    useEffect(() => {
        if (exercise) {
            setFormData({ ...exercise });
        }
    }, [exercise]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleGroupClickFactory = (groupId: string) => () => {
        const newSelectedGroups = formData.muscle_groups.includes(groupId)
            ? formData.muscle_groups.filter(id => id !== groupId)
            : [...formData.muscle_groups, groupId];
        setFormData(prev => ({
            ...prev,
            muscle_groups: newSelectedGroups,
        }));
    };

    const [error, setError] = useState<string | null>(null);

    const handleSaveExercise = useCallback(() => {
        const { name, type_of_measurement } = formData;

        if (!name || !type_of_measurement) {
            setError(i18n.t('pleaseFillAllFields'));
            return;
        }

        if (exercise) {
            exercisesController.updateExercise(exercise.id, formData);
        } else {
            exercisesController.createExercise(formData);
        }
        onSave();
        onClose();
    }, [formData,
        exercisesController,
        onSave,
        onClose,
        exercise]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Exercise Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
        >
            {error && <div className="error-message">{error}</div>}
            <div>
                <div>
                    <strong>{i18n.t('name')}, {t('required')}</strong>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={i18n.t('name')}
                        required
                    />
                </div>
                <div>
                    <strong>{i18n.t('description')}</strong>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder={i18n.t('description')}
                        required
                    />
                </div>
                <div>
                    <strong>{i18n.t('category')}</strong>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>{i18n.t('selectCategory')}</option>
                        {categoryMap.map(key => (
                            <option key={key} value={key}>
                                {t(key)}
                            </option>
                        ))}
                    </select>

                </div>
                <div>
                    <strong>{i18n.t('difficulty')}</strong>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>{i18n.t('selectDifficulty')}</option>
                        {difficultyMap.map(key => (
                            <option key={key} value={key}>
                                {t(key)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <strong>{i18n.t('type_of_measurement')}, {t('required')}</strong>
                    <select
                        name="type_of_measurement"
                        value={formData.type_of_measurement}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>{i18n.t('selectTypeOfMeasurement')}</option>
                        {measurementKeys.map(key => (
                            <option key={key} value={key}>
                                {t(key)}
                            </option>
                        ))}
                    </select>
                </div>
                {formData.category === 'strength' && (
                    <div>
                        <strong>{i18n.t('muscleGroup')}</strong>
                        <div className="muscle-groups">
                            {muscleGroups.map(group => (
                                <div
                                    key={group.name}
                                    onClick={handleGroupClickFactory(group.name)}
                                    className={formData.muscle_groups.includes(group.name) ? 'active' : ''}
                                >
                                    {t(`exercise.muscleGroupsList.${group.name}`)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="modal-actions">
                    <button onClick={onClose}>{i18n.t('cancel')}</button>
                    <button onClick={handleSaveExercise}>{exercise ? i18n.t('editExercise') : i18n.t('createExercise')}</button>
                </div>
            </div>
        </Modal>
    );
};

export default ExerciseCreateModal;
