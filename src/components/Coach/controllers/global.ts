import { clientsStore, coachWorkoutsStore } from '../store/global';
import ClientsController from './ClientsController';
import CoachWorkoutController from './CoachWorkoutsController';

const clientsController = new ClientsController(clientsStore);
const coachWorkoutsController = new CoachWorkoutController(coachWorkoutsStore);
export { clientsController, coachWorkoutsController };

