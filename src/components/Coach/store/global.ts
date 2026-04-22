import ClientsStore from './clientsStore';
import CoachExercisesStore from './CoachExercisesStore';
import CoachInvitationsStore from './coachInvitationsStore';
import CoachPlansStore from './CoachPlansStore';
import CoachTrainingGoalsStore from './CoachTrainingGoalsStore';
import CoachWorkoutsStore from './CoachWorkoutsStore';

const clientsStore = new ClientsStore();
const coachInvitationsStore = new CoachInvitationsStore();
const coachWorkoutsStore = new CoachWorkoutsStore();
const coachExercisesStore = new CoachExercisesStore();
const coachPlansStore = new CoachPlansStore();
const coachTrainingGoalsStore = new CoachTrainingGoalsStore();

export { clientsStore, coachInvitationsStore, coachWorkoutsStore, coachExercisesStore, coachPlansStore, coachTrainingGoalsStore};

