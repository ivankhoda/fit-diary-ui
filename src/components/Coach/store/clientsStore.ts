
import { action, computed, makeObservable, observable } from 'mobx';

export interface ClientInterface {
    id: number;
    email: string;
    name?: string;
    joined_at?: string;
    invited?: boolean;
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
