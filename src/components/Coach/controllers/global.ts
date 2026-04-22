import {
    clientsStore,
    coachExercisesStore,
    coachInvitationsStore,
    coachPlansStore,
    coachTrainingGoalsStore,
    coachWorkoutsStore,
} from '../store/global';
import ClientsController from './ClientsController';
import CoachExercisesController from './CoachExercisesController';
import CoachInvitationsController from './CoachInvitationsController';
import CoachPlansController from './CoachPlansController';
import CoachTrainingGoalsController from './CoachTrainingGoalsController';
import CoachWorkoutController from './CoachWorkoutsController';

const clientsController = new ClientsController(clientsStore);
const coachInvitationsController = new CoachInvitationsController(coachInvitationsStore);
const coachWorkoutsController = new CoachWorkoutController(coachWorkoutsStore, coachExercisesStore);
const coachExercisesController = new CoachExercisesController(coachExercisesStore, coachWorkoutsStore);
const coachPlansController = new CoachPlansController(coachPlansStore);
const coachTrainingGoalsController = new CoachTrainingGoalsController(coachTrainingGoalsStore);

export {
    clientsController,
    coachInvitationsController,
    coachWorkoutsController,
    coachExercisesController,
    coachPlansController,
    coachTrainingGoalsController,
};

