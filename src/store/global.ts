import ExercisesStore from './exercisesStore';
import WorkoutsStore from './workoutStore';
import UserStore from './userStore';
import TrainingGoalsStore from './trainingGoalsStore';

const exercisesStore = new ExercisesStore();
const workoutsStore = new WorkoutsStore();
const userStore = new UserStore();
const trainingGoalsStore = new TrainingGoalsStore();

export { exercisesStore, workoutsStore, userStore, trainingGoalsStore };

