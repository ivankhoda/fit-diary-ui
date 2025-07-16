import React, { useState, useCallback, useEffect } from 'react';
import './SelfStats.style.scss';
import { inject, observer } from 'mobx-react';
import UserController from '../../../../controllers/UserController';
import UserStore from '../../../../store/userStore';

interface SelfStatsProps {
  userStore?: UserStore;
  userController?: UserController;
}

const formatDateForInput = (dateString: string): string => {
    const ten = 10;
    return dateString.substring(0, ten);
};

const SelfStats: React.FC<SelfStatsProps> = ({ userStore, userController }) => {
    const [weight, setWeight] = useState<string>('');
    const [recordedAt, setRecordedAt] = useState<string>('');
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    useEffect(() => {
        userController?.getWeightMeasurements();
    }, [userController]);

    const handleWeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;

        if (/^\d*\.?\d*$/u.test(value)) {
            setWeight(value);
        }
    }, []);

    const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setRecordedAt(e.target.value);
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (weight && recordedAt) {
                userController?.addWeightMeasurement(parseFloat(weight), recordedAt);
                setWeight('');
                setRecordedAt('');
                setIsFormVisible(false);
            }
        },
        [weight,
            recordedAt,
            userController]
    );

    const handleToggleForm = useCallback(() => {
        setIsFormVisible(prev => !prev);
    }, []);

    const measurements = userStore?.measurements || [];

    const handleDeleteMeasurement = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
            const measurementId = e.currentTarget.getAttribute('data-id');

            if (measurementId) {
                userController?.deleteWeightMeasurement(Number(measurementId));
            }
        },
        [userController]
    );

    return (
        <div className="user-measurement-form">
            <h2>Вес</h2>
            <div className="chart-placeholder notebook">
                {measurements.length === 0
                    ? (
                        <p>Пока данных нет.</p>
                    )
                    : (
                        <ul>
                            {measurements.map((measurement, index) => (
                                <li key={index}>
                                    <span className="date">{formatDateForInput(measurement.recorded_at)}</span>:
                                    <span className="weight">{measurement.weight} кг</span>
                                    <span
                                        onClick={handleDeleteMeasurement}
                                        data-id={measurement.id}
                                        className="delete-button"
                                    >
                  X
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>

            <button className="toggle-form-button" onClick={handleToggleForm}>
                {isFormVisible ? 'Отменить' : 'Добавить показатели'}
            </button>

            {isFormVisible && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="weight">Вес (кг):</label>
                        <input
                            type="text"
                            id="weight"
                            value={weight}
                            onChange={handleWeightChange}
                            required
                            placeholder="70.5"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recordedAt">Дата:</label>
                        <input
                            type="date"
                            id="recordedAt"
                            value={recordedAt}
                            onChange={handleDateChange}
                            required
                        />
                    </div>
                    <button type="submit">Добавить</button>
                </form>
            )}
        </div>
    );
};

export default inject('userStore', 'userController')(observer(SelfStats));
