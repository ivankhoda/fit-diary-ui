/* eslint-disable no-useless-constructor */

import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import ExercisesController from '../../../../controllers/ExercisesController';
import ExercisesStore from '../../../../store/exercisesStore';

interface ExerciseRepsInterface  {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

@inject('exercisesStore', 'exercisesController')
@observer
export default class ExerciseRepsInput extends React.Component<ExerciseRepsInterface> {
    constructor(props: ExerciseRepsInterface) {
        super(props);
    }

    handleExerciseReps = (event: ChangeEvent<HTMLInputElement>): void =>{
        this.props.exercisesStore.setRepetitions(Number(event.target.value));
    };

    render(): React.JSX.Element {
        return <>
            <input
                type="text"
                placeholder="Повторения"
                value={ this.props.exercisesStore.repetitions? this.props.exercisesStore.repetitions : ''}
                onInput={this.handleExerciseReps}
            />
        </>;
    }
}

