import { inject, observer } from 'mobx-react';
import React from 'react';
import exercisesStore from '../../../../store/exercisesStore';
import './WorkoutExercises.style.scss';




export const WorkoutExercises: React.FC = inject('exercisesStore', 'exercisesController')(
    observer((children :React.JSX.Element): React.JSX.Element =>{
        // Const {workoutExercises} =  exercisesStore;
        console.log(exercisesStore, 'ssssss');

        return <div className="table">
            <table >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Sets</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {[].map((exercise, i) =>
                        <WorkoutExercise {...exercise} key = {i}/>)} */}
                    {children}
                </tbody>
            </table>
        </div>;})
);
