import { action, makeObservable, observable } from 'mobx';

export type CoachInvitationStatus = 'accepted' | 'canceled' | 'declined' | 'expired' | 'pending';

export interface CoachInvitationPerson {
    email?: string;
    id: number;
    name?: string;
}

export interface CoachClientInvitation {
    accepted_at: string | null;
    canceled_at: string | null;
    coach: CoachInvitationPerson;
    created_at: string;
    declined_at: string | null;
    expires_at: string;
    id: number;
    invitee: CoachInvitationPerson | null;
    invitee_user_id: number | null;
    message: string | null;
    pending_actionable: boolean;
    requires_registration: boolean;
    share_url: string;
    status: CoachInvitationStatus;
    token: string;
    updated_at: string;
}

export default class CoachInvitationsStore {
    constructor() {
        makeObservable(this);
    }

    @observable invitations: CoachClientInvitation[] = [];

    @action
    setInvitations(invitations: CoachClientInvitation[]): void {
        this.invitations = invitations;
    }

    @action
    upsertInvitation(invitation: CoachClientInvitation): void {
        const nextInvitations = this.invitations.filter(existingInvitation => existingInvitation.id !== invitation.id);

        this.invitations = [invitation, ...nextInvitations];
    }

    @action
    removeInvitation(invitationId: number): void {
        this.invitations = this.invitations.filter(invitation => invitation.id !== invitationId);
    }
}