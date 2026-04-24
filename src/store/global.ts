import ExercisesStore from './exercisesStore';
import WorkoutsStore from './workoutStore';
import UserStore from './userStore';
import TrainingGoalsStore from './trainingGoalsStore';
import PlansStore from './plansStore';
import CoachApplicationsStore from './coachApplicationsStore';

const exercisesStore = new ExercisesStore();
const workoutsStore = new WorkoutsStore();
const userStore = new UserStore();
const trainingGoalsStore = new TrainingGoalsStore();
const plansStore = new PlansStore();
const coachApplicationsStore = new CoachApplicationsStore();

export { exercisesStore, workoutsStore, userStore, trainingGoalsStore, plansStore, coachApplicationsStore };

