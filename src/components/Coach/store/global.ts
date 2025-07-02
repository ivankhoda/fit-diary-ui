import ClientsStore from './clientsStore';
import CoachExercisesStore from './CoachExercisesStore';
import CoachWorkoutsStore from './CoachWorkoutsStore';

const clientsStore = new ClientsStore();
const coachWorkoutsStore = new CoachWorkoutsStore();
const coachExercisesStore = new CoachExercisesStore();

export { clientsStore, coachWorkoutsStore, coachExercisesStore};

