import React, { useCallback } from 'react';
import DistanceInput from '../../../../Common/DistanceInput';
import DurationDecimalInput from '../../../../Common/DurationDecimal';
import RepetitionsInput from '../../../../Common/RepetitionsInput';
import TimeInput from '../../../../Common/TimeInput';
import WeightInput from '../../../../Common/WeightInput';
import { TrainingGoalInterface } from '../../../store/CoachTrainingGoalsStore';
import { GOAL_TYPE_FIELD_META } from './TrainingGoalConstants';

export const GoalValueInput: React.FC<{
  meta: typeof GOAL_TYPE_FIELD_META[string];
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<TrainingGoalInterface>>;
}> = ({ meta, name, value, onChange, setFormData}) => {
    const handleInputChange = useCallback((val: string| number) => {
        setFormData(prev => ({
            ...prev,
            [name]: Number(val),
        }));
    }, [onChange,
        setFormData,
        name,
        meta]);

    if (meta.component === 'TimeInput') {
        return (
            <TimeInput
                onChange={handleInputChange}
                exercise={{ duration: Number(value) } as { duration: number }}
            />
        );
    }

    if (meta.component === 'DurationDecimalInput') {
        return (
            <DurationDecimalInput
                value={Number(value)}
                onChange={handleInputChange}
            />
        );
    }
    if (meta.component === 'WeightInput') {
        return (
            <WeightInput
                exercise={{ weight: value } as { weight: string }}
                onChange={handleInputChange}
            />
        );
    }

    if (meta.component === 'DistanceInput') {
        return (
            <DistanceInput
                exercise={{ distance: value } as { distance: string }}
                onChange={handleInputChange}
            />
        );
    }

    if (meta.component === 'RepetitionsInput') {
        return (
            <RepetitionsInput
                exercise={{ repetitions: value } as { repetitions: number }}
                onChange={handleInputChange}
            />
        );
    }

    return (
        <input
            type={meta.valueType}
            name={name}
            value={value}
            onChange={onChange}
            required
        />
    );
};
