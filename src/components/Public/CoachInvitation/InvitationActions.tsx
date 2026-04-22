import React from 'react';

import { CoachClientInvitation } from '../../Coach/store/coachInvitationsStore';

type Props = {
    handleAccept: () => void;
    handleCopyLink: () => void;
    handleDecline: () => void;
    handleLogin: () => void;
    handleOpenApp: () => void;
    handleRefresh: () => void;
    handleRegistration: () => void;
    invitation: CoachClientInvitation | null;
    isActionLoading: boolean;
    isAuthenticated: boolean;
    isInvalid: boolean;
    isProcessing: boolean;
};

const InvitationActions: React.FC<Props> = ({
    handleAccept,
    handleCopyLink,
    handleDecline,
    handleLogin,
    handleOpenApp,
    handleRefresh,
    handleRegistration,
    invitation,
    isActionLoading,
    isAuthenticated,
    isInvalid,
    isProcessing,
}): JSX.Element | null => {
    if (isInvalid) {
        return (
            <div className="coach-invitation-page__actions">
                <button
                    className="coach-invitation-page__button coach-invitation-page__button--secondary"
                    onClick={handleCopyLink}
                >
                    Скопировать ссылку
                </button>
            </div>
        );
    }

    if (!invitation) {
        return null;
    }

    if (invitation.status === 'accepted') {
        return (
            <div className="coach-invitation-page__actions">
                <button className="coach-invitation-page__button" onClick={handleOpenApp}>Открыть приложение</button>
            </div>
        );
    }

    if (invitation.status !== 'pending') {
        return (
            <div className="coach-invitation-page__actions">
                <button
                    className="coach-invitation-page__button coach-invitation-page__button--secondary"
                    onClick={handleRefresh}
                >
                    Обновить статус
                </button>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="coach-invitation-page__actions">
                <button className="coach-invitation-page__button" disabled>Обрабатываем...</button>
                <button
                    className="coach-invitation-page__button coach-invitation-page__button--secondary"
                    onClick={handleRefresh}
                >
                    Проверить ещё раз
                </button>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="coach-invitation-page__actions">
                <button className="coach-invitation-page__button" onClick={handleLogin}>Войти</button>
                <button
                    className="coach-invitation-page__button coach-invitation-page__button--secondary"
                    onClick={handleRegistration}
                >
                    Зарегистрироваться
                </button>
            </div>
        );
    }

    return (
        <div className="coach-invitation-page__actions">
            <button className="coach-invitation-page__button" onClick={handleAccept} disabled={isActionLoading}>
                {isActionLoading ? 'Отправляем...' : 'Принять'}
            </button>
            <button
                className="coach-invitation-page__button coach-invitation-page__button--secondary"
                onClick={handleDecline}
                disabled={isActionLoading}
            >
                Отклонить
            </button>
        </div>
    );
};

export default InvitationActions;
