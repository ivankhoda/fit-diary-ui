
import AdminExercisesStore from './AdminExercisesStore';
import AdminCoachApplicationsStore from './AdminCoachApplicationsStore';
import AdminUserStore from './AdminUsersStore';
import AdminWorkoutsStore from './AdminWorkoutsStore';

const adminUsersStore = new AdminUserStore();
const adminExercisesStore = new AdminExercisesStore();
const adminWorkoutsStore = new AdminWorkoutsStore();
const adminCoachApplicationsStore = new AdminCoachApplicationsStore();

export { adminUsersStore, adminExercisesStore, adminWorkoutsStore, adminCoachApplicationsStore};

