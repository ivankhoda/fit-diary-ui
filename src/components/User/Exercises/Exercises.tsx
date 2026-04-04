import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './Exercises.style.scss';
import { inject, observer } from 'mobx-react';
import ExercisesController from '../../../controllers/ExercisesController';
import ExercisesStore, { Exercise, ExerciseFormData } from '../../../store/exercisesStore';
import ExerciseItem from './ExerciseItem/ExerciseItem';
import { useTranslation } from 'react-i18next';

import ExerciseModal from './ExerciseModal/ExerciseModal';
import { muscleGroups } from '../../Admin/ExercisesManagement/maps';
import { toJS } from 'mobx';
import { useToken } from '../../Auth/useToken';
import Pagination from '../../Common/Pagination/Pagination';
import FilterSelect, { type SelectOption } from '../../Common/FilterSelect';

export interface ExercisesInterface {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

const ITEMS_PER_PAGE = 10;

interface ExerciseRowProps {
    exercise: Exercise;
    exercisesController: ExercisesController;
    onEdit: (exercise: Exercise) => void;
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({ exercise, exercisesController, onEdit }) => {
    const handleDelete = useCallback(() => {
        exercisesController.deleteExercise(exercise.id);
    }, [exercise.id, exercisesController]);

    const handleEdit = useCallback(() => {
        onEdit(exercise);
    }, [exercise, onEdit]);

    return (
        <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            deleteExercise={handleDelete}
            edit={handleEdit}
        />
    );
};

interface UseExerciseFiltersParams {
    exercisesStore: ExercisesStore;
    exercisesController: ExercisesController;
    activeTab: 'base' | 'own';
    currentPage: number;
}

const useExerciseFilters = ({
    exercisesStore,
    exercisesController,
    activeTab,
    currentPage,
}: UseExerciseFiltersParams) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
    const [sortBy] = useState<'name' | 'duration' | 'category' | null>(null);

    useEffect(() => {
        if (exercisesController && exercisesStore && !exercisesStore.generalExercises?.length) {
            exercisesController.getExercises();
        }
    }, [exercisesController, exercisesStore]);

    const filteredList = useMemo(() => {
        let exercises = toJS(exercisesStore?.generalExercises);

        if (activeTab === 'own') {
            exercises = exercises.filter(exercise => exercise.own);
        } else {
            exercises = exercises.filter(exercise => !exercise.own && !exercise.coach_owned);
        }

        if (searchQuery) {
            exercises = exercises.filter(exercise =>
                exercise.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (selectedMuscleGroups.length > 0) {
            exercises = exercises.filter(exercise =>
                selectedMuscleGroups.some(group => exercise.muscle_groups.includes(group)));
        }

        if (sortBy) {
            exercises = exercises.slice().sort((a, b) => {
                if (sortBy === 'name') { return a.name.localeCompare(b.name); }
                if (sortBy === 'duration') { return a.duration - b.duration; }
                if (sortBy === 'category') { return a.category.localeCompare(b.category); }
                return 0;
            });
        }

        return exercises;
    }, [
        exercisesStore.generalExercises,
        searchQuery,
        selectedMuscleGroups,
        sortBy,
        activeTab,
    ]);

    const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

    const filteredExercises = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [
        filteredList,
        currentPage,
        activeTab,
    ]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleMuscleGroupChange = useCallback((values: string[]) => {
        setSelectedMuscleGroups(values);
    }, []);

    return {
        filteredExercises,
        handleMuscleGroupChange,
        handleSearchChange,
        searchQuery,
        selectedMuscleGroups,
        totalPages,
    };
};

const useExercisesState = (exercisesStore: ExercisesStore, exercisesController: ExercisesController) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'base' | 'own'>('own');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exerciseToEdit, setExerciseToEdit] = useState<ExerciseFormData | null>(null);

    const filters = useExerciseFilters({ activeTab, currentPage, exercisesController, exercisesStore });

    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
        setExerciseToEdit(null);
    }, []);

    const handleSaveSuccess = useCallback(() => {
        setIsModalVisible(false);
        setExerciseToEdit(null);
    }, []);

    const handleOpenModal = useCallback((exercise: ExerciseFormData | null = null) => {
        setExerciseToEdit(exercise);
        setIsModalVisible(true);
    }, []);

    const handleOpenNewExercise = useCallback(() => {
        handleOpenModal(null);
    }, [handleOpenModal]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleTabChange = useCallback((tab: 'base' | 'own') => {
        setActiveTab(tab);
        setCurrentPage(1);
    }, []);

    const handleBaseClick = useCallback(() => {
        handleTabChange('base');
    }, [handleTabChange]);

    const handleOwnClick = useCallback(() => {
        handleTabChange('own');
    }, [handleTabChange]);

    return {
        activeTab,
        currentPage,
        exerciseToEdit,
        handleBaseClick,
        handleModalClose,
        handleOpenModal,
        handleOpenNewExercise,
        handleOwnClick,
        handlePageChange,
        handleSaveSuccess,
        isModalVisible,
        ...filters,
    };
};

const Exercises: React.FC<ExercisesInterface> = ({ exercisesStore, exercisesController }) => {
    const { t } = useTranslation();
    const { token } = useToken();

    const {
        activeTab,
        currentPage,
        exerciseToEdit,
        filteredExercises,
        handleBaseClick,
        handleModalClose,
        handleMuscleGroupChange,
        handleOpenModal,
        handleOpenNewExercise,
        handleOwnClick,
        handlePageChange,
        handleSaveSuccess,
        handleSearchChange,
        isModalVisible,
        searchQuery,
        selectedMuscleGroups,
        totalPages,
    } = useExercisesState(exercisesStore, exercisesController);

    const muscleGroupOptions: SelectOption[] = muscleGroups.map(group => ({
        label: t(group.name),
        value: group.name,
    }));

    return (
        <div className="container">
            <h1>{t('exercises.title')}</h1>
            {token && <div className="tabs">

                <button className={activeTab === 'base' ? 'active' : ''} onClick={handleBaseClick}>
                    {t('exercises.tabs.base')}
                </button>
                <button className={activeTab === 'own' ? 'active' : ''} onClick={handleOwnClick}>
                    {t('exercises.tabs.own')}
                </button>

                {/* COACH MODE DISABLED FOR V1.0 */}
                {/* <button className={activeTab === 'coach_owned' ? 'active' : ''} onClick={() => handleTabChange('coach_owned')}>
                    {t('exercises.tabs.coach')}
                </button> */}
                <div>
                    <button onClick={handleOpenNewExercise}>{t('createExercise')}</button>

                    {isModalVisible && (
                        <ExerciseModal onClose={handleModalClose} onSave={handleSaveSuccess}
                            exercisesController={exercisesController}
                            exercise={exerciseToEdit} isOpen={isModalVisible}
                        />
                    )}
                </div>

            </div>}

            <div className="filters">
                <input
                    type="text"
                    placeholder={t('exercises.searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <FilterSelect
                    isMulti
                    options={muscleGroupOptions}
                    value={selectedMuscleGroups}
                    onChange={handleMuscleGroupChange}
                    placeholder={t('exercises.allMuscleGroups')}
                />
            </div>
            <div className="filtered-exercises">
                {filteredExercises.length > 0
                    ? (
                        filteredExercises.map(exercise => (
                            <ExerciseRow
                                key={exercise.id}
                                exercise={exercise}
                                exercisesController={exercisesController}
                                onEdit={handleOpenModal}
                            />
                        ))
                    )
                    : (
                        <p>{t('exercises.noExercises')}</p>
                    )}
            </div>

            {filteredExercises && filteredExercises.length > 0 && <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />}
        </div>
    );
};

export default inject('exercisesStore', 'exercisesController')(observer(Exercises));
