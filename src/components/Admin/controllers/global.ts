import { adminExercisesStore, adminUsersStore, adminWorkoutsStore } from '../store/global';
import AdminExercisesController from './AdminExercisesController';
import AdminUsersController from './AdminUsersController';
import AdminWorkoutsController from './AdminWorkoutsController';

const adminUsersController = new AdminUsersController(adminUsersStore);
const adminExercisesController = new AdminExercisesController(adminExercisesStore);
const adminWorkoutsController = new AdminWorkoutsController(adminWorkoutsStore);

export { adminUsersController, adminExercisesController, adminWorkoutsController };

