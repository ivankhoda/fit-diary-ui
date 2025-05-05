import { exercisesStore, trainingGoalsStore, userStore, workoutsStore } from '../store/global';
import ExercisesController from './ExercisesController';
import TrainingGoalsController from './TrainingGoalsController';
import UserController from './UserController';
import WorkoutController from './WorkoutsController';

const exercisesController = new ExercisesController(exercisesStore, workoutsStore);
const workoutsController = new WorkoutController(workoutsStore, exercisesStore);
const userController = new UserController(userStore);
const trainingGoalsController = new TrainingGoalsController(trainingGoalsStore);

export { exercisesController, workoutsController, userController, trainingGoalsController};

