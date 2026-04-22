import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { formatDate } from '../../../Common/date/formatDate';
import { coachInvitationsController } from '../../controllers/global';
import { CoachClientInvitation } from '../../store/coachInvitationsStore';
import { coachInvitationsStore } from '../../store/global';
import { buildCoachInvitationUrl, createCoachInvitationShareText } from '../../../../services/coachInvitation';
import './InvitationList.scss';

const copyInvitationLink = async(invitationUrl: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(invitationUrl);
        return true;
    } catch {
        return false;
    }
};

const shareInvitationLink = async(invitationUrl: string, message: string | null): Promise<boolean> => {
    if (!navigator.share) {
        return false;
    }

    try {
        await navigator.share({
            text: createCoachInvitationShareText(message ?? '', invitationUrl),
            title: 'Приглашение в Planka',
            url: invitationUrl,
        });
        return true;
    } catch {
        return false;
    }
};

type InvitationCardProps = {
    invitation: CoachClientInvitation;
    isCanceling: boolean;
    isResending: boolean;
    onCancel: (invitationId: number) => Promise<void>;
    onCopy: (invitation: CoachClientInvitation) => Promise<void>;
    onResend: (invitationId: number) => Promise<void>;
    onShare: (invitation: CoachClientInvitation) => Promise<void>;
};

const InvitationCard = ({
    invitation,
    isCanceling,
    isResending,
    onCancel,
    onCopy,
    onResend,
    onShare,
}: InvitationCardProps): JSX.Element => {
    const handleCopy = useCallback(() => {
        onCopy(invitation).catch(() => null);
    }, [invitation, onCopy]);

    const handleShare = useCallback(() => {
        onShare(invitation).catch(() => null);
    }, [invitation, onShare]);

    const handleResend = useCallback(() => {
        onResend(invitation.id).catch(() => null);
    }, [invitation.id, onResend]);

    const handleCancel = useCallback(() => {
        onCancel(invitation.id).catch(() => null);
    }, [invitation.id, onCancel]);

    return (
        <article className={`invitation-card ${isCanceling ? 'is-canceling' : ''}`}>
            <div className="invitation-card__header">
                <h4 className="invitation-card__title">Ссылка #{invitation.id}</h4>
                <span className="invitation-card__status">{invitation.status}</span>
            </div>

            <p className="invitation-card__message">{invitation.message || 'Без сообщения'}</p>
            <p className="invitation-card__meta">Истекает: {formatDate(invitation.expires_at)}</p>
            <p className="invitation-card__link">{buildCoachInvitationUrl(invitation.token)}</p>

            <div className="invitation-card__actions">
                <button className="invitation-card__button" onClick={handleCopy}>Скопировать</button>
                <button className="invitation-card__button" onClick={handleShare}>Поделиться</button>
                <button className="invitation-card__button" onClick={handleResend} disabled={isResending}>
                    {isResending ? 'Обновляем...' : 'Переотправить'}
                </button>
                <button className="invitation-card__button invitation-card__button--danger" onClick={handleCancel} disabled={isCanceling}>
                    {isCanceling ? 'Отменяем...' : 'Отменить'}
                </button>
            </div>
        </article>
    );
};

const InvitationList = (): JSX.Element => {
    const [cancelingIds, setCancelingIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resendingIds, setResendingIds] = useState<number[]>([]);

    const loadInvitations = useCallback(async() => {
        setIsLoading(true);
        await coachInvitationsController.fetchInvitations();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadInvitations().catch(() => null);
    }, [loadInvitations]);

    const invitations = useMemo(() => coachInvitationsStore.invitations, [coachInvitationsStore.invitations]);

    const handleCopy = useCallback(async(invitation: CoachClientInvitation) => {
        const copied = await copyInvitationLink(buildCoachInvitationUrl(invitation.token));

        if (copied) {
            toast.success('Ссылка скопирована');
            return;
        }

        toast.error('Не удалось скопировать ссылку');
    }, []);

    const handleShare = useCallback(async(invitation: CoachClientInvitation) => {
        const invitationUrl = buildCoachInvitationUrl(invitation.token);
        const shared = await shareInvitationLink(invitationUrl, invitation.message);

        if (shared) {
            return;
        }

        const copied = await copyInvitationLink(invitationUrl);

        if (copied) {
            toast.success('Ссылка скопирована в буфер обмена');
            return;
        }

        toast.error('Не удалось поделиться ссылкой');
    }, []);

    const handleResend = useCallback(async(invitationId: number) => {
        setResendingIds(previousIds => [...previousIds, invitationId]);

        const updatedInvitation = await coachInvitationsController.resendInvitation(invitationId);

        setResendingIds(previousIds => previousIds.filter(currentInvitationId => currentInvitationId !== invitationId));

        if (updatedInvitation) {
            toast.success('Ссылка обновлена');
        }
    }, []);

    const handleCancel = useCallback(async(invitationId: number) => {
        setCancelingIds(previousIds => [...previousIds, invitationId]);

        const isCanceled = await coachInvitationsController.cancelInvitation(invitationId);

        setCancelingIds(previousIds => previousIds.filter(currentInvitationId => currentInvitationId !== invitationId));

        if (isCanceled) {
            toast.success('Приглашение отменено');
            await loadInvitations();
        }
    }, [loadInvitations]);

    if (isLoading && invitations.length === 0) {
        return <div className="invitation-list__empty">Загружаем приглашения...</div>;
    }

    if (invitations.length === 0) {
        return <div className="invitation-list__empty">У вас пока нет активных ссылок-приглашений.</div>;
    }

    return (
        <div className="invitation-list">
            {invitations.map(invitation => (
                <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    isCanceling={cancelingIds.includes(invitation.id)}
                    isResending={resendingIds.includes(invitation.id)}
                    onCancel={handleCancel}
                    onCopy={handleCopy}
                    onResend={handleResend}
                    onShare={handleShare}
                />
            ))}
        </div>
    );
};

export default observer(InvitationList);
