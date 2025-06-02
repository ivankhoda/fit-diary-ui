import ExercisesStore from './exercisesStore';
import WorkoutsStore from './workoutStore';
import UserStore from './userStore';
import TrainingGoalsStore from './trainingGoalsStore';
import PlansStore from './plansStore';

const exercisesStore = new ExercisesStore();
const workoutsStore = new WorkoutsStore();
const userStore = new UserStore();
const trainingGoalsStore = new TrainingGoalsStore();
const plansStore = new PlansStore();

export { exercisesStore, workoutsStore, userStore, trainingGoalsStore, plansStore };

