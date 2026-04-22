/* eslint-disable max-lines */
/* eslint-disable max-statements */
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import UserController from '../../../controllers/UserController';
import { getAccessToken } from '../../../services/authSession';
import {
    buildCoachInvitationPath,
    buildCoachInvitationUrl,
    clearCoachInvitationToken,
    saveCoachInvitationToken,
    shouldAutoAcceptCoachInvitation,
} from '../../../services/coachInvitation';
import getApiBaseUrl from '../../../utils/apiUrl';
import Post from '../../../utils/PostRequest';
import { CoachClientInvitation } from '../../Coach/store/coachInvitationsStore';
import InvitationActions from './InvitationActions';
import './CoachInvitationPage.scss';

const DATE_SLICE_END_INDEX = 10;
const NOT_FOUND_STATUS = 404;
const PROCESSING_POLL_DELAY_MS = 1500;
const PROCESSING_POLL_LIMIT = 4;

type Props = {
    userController?: UserController;
};

type InvitationAction = 'accept' | 'decline';

type InvitationPayload = {
    invitation?: CoachClientInvitation;
    ok?: boolean;
};

type InvitationStateSetters = {
    setInvitation: React.Dispatch<React.SetStateAction<CoachClientInvitation | null>>;
    setIsInvalid: React.Dispatch<React.SetStateAction<boolean>>;
};

type CoachInvitationState = {
    fetchInvitation: () => Promise<CoachClientInvitation | null>;
    handleInvitationAction: (action: InvitationAction) => Promise<void>;
    invitation: CoachClientInvitation | null;
    isAutoAcceptPending: boolean;
    isActionLoading: boolean;
    isAuthenticated: boolean;
    isInvalid: boolean;
    isLoading: boolean;
    isProcessing: boolean;
};

const isCoachClientInvitation = (
    payload: CoachClientInvitation | InvitationPayload,
): payload is CoachClientInvitation => (
    'accepted_at' in payload && 'status' in payload && 'token' in payload
);

const resolveInvitation = (payload: CoachClientInvitation | InvitationPayload): CoachClientInvitation | null => {
    if (isCoachClientInvitation(payload)) {
        return payload;
    }

    return payload.invitation ?? null;
};

const getInvitationTitle = (status: CoachClientInvitation['status']): string => {
    switch (status) {
    case 'accepted':
        return 'Вы подключены к тренеру';
    case 'canceled':
        return 'Приглашение отменено';
    case 'declined':
        return 'Приглашение отклонено';
    case 'expired':
        return 'Ссылка истекла';
    default:
        return 'Приглашение от тренера';
    }
};

const getInvitationDescription = (invitation: CoachClientInvitation | null): string => {
    if (!invitation) {
        return 'Ссылка недействительна или больше недоступна.';
    }

    switch (invitation.status) {
    case 'accepted':
        return 'Связь с тренером подтверждена. Можно переходить в основной раздел приложения.';
    case 'canceled':
        return 'Тренер отменил это приглашение. Попросите отправить новую ссылку.';
    case 'declined':
        return 'Вы отказались от подключения. Если передумаете, попросите тренера отправить новую ссылку.';
    case 'expired':
        return 'Срок действия ссылки закончился. Попросите тренера перевыпустить приглашение.';
    default:
        return invitation.message || 'Тренер приглашает вас подключиться к совместной работе.';
    }
};

const isTerminalStatus = (status: CoachClientInvitation['status']): boolean => status !== 'pending';

const readInvitationResponse = async(response: Response): Promise<CoachClientInvitation | 'not-found' | null> => {
    if (response.status === NOT_FOUND_STATUS) {
        return 'not-found';
    }

    const data = await response.json() as InvitationPayload | CoachClientInvitation;

    if (!response.ok) {
        return null;
    }

    return resolveInvitation(data);
};

const setInvalidInvitationState = ({ setInvitation, setIsInvalid }: InvitationStateSetters): null => {
    clearCoachInvitationToken();
    setInvitation(null);
    setIsInvalid(true);
    return null;
};

const applyFetchedInvitation = (
    nextInvitation: CoachClientInvitation,
    { setInvitation, setIsInvalid }: InvitationStateSetters,
    context: {
        token: string;
        userController?: UserController;
    },
): CoachClientInvitation => {
    const { token, userController } = context;
    setInvitation(nextInvitation);
    setIsInvalid(false);
    saveCoachInvitationToken(token);

    if (isTerminalStatus(nextInvitation.status)) {
        clearCoachInvitationToken();
    }

    if (nextInvitation.status === 'accepted') {
        userController?.getUser();
    }

    return nextInvitation;
};

const useCoachInvitation = (
    token: string,
    shouldAutoAccept: boolean,
    userController?: UserController,
): CoachInvitationState => {
    const [invitation, setInvitation] = useState<CoachClientInvitation | null>(null);
    const [isAutoAcceptPending, setIsAutoAcceptPending] = useState(shouldAutoAccept);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pollAttempt, setPollAttempt] = useState(0);
    const invitationStateSetters = useMemo(() => ({ setInvitation, setIsInvalid }), []);
    const isAuthenticated = Boolean(getAccessToken());

    const fetchInvitation = useCallback(async(): Promise<CoachClientInvitation | null> => {
        if (!token) {
            return setInvalidInvitationState(invitationStateSetters);
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${getApiBaseUrl()}/users/coach_invitations/${token}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            const nextInvitation = await readInvitationResponse(response);

            if (!nextInvitation || nextInvitation === 'not-found') {
                return setInvalidInvitationState(invitationStateSetters);
            }

            return applyFetchedInvitation(nextInvitation, invitationStateSetters, {
                token,
                userController,
            });
        } catch {
            return setInvalidInvitationState(invitationStateSetters);
        } finally {
            setIsLoading(false);
        }
    }, [
        invitationStateSetters,
        token,
        userController,
    ]);

    useEffect(() => {
        fetchInvitation().catch(() => null);
    }, [fetchInvitation]);

    useEffect(() => {
        let timeoutId = 0;

        if (pollAttempt >= PROCESSING_POLL_LIMIT) {
            setIsProcessing(false);
        }

        if (isProcessing && pollAttempt < PROCESSING_POLL_LIMIT) {
            timeoutId = window.setTimeout(() => {
                fetchInvitation()
                    .then(nextInvitation => {
                        if (nextInvitation?.status === 'pending') {
                            setPollAttempt(currentPollAttempt => currentPollAttempt + 1);
                            return;
                        }

                        setIsProcessing(false);
                    })
                    .catch(() => {
                        setIsProcessing(false);
                    });
            }, PROCESSING_POLL_DELAY_MS);
        }

        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [
        fetchInvitation,
        isProcessing,
        pollAttempt,
    ]);

    const handleInvitationAction = useCallback(async(action: InvitationAction): Promise<void> => {
        if (!token || isActionLoading) {
            return;
        }

        setIsActionLoading(true);

        try {
            const response = await new Post({
                url: `${getApiBaseUrl()}/users/coach_invitations/${token}/${action}`
            }).execute();

            if (!response.ok) {
                toast.error('Не удалось обновить приглашение');
                return;
            }

            setIsProcessing(true);
            setPollAttempt(0);
        } catch {
            toast.error('Не удалось обновить приглашение');
        } finally {
            setIsActionLoading(false);
        }
    }, [isActionLoading, token]);

    useEffect(() => {
        if (!isAutoAcceptPending || !isAuthenticated || !invitation || invitation.status !== 'pending') {
            return;
        }

        if (isActionLoading || isProcessing) {
            return;
        }

        setIsAutoAcceptPending(false);
        handleInvitationAction('accept').catch(() => null);
    }, [
        handleInvitationAction,
        invitation,
        isActionLoading,
        isAuthenticated,
        isAutoAcceptPending,
        isProcessing,
    ]);

    return {
        fetchInvitation,
        handleInvitationAction,
        invitation,
        isActionLoading,
        isAuthenticated,
        isAutoAcceptPending,
        isInvalid,
        isLoading,
        isProcessing,
    };
};

const useCoachInvitationAutoAcceptCleanup = ({
    isAutoAcceptPending,
    navigate,
    search,
    token,
}: {
    isAutoAcceptPending: boolean;
    navigate: ReturnType<typeof useNavigate>;
    search: string;
    token: string;
}): void => {
    useEffect(() => {
        if (!isAutoAcceptPending || !shouldAutoAcceptCoachInvitation(search) || !token) {
            return;
        }

        navigate(buildCoachInvitationPath(token), { replace: true });
    }, [
        isAutoAcceptPending,
        navigate,
        search,
        token,
    ]);
};

const CoachInvitationPageComponent: React.FC<Props> = ({ userController }): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token = '' } = useParams<{ token: string }>();

    const {
        fetchInvitation,
        handleInvitationAction,
        invitation,
        isAutoAcceptPending,
        isActionLoading,
        isAuthenticated,
        isInvalid,
        isLoading,
        isProcessing,
    } = useCoachInvitation(token, shouldAutoAcceptCoachInvitation(location.search), userController);

    const invitationTitle = useMemo(() => {
        if (isInvalid) {
            return 'Ссылка недействительна';
        }

        return getInvitationTitle(invitation?.status ?? 'pending');
    }, [invitation?.status, isInvalid]);

    const handleAuthRedirect = useCallback((path: '/login' | '/registration') => {
        saveCoachInvitationToken(token);
        navigate(`${path}?invite_token=${encodeURIComponent(token)}`);
    }, [navigate, token]);

    const handleAccept = useCallback(() => {
        handleInvitationAction('accept').catch(() => null);
    }, [handleInvitationAction]);

    const handleCopyLink = useCallback(async() => {
        try {
            await navigator.clipboard.writeText(buildCoachInvitationUrl(token));
            toast.success('Ссылка скопирована');
        } catch {
            toast.error('Не удалось скопировать ссылку');
        }
    }, [token]);

    const handleDecline = useCallback(() => {
        handleInvitationAction('decline').catch(() => null);
    }, [handleInvitationAction]);

    const handleLogin = useCallback(() => {
        handleAuthRedirect('/login');
    }, [handleAuthRedirect]);

    const handleOpenApp = useCallback(() => {
        navigate('/');
    }, [navigate]);

    useCoachInvitationAutoAcceptCleanup({
        isAutoAcceptPending,
        navigate,
        search: location.search,
        token,
    });

    const handleRefresh = useCallback(() => {
        fetchInvitation().catch(() => null);
    }, [fetchInvitation]);

    const handleRegistration = useCallback(() => {
        handleAuthRedirect('/registration');
    }, [handleAuthRedirect]);

    return (
        <div className="coach-invitation-page">
            <div className="coach-invitation-page__card">
                <p className="coach-invitation-page__eyebrow">Coach Invitation</p>
                <h1 className="coach-invitation-page__title">{invitationTitle}</h1>

                {isLoading && !invitation && !isInvalid && (
                    <p className="coach-invitation-page__description">Загружаем данные приглашения...</p>
                )}

                {invitation && (
                    <div className="coach-invitation-page__details">
                        <p className="coach-invitation-page__description">{getInvitationDescription(invitation)}</p>
                        <p className="coach-invitation-page__meta">
                            Тренер: {invitation.coach.name || invitation.coach.email || 'Без имени'}
                        </p>
                        <p className="coach-invitation-page__meta">
                            Ссылка активна до: {invitation.expires_at.slice(0, DATE_SLICE_END_INDEX)}
                        </p>
                    </div>
                )}

                {isInvalid && (
                    <p className="coach-invitation-page__description">Ссылка недействительна или уже не активна.</p>
                )}

                {isProcessing && (
                    <p className="coach-invitation-page__processing">
                        Подключаем вас к тренеру. Обновляем статус приглашения...
                    </p>
                )}

                {!isProcessing && isAutoAcceptPending && isAuthenticated && invitation?.status === 'pending' && (
                    <p className="coach-invitation-page__processing">
                        Подтверждаем приглашение после входа...
                    </p>
                )}

                <InvitationActions
                    handleAccept={handleAccept}
                    handleCopyLink={handleCopyLink}
                    handleDecline={handleDecline}
                    handleLogin={handleLogin}
                    handleOpenApp={handleOpenApp}
                    handleRefresh={handleRefresh}
                    handleRegistration={handleRegistration}
                    invitation={invitation}
                    isActionLoading={isActionLoading}
                    isAuthenticated={isAuthenticated}
                    isInvalid={isInvalid}
                    isProcessing={isProcessing}
                />
            </div>
        </div>
    );
};

export default inject('userController')(observer(CoachInvitationPageComponent));
