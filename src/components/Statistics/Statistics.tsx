import React from 'react';
import './Statistics.style.scss';
import {ShortStatInterface} from '../../store/userStore';
// Import {inject} from 'mobx-react';


// eslint-disable-next-line no-magic-numbers
export const ONE_DAY = 24 * 60 * 60 * 1000;
// eslint-disable-next-line no-magic-numbers
export const ONE_WEEK = 7;
// Inject(@userStore)
export const Statistics = (data: ShortStatInterface): JSX.Element => {
    console.log(data, '999');
    return <div className="">
        <>
            <div><h3>Жим</h3><p>Максимальный результат: 100</p>
                <p>Результат прошлой тренировки: 100</p></div>


            <div><h3>Присед</h3><p>Максимальный результат: 100</p>
                <p>Результат прошлой тренировк и: 100</p>
            </div>
            <div><h3>Тяга</h3><p>Максимальный результат: 100</p><p>Результат прошлой тренировки: 100</p></div>
        </>
    </div>;
};


