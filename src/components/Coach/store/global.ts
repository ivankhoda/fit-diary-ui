import ClientsStore from './clientsStore';
import CoachExercisesStore from './CoachExercisesStore';
import CoachPlansStore from './CoachPlansStore';
import CoachTrainingGoalsStore from './CoachTrainingGoalsStore';
import CoachWorkoutsStore from './CoachWorkoutsStore';

const clientsStore = new ClientsStore();
const coachWorkoutsStore = new CoachWorkoutsStore();
const coachExercisesStore = new CoachExercisesStore();
const coachPlansStore = new CoachPlansStore();
const coachTrainingGoalsStore = new CoachTrainingGoalsStore();

export { clientsStore, coachWorkoutsStore, coachExercisesStore, coachPlansStore, coachTrainingGoalsStore};

