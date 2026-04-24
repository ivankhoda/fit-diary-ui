import { action, makeObservable, observable } from 'mobx';

import {
    CoachApplication,
    CoachApplicationFilter,
} from '../../../store/coachApplicationsStore';

export default class AdminCoachApplicationsStore {
    constructor() {
        makeObservable(this);
    }

    @observable application: CoachApplication | null = null;

    @observable applications: CoachApplication[] = [];

    @observable filter: CoachApplicationFilter = 'pending';

    @action
    removeApplication(applicationId: number): void {
        this.applications = this.applications.filter(application => application.id !== applicationId);
    }

    @action
    setApplication(application: CoachApplication | null): void {
        this.application = application;
    }

    @action
    setApplications(applications: CoachApplication[]): void {
        this.applications = applications;
    }

    @action
    setFilter(filter: CoachApplicationFilter): void {
        this.filter = filter;
    }

    @action
    upsertApplication(application: CoachApplication): void {
        const nextApplications = this.applications.filter(existingApplication => existingApplication.id !== application.id);

        this.applications = [application, ...nextApplications];

        if (this.application?.id === application.id) {
            this.application = application;
        }
    }
}
