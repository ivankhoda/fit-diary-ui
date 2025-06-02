import { action, computed, makeObservable, observable } from 'mobx';

export interface TrainingGoalInterface {
    id?: number;
    uuid?: string;
    user_id?: number;
    name?: string;
    goal_category?: string;
    goal_type?: string;
    target_value: number;
    current_value: number;
    exercise_id?: number | null;
    exercise_name?: string;
    deadline: string;
    comment?: string;
    parent_goal_id?: number | null;
    progress_percentage?: number;
    created_at?: string;
    updated_at?: string;
    is_completed?: boolean;
    completed_at?: string | null;
    sub_goals?: MilestoneInterface[];
}

export interface MilestoneInterface extends TrainingGoalInterface {
    parent_goal_id: number;
}

export default class TrainingGoalsStore {
    constructor() {
        makeObservable(this);
    }

    @observable goals: TrainingGoalInterface[] = [];

    @observable currentGoal: TrainingGoalInterface | null = null;

    @observable goalMilestones: MilestoneInterface[] = [];

    @observable filteredGoals: TrainingGoalInterface[] = [];

    @observable goalCategories: string[] = [];

    @observable goalTypes: string[] = [];

    @computed
    get activeGoals(): TrainingGoalInterface[] {
        return this.goals.filter(goal => !goal.is_completed);
    }

    @computed
    get completedGoals(): TrainingGoalInterface[] {
        return this.goals.filter(goal => goal.is_completed);
    }

    @action
    setGoals(goals: TrainingGoalInterface[]): void {
        this.goals = goals;
        this.updateDerivedData();
    }

    @action
    setGoalsCategories(goalCategories: string[]): void {
        this.goalCategories = goalCategories;
    }

    @action
    setGoalsTypes(goalTypes: string[]): void {
        this.goalTypes = goalTypes;
    }

    @action
    addGoal(goal: TrainingGoalInterface): void {
        this.goals = [...this.goals, goal];
        this.updateDerivedData();
    }

    @action
    updateGoal(updatedGoal: TrainingGoalInterface): void {
        const clonedGoal = { ...updatedGoal };

        this.goals = this.goals.map(goal => goal.id === clonedGoal.id ? clonedGoal : goal);
    }

    @action
    deleteGoal(id: number): void {
        this.goals = this.goals.filter(goal => goal.id !== id);
        this.updateDerivedData();
    }

    @action
    setCurrentGoal(goal: TrainingGoalInterface | null): void {
        this.currentGoal = goal;
    }

    @action
    setGoalMilestones(milestones: MilestoneInterface[]): void {
        this.goalMilestones = milestones;
    }

    @action
    addMilestone(milestone: MilestoneInterface): void {
        this.goalMilestones = [...this.goalMilestones, milestone];
    }

    @action
    completeMilestone(id: number): void {
        this.goalMilestones = this.goalMilestones.map(milestone =>
            milestone.id === id ? {...milestone, is_completed: true} : milestone);
    }

    @action
    setFilteredGoals(goals: TrainingGoalInterface[]): void {
        this.filteredGoals = goals;
    }

    @action
    filterGoalsByCategory(category: string): void {
        this.filteredGoals = this.goals.filter(goal => goal.goal_category === category);
    }

    @action
    private updateDerivedData(): void {
        /*
         * This.activeGoals = this.goals.filter(goal => !goal.is_completed);
         * this.completedGoals = this.goals.filter(goal => goal.is_completed);
         */

        this.goals = this.goals.map(goal => ({
            ...goal,
            progress_percentage: goal.progress_percentage
        }));
    }

    private calculateProgressPercentage(goal: TrainingGoalInterface): number {
        if (goal.current_value === goal.target_value) {return 100;}

        if (goal.goal_type === 'time_improvement') {
            const totalImprovement = goal.current_value - goal.target_value;
            const currentImprovement = goal.current_value - (goal.current_value);
            return Math.min(100, Math.round((currentImprovement / totalImprovement) * 100));
        }

        return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
    }

    @action
    clearGoalForm(): void {
        this.currentGoal = null;
    }
}
