/* eslint-disable no-useless-constructor */

import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import ExercisesController from '../../../../../controllers/ExercisesController';
import ExercisesStore from '../../../../../store/exercisesStore';

interface ExerciseSelectInterface  {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

@inject('exercisesStore', 'exercisesController')
@observer
export default class ExerciseWeightSelect extends React.Component<ExerciseSelectInterface> {
    constructor(props: ExerciseSelectInterface) {
        super(props);
    }

    handleExerciseWeightSelect = (event: ChangeEvent<HTMLInputElement>): void =>{
        this.props.exercisesStore.setWeight(Number(event.target.value));
    };

    render(): React.JSX.Element {
        return <>
            <input
                type="text"
                placeholder="Введите вес."
                value={this.props.exercisesStore.weight ? this.props.exercisesStore.weight : ''}
                onInput={this.handleExerciseWeightSelect}
            />
        </>;
    }
}

