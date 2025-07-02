import { clientsStore, coachExercisesStore, coachWorkoutsStore } from '../store/global';
import ClientsController from './ClientsController';
import CoachExercisesController from './CoachExercisesController';
import CoachWorkoutController from './CoachWorkoutsController';

const clientsController = new ClientsController(clientsStore);
const coachWorkoutsController = new CoachWorkoutController(coachWorkoutsStore);
const coachExercisesController = new CoachExercisesController(coachExercisesStore, coachWorkoutsStore);

export { clientsController, coachWorkoutsController, coachExercisesController };

