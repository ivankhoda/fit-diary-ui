/* eslint-disable no-useless-constructor */

import { inject, observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import ExercisesController from '../../../../controllers/ExercisesController';
import ExercisesStore from '../../../../store/exercisesStore';



interface ExerciseSetInterface  {
    exercisesStore?: ExercisesStore;
    exercisesController?: ExercisesController;
}

@inject('exercisesStore', 'exercisesController')
@observer
export default class ExerciseSetInput extends React.Component<ExerciseSetInterface> {
    constructor(props: ExerciseSetInterface) {
        super(props);
    }

    handleExerciseSet = (event: ChangeEvent<HTMLInputElement>): void =>{
        this.props.exercisesStore.setSets(Number(event.target.value));
    };

    render(): React.JSX.Element {
        return <>
            <input
                type="text"
                placeholder="Подходы"
                value={this.props.exercisesStore.sets ? this.props.exercisesStore.sets : ''}
                onInput={this.handleExerciseSet}
            />
        </>;
    }
}

