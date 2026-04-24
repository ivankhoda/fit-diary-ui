import { coachApplicationsStore, exercisesStore, plansStore, trainingGoalsStore, userStore, workoutsStore } from '../store/global';
import CoachApplicationsController from './CoachApplicationsController';
import ExercisesController from './ExercisesController';
import PlansController from './PlansController';
import TrainingGoalsController from './TrainingGoalsController';
import UserController from './UserController';
import WorkoutController from './WorkoutsController';

const exercisesController = new ExercisesController(exercisesStore, workoutsStore);
const coachApplicationsController = new CoachApplicationsController(coachApplicationsStore);
const userController = new UserController(userStore, coachApplicationsStore);
const workoutsController = new WorkoutController(
    workoutsStore,
    exercisesStore,
    () => userController.scheduleExerciseStatsRefresh(),
);
const trainingGoalsController = new TrainingGoalsController(trainingGoalsStore);
const plansController = new PlansController(plansStore);

export {
    coachApplicationsController,
    exercisesController,
    workoutsController,
    userController,
    trainingGoalsController,
    plansController,
};

