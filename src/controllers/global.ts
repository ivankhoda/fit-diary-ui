import { exercisesStore, userStore, workoutsStore } from '../store/global';
import ExercisesController from './ExercisesController';
import UserController from './UserController';
import WorkoutController from './WorkoutsController';

const exercisesController = new ExercisesController(exercisesStore, workoutsStore);
const workoutsController = new WorkoutController(workoutsStore, exercisesStore);
const userController = new UserController(userStore);

export { exercisesController, workoutsController, userController};

