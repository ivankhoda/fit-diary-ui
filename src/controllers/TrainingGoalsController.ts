import { action } from 'mobx';
import TrainingGoalsStore, { TrainingGoalInterface, MilestoneInterface } from '../store/trainingGoalsStore';
import Delete from '../utils/DeleteRequest';
import Get from '../utils/GetRequest';
import Patch from '../utils/PatchRequest';
import Post from '../utils/PostRequest';
import { BaseController } from './BaseController';
import getApiBaseUrl from '../utils/apiUrl';
import { NOT_CHANGE_RESPONSE_CODE } from '../components/Common/constants';
import { cacheService } from '../services/cacheService';

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
    async getGoals(): Promise<void> {
        const cacheKey = 'training_goals';
        const cachedEtag = await cacheService.getVersion(cacheKey);

        const response = await new Get({
            configurator: {
                headers: cachedEtag ? { 'If-None-Match': cachedEtag } : {}
            },
            url: `${getApiBaseUrl()}/training_goals`,

        }).execute();

        if (response.status === NOT_CHANGE_RESPONSE_CODE) {
            const cached = await cacheService.get<TrainingGoalInterface[]>(cacheKey);

            if (cached) {
                this.trainingGoalsStore.setGoals(cached);
                return;
            }
        }

        const json = await response.json();
        const etag = response.headers.get('etag');

        await cacheService.set(cacheKey, json.goals, etag);

        this.trainingGoalsStore.setGoals(json.goals);
    }

@action
    async getGoalDetails(goalId: number): Promise<void> {
        const cacheKey = `training_goal_${goalId}`;
        const cachedEtag = await cacheService.getVersion(cacheKey);

        const response = await new Get({
            configurator: {
                headers: cachedEtag ? { 'If-None-Match': cachedEtag } : {}
            },
            url: `${getApiBaseUrl()}/training_goals/${goalId}`,

        }).execute();

        if (response.status === NOT_CHANGE_RESPONSE_CODE) {
            const cached = await cacheService.get<TrainingGoalInterface>(cacheKey);

            if (cached) {
                this.trainingGoalsStore.setCurrentGoal(cached);
                return;
            }
        }

        const json = await response.json();
        const etag = response.headers.get('etag');

        await cacheService.set(cacheKey, json.goal, etag);

        this.trainingGoalsStore.setCurrentGoal(json.goal);
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
                        this.trainingGoalsStore.addGoal(res.goal);
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
