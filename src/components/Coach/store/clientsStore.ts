
import { action, computed, makeObservable, observable } from 'mobx';
import  UserInterface  from '../../../store/userStore';
import { PlanInterface } from '../../../store/plansStore';

export interface CoachAssignedPlanPreview {
    assigned_at?: string | null;
    end_date: string | null;
    id: number;
    name: string;
    start_date: string | null;
    training_goal_id?: number | null;
}

export interface OverviewActivity {
    tone: 'good' | 'idle' | 'risk';
    label: string;
    description: string;
}

export interface OverviewPrimaryAction {
    label: string;
    value: string;
    note: string;
}

export interface OverviewMetric {
    label: string;
    value: string;
    note: string;
}

export interface OverviewSignal {
    label: string;
    value: string;
}

export interface OverviewBlock {
    contacts: string[];
    activity: OverviewActivity;
    primary_action: OverviewPrimaryAction;
    metrics: OverviewMetric[];
    signals: OverviewSignal[];
}

import { TrainingGoalInterface } from '../../../store/trainingGoalsStore';

export interface ClientInterface extends UserInterface {
    id: number;
    email: string;
    goal_summary?: string;
    last_check_in_at?: string;
    name?: string;
    phone_number?: string;
    telegram_username?: string;
    joined_at?: string;
    invited?: boolean;
    lastActive?: string;
    updatedAt?: string;
    createdAt?: string;
    plan: PlanInterface;
    planTitle?: string;
    completedWorkouts?: number;
    totalWorkouts?: number;
    lastWorkoutDate?: string;
    nextWorkoutDate?: string;
    assigned_plans_by_coach?: CoachAssignedPlanPreview[];
    overview?: OverviewBlock;
    progress_percentage?: number;
    goals_summary?: TrainingGoalInterface[];
}

export default class ClientsStore {
    constructor() {
        makeObservable(this);
    }

    @observable clients: ClientInterface[] = [];
    @observable invitedClients: string[] = [];

    @computed
    get sortedClients(): ClientInterface[] {
        return [...this.clients].sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));
    }

    @action
    setClients(clients: ClientInterface[]): void {
        this.clients = clients;
    }

    @action
    addClient(client: ClientInterface): void {
        const exists = this.clients.some(c => c.id === client.id);

        if (!exists) {
            this.clients = [...this.clients, client];
        }
    }

    @action
    upsertClient(client: ClientInterface): void {
        const clientIndex = this.clients.findIndex(existingClient => existingClient.id === client.id);

        if (clientIndex < 0) {
            this.clients = [...this.clients, client];
            return;
        }

        this.clients = this.clients.map(existingClient => (
            existingClient.id === client.id ? client : existingClient
        ));
    }

    @action
    removeClient(clientId: number): void {
        this.clients = this.clients.filter(c => c.id !== clientId);
    }

    @action
    addInvitedClient(email: string): void {
        this.invitedClients = [...this.invitedClients, email];
    }

    @action
    removeInvitedClient(email: string): void {
        this.invitedClients = this.invitedClients.filter(e => e !== email);
    }
}
