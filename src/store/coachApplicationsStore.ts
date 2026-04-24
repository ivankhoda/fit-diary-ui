import { action, makeObservable, observable } from 'mobx';

export type CoachApplicationStatus = 'approved' | 'pending' | 'rejected';

export type CoachApplicationFilter = CoachApplicationStatus | 'all';

export interface CoachApplicationUser {
    email: string;
    first_name: string | null;
    id: number;
    last_name: string | null;
    username: string | null;
}

export interface CoachApplicationReviewer {
    email: string;
    first_name: string | null;
    id: number;
    last_name: string | null;
    username: string | null;
}

export interface CoachApplication {
    approved_at: string | null;
    contacts: string | null;
    created_at: string;
    experience: string | null;
    id: number;
    message: string;
    rejection_reason: string | null;
    rejected_at: string | null;
    reviewed_at: string | null;
    reviewed_by?: CoachApplicationReviewer | null;
    specialization: string | null;
    status: CoachApplicationStatus;
    updated_at: string;
    user?: CoachApplicationUser;
}

export default class CoachApplicationsStore {
    constructor() {
        makeObservable(this);
    }

    @observable currentApplication: CoachApplication | null = null;

    @observable history: CoachApplication[] = [];

    @action
    setCurrentApplication(application: CoachApplication | null): void {
        this.currentApplication = application;
    }

    @action
    setHistory(applications: CoachApplication[]): void {
        this.history = applications;
    }

    @action
    upsertHistory(application: CoachApplication): void {
        const nextApplications = this.history.filter(existingApplication => existingApplication.id !== application.id);

        this.history = [application, ...nextApplications];
    }

    @action
    clear(): void {
        this.currentApplication = null;
        this.history = [];
    }
}
