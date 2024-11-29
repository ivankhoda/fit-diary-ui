import ExercisesStore from './exercisesStore';
import WorkoutsStore from './workoutStore';
import UserStore from './userStore';


const exercisesStore = new ExercisesStore();
const workoutsStore = new WorkoutsStore();
const userStore = new UserStore();

export { exercisesStore, workoutsStore, userStore };


