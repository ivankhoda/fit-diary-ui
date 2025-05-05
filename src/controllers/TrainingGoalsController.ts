import { action } from 'mobx';
import TrainingGoalsStore, { TrainingGoalInterface, MilestoneInterface } from '../store/trainingGoalsStore';
import Delete from '../utils/DeleteRequest';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import getApiBaseUrl from '../utils/apiUrl';

export interface TrainingGoalFormData extends TrainingGoalInterface {
    user_id: number;
    goal_category: string;
    goal_type: string;
    target_value: number;
    current_value: number;
    exercise_id?: number | null;
    deadline: string;
    comment?: string;
    parent_goal_id?: number | null;
}

export default class TrainingGoalsController extends BaseController {
    trainingGoalsStore: TrainingGoalsStore;

    constructor(trainingGoalsStore: TrainingGoalsStore) {
        super();
        this.trainingGoalsStore = trainingGoalsStore;
    }

    @action
    getGoals(): void {
        new Get({
            params: {  },
            url: `${getApiBaseUrl()}/training_goals`
        }).execute()
            .then(r => r.json())
            .then(res => {
                this.trainingGoalsStore.setGoals(res);
            })
            .catch(error => {
                console.error('Failed to fetch goals:', error);
            });
    }

    @action
    getGoalDetails(goalId: number): void {
        new Get({
            url: `${getApiBaseUrl()}/training_goals/${goalId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok){
                    this.trainingGoalsStore.setCurrentGoal(res.goal);
                }
            })
            .catch(error => {
                console.error('Failed to fetch goal details:', error);
            });
    }

    @action
    createGoal(goalData: TrainingGoalInterface): Promise<TrainingGoalInterface | null> {
        return new Promise((resolve, reject) => {
            try {
                new Post({
                    params: { training_goal: goalData },
                    url: `${getApiBaseUrl()}/training_goals`
                }).execute()
                    .then(r => r.json())
                    .then(res => {
                        if (res.ok) {
                            this.trainingGoalsStore.addGoal(res);
                            resolve(res);
                        } else {
                            reject(res.error);
                        }
                    })
                    .catch(error => {
                        console.error('Failed to create goal:', error);
                        reject(error);
                    });
            } catch (error) {
                console.error('Error in createGoal:', error);
                reject(error);
            }
        });
    }

    @action
    updateGoal(goalId: number, goalData: Partial<TrainingGoalFormData>): void {
        new Patch({
            params: { training_goal: goalData },
            url: `${getApiBaseUrl()}/training_goals/${goalId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.trainingGoalsStore.updateGoal(res.goal);
                }
            })
            .catch(error => {
                console.error('Failed to update goal:', error);
            });
    }

    @action
    deleteGoal(goalId: number): void {
        new Delete({
            url: `${getApiBaseUrl()}/training_goals/${goalId}`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.trainingGoalsStore.deleteGoal(goalId);
                }
            })
            .catch(error => {
                console.error('Failed to delete goal:', error);
            });
    }

    @action
    completeGoal(goalId: number): void {
        new Patch({
            params: { training_goal: { completed_at: new Date().toISOString(), is_completed: true, } },
            url: `${getApiBaseUrl()}/training_goals/${goalId}/complete`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.trainingGoalsStore.updateGoal(res);
                }
            })
            .catch(error => {
                console.error('Failed to complete goal:', error);
            });
    }

    // ==================== Milestones Management ====================
    @action
    createMilestone(goalId: number, milestoneData: Omit<MilestoneInterface, 'id'>): void {
        new Post({
            params: { milestone: milestoneData },
            url: `${getApiBaseUrl()}/training_goals/${goalId}/milestones`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.trainingGoalsStore.addMilestone(res);
                }
            })
            .catch(error => {
                console.error('Failed to create milestone:', error);
            });
    }

    @action
    completeMilestone(milestoneId: number): void {
        new Patch({
            params: { milestone: { is_completed: true } },
            url: `${getApiBaseUrl()}/milestones/${milestoneId}/complete`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.trainingGoalsStore.completeMilestone(milestoneId);
                }
            })
            .catch(error => {
                console.error('Failed to complete milestone:', error);
            });
    }

    @action
    updateGoalProgress(goalId: number, newValue: number): void {
        new Patch({
            params: { training_goal: { current_value: newValue } },
            url: `${getApiBaseUrl()}/training_goals/${goalId}/update_progress`
        }).execute()
            .then(r => r.json())
            .then(res => {
                if (res.ok) {
                    this.trainingGoalsStore.updateGoal(res);
                }
            })
            .catch(error => {
                console.error('Failed to update goal progress:', error);
            });
    }

    // ==================== Filtering ====================
    @action
    filterGoalsByCategory(category: string): void {
        this.trainingGoalsStore.filterGoalsByCategory(category);
    }
}
