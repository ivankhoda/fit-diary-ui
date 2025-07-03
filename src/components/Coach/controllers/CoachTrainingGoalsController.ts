import { action } from 'mobx';
import CoachTrainingGoalsStore, { TrainingGoalInterface, MilestoneInterface } from '../store/CoachTrainingGoalsStore';
import { BaseController } from '../../../controllers/BaseController';
import getApiBaseUrl from '../../../utils/apiUrl';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Patch from '../../../utils/PatchRequest';
import Post from '../../../utils/PostRequest';

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

export default class CoachTrainingGoalsController extends BaseController {
    coachTrainingGoalsStore: CoachTrainingGoalsStore;

    constructor(coachTrainingGoalsStore: CoachTrainingGoalsStore) {
        super();
        this.coachTrainingGoalsStore = coachTrainingGoalsStore;
    }

    @action
    getGoals(): void {
        new Get({
            params: {  },
            url: `${getApiBaseUrl()}/training_goals`
        }).execute()
            .then(r => r.json())
            .then(res => {
                this.coachTrainingGoalsStore.setGoals(res);
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
                    this.coachTrainingGoalsStore.setCurrentGoal(res.goal);
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
                            this.coachTrainingGoalsStore.addGoal(res.goal);
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
                    this.coachTrainingGoalsStore.updateGoal(res.goal);
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
                    this.coachTrainingGoalsStore.deleteGoal(goalId);
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
                    this.coachTrainingGoalsStore.updateGoal(res);
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
                    this.coachTrainingGoalsStore.addMilestone(res);
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
                    this.coachTrainingGoalsStore.completeMilestone(milestoneId);
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
                    this.coachTrainingGoalsStore.updateGoal(res);
                }
            })
            .catch(error => {
                console.error('Failed to update goal progress:', error);
            });
    }

    // ==================== Filtering ====================
    @action
    filterGoalsByCategory(category: string): void {
        this.coachTrainingGoalsStore.filterGoalsByCategory(category);
    }
}
