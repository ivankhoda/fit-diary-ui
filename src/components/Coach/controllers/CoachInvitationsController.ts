import { action } from 'mobx';
import { toast } from 'react-toastify';

import { BaseController } from '../../../controllers/BaseController';
import getApiBaseUrl from '../../../utils/apiUrl';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Post from '../../../utils/PostRequest';
import CoachInvitationsStore, { CoachClientInvitation } from '../store/coachInvitationsStore';

type CoachInvitationsListResponse = {
    invitations?: CoachClientInvitation[];
    ok?: boolean;
};

type CoachInvitationResponse = {
    invitation?: CoachClientInvitation;
    ok?: boolean;
    queued?: boolean;
};

const EMPTY_MESSAGE = '';

const isCoachClientInvitation = (
    payload: CoachInvitationResponse | CoachClientInvitation,
): payload is CoachClientInvitation => (
    'accepted_at' in payload && 'status' in payload && 'token' in payload
);

const normalizeInvitation = (payload: CoachInvitationResponse | CoachClientInvitation): CoachClientInvitation | null => {
    if (isCoachClientInvitation(payload)) {
        return payload;
    }

    return payload.invitation ?? null;
};

export default class CoachInvitationsController extends BaseController {
    coachInvitationsStore: CoachInvitationsStore;

    constructor(coachInvitationsStore: CoachInvitationsStore) {
        super();
        this.coachInvitationsStore = coachInvitationsStore;
    }

    @action
    async fetchInvitations(): Promise<void> {
        try {
            const response = await new Get({
                url: `${getApiBaseUrl()}/coach/client_invitations`
            }).execute();
            const data = await response.json() as CoachInvitationsListResponse;

            if (response.ok) {
                this.coachInvitationsStore.setInvitations(data.invitations ?? []);
                return;
            }

            toast.error('Не удалось получить ссылки-приглашения');
        } catch {
            toast.error('Не удалось получить ссылки-приглашения');
        }
    }

    @action
    async createInvitation(message?: string): Promise<CoachClientInvitation | null> {
        try {
            const response = await new Post({
                params: { message: message?.trim() ?? EMPTY_MESSAGE },
                url: `${getApiBaseUrl()}/coach/client_invitations`
            }).execute();
            const data = await response.json() as CoachInvitationResponse;

            if (!response.ok) {
                toast.error('Не удалось создать ссылку-приглашение');
                return null;
            }

            const invitation = normalizeInvitation(data);

            if (!invitation) {
                toast.error('Не удалось создать ссылку-приглашение');
                return null;
            }

            this.coachInvitationsStore.upsertInvitation(invitation);
            return invitation;
        } catch {
            toast.error('Не удалось создать ссылку-приглашение');
            return null;
        }
    }

    @action
    async resendInvitation(invitationId: number): Promise<CoachClientInvitation | null> {
        try {
            const response = await new Post({
                url: `${getApiBaseUrl()}/coach/client_invitations/${invitationId}/resend`
            }).execute();
            const data = await response.json() as CoachInvitationResponse;

            if (!response.ok) {
                toast.error('Не удалось перевыпустить ссылку');
                return null;
            }

            const invitation = normalizeInvitation(data);

            if (!invitation) {
                toast.error('Не удалось перевыпустить ссылку');
                return null;
            }

            this.coachInvitationsStore.upsertInvitation(invitation);
            return invitation;
        } catch {
            toast.error('Не удалось перевыпустить ссылку');
            return null;
        }
    }

    @action
    async cancelInvitation(invitationId: number): Promise<boolean> {
        try {
            const response = await new Delete({
                url: `${getApiBaseUrl()}/coach/client_invitations/${invitationId}`
            }).execute();

            if (!response.ok) {
                toast.error('Не удалось отменить приглашение');
                return false;
            }

            this.coachInvitationsStore.removeInvitation(invitationId);
            return true;
        } catch {
            toast.error('Не удалось отменить приглашение');
            return false;
        }
    }
}
