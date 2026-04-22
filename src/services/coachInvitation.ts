const COACH_INVITATION_STORAGE_KEY = 'coach_invitation_token';
const COACH_INVITATION_AUTO_ACCEPT_PARAM = 'auto_accept';
const COACH_INVITATION_AUTO_ACCEPT_VALUE = '1';

type CoachInvitationPathOptions = {
    autoAccept?: boolean;
};

export const buildCoachInvitationPath = (token: string, options?: CoachInvitationPathOptions): string => {
    const searchParams = new URLSearchParams();

    if (options?.autoAccept) {
        searchParams.set(COACH_INVITATION_AUTO_ACCEPT_PARAM, COACH_INVITATION_AUTO_ACCEPT_VALUE);
    }

    const queryString = searchParams.toString();

    if (!queryString) {
        return `/coach-invitations/${encodeURIComponent(token)}`;
    }

    return `/coach-invitations/${encodeURIComponent(token)}?${queryString}`;
};

export const buildCoachInvitationUrl = (token: string, options?: CoachInvitationPathOptions): string => (
    `${window.location.origin}${buildCoachInvitationPath(token, options)}`
);

export const resolveCoachInvitationToken = (search: string): string | null =>
    new URLSearchParams(search).get('invite_token') || getCoachInvitationToken();

export const shouldAutoAcceptCoachInvitation = (search: string): boolean => (
    new URLSearchParams(search).get(COACH_INVITATION_AUTO_ACCEPT_PARAM) === COACH_INVITATION_AUTO_ACCEPT_VALUE
);

export const createCoachInvitationShareText = (message: string, invitationUrl: string): string => {
    if (!message.trim()) {
        return invitationUrl;
    }

    return `${message.trim()}\n${invitationUrl}`;
};

export const saveCoachInvitationToken = (token: string): void => {
    window.localStorage.setItem(COACH_INVITATION_STORAGE_KEY, token);
};

export const getCoachInvitationToken = (): string | null => window.localStorage.getItem(COACH_INVITATION_STORAGE_KEY);

export const clearCoachInvitationToken = (): void => {
    window.localStorage.removeItem(COACH_INVITATION_STORAGE_KEY);
};
