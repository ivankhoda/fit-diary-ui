import { clientsStore, coachExercisesStore, coachPlansStore, coachTrainingGoalsStore, coachWorkoutsStore } from '../store/global';
import ClientsController from './ClientsController';
import CoachExercisesController from './CoachExercisesController';
import CoachPlansController from './CoachPlansController';
import CoachTrainingGoalsController from './CoachTrainingGoalsController';
import CoachWorkoutController from './CoachWorkoutsController';

const clientsController = new ClientsController(clientsStore);
const coachWorkoutsController = new CoachWorkoutController(coachWorkoutsStore);
const coachExercisesController = new CoachExercisesController(coachExercisesStore, coachWorkoutsStore);
const coachPlansController = new CoachPlansController(coachPlansStore);
const coachTrainingGoalsController = new CoachTrainingGoalsController(coachTrainingGoalsStore);

export { clientsController, coachWorkoutsController, coachExercisesController, coachPlansController, coachTrainingGoalsController };

