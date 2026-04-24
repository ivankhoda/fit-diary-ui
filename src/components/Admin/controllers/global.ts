import { adminCoachApplicationsStore, adminExercisesStore, adminUsersStore, adminWorkoutsStore } from '../store/global';
import AdminCoachApplicationsController from './AdminCoachApplicationsController';
import AdminExercisesController from './AdminExercisesController';
import AdminUsersController from './AdminUsersController';
import AdminWorkoutsController from './AdminWorkoutsController';

const adminUsersController = new AdminUsersController(adminUsersStore);
const adminExercisesController = new AdminExercisesController(adminExercisesStore);
const adminWorkoutsController = new AdminWorkoutsController(adminWorkoutsStore);
const adminCoachApplicationsController = new AdminCoachApplicationsController(adminCoachApplicationsStore);

export { adminUsersController, adminExercisesController, adminWorkoutsController, adminCoachApplicationsController };

