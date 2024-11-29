
import AdminExercisesStore from './AdminExercisesStore';
import AdminUserStore from './AdminUsersStore';
import AdminWorkoutsStore from './AdminWorkoutsStore';

const adminUsersStore = new AdminUserStore();
const adminExercisesStore = new AdminExercisesStore();
const adminWorkoutsStore = new AdminWorkoutsStore();

export { adminUsersStore, adminExercisesStore, adminWorkoutsStore};


