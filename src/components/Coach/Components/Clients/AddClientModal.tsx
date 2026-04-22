import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { coachInvitationsController } from '../../controllers/global';
import { buildCoachInvitationUrl, createCoachInvitationShareText } from '../../../../services/coachInvitation';
import './AddClientModal.scss';

const copyInvitationLink = async(invitationUrl: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(invitationUrl);
        return true;
    } catch {
        return false;
    }
};

const shareInvitationLink = async(invitationUrl: string, message: string): Promise<boolean> => {
    if (!navigator.share) {
        return false;
    }

    try {
        await navigator.share({
            text: createCoachInvitationShareText(message, invitationUrl),
            title: 'Приглашение в Planka',
            url: invitationUrl,
        });
        return true;
    } catch {
        return false;
    }
};

const AddClientModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): JSX.Element | null => {
    const [createdInvitationToken, setCreatedInvitationToken] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const invitationUrl = useMemo(() => {
        if (!createdInvitationToken) {
            return '';
        }

        return buildCoachInvitationUrl(createdInvitationToken);
    }, [createdInvitationToken]);

    const resetModalState = useCallback(() => {
        setCreatedInvitationToken('');
        setError('');
        setIsSubmitting(false);
        setMessage('');
    }, []);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    const handleSubmit = useCallback(async() => {
        if (isSubmitting) {
            return;
        }

        setError('');
        setIsSubmitting(true);

        const invitation = await coachInvitationsController.createInvitation(message);

        if (!invitation) {
            setError('Не удалось создать ссылку-приглашение');
            setIsSubmitting(false);
            return;
        }

        setCreatedInvitationToken(invitation.token);
        setIsSubmitting(false);
        toast.success('Ссылка-приглашение создана');
    }, [isSubmitting, message]);

    const handleMessageChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
        setError('');
    }, []);

    const handleCopyLink = useCallback(async() => {
        if (!invitationUrl) {
            return;
        }

        const copied = await copyInvitationLink(invitationUrl);

        if (copied) {
            toast.success('Ссылка скопирована');
            return;
        }

        toast.error('Не удалось скопировать ссылку');
    }, [invitationUrl]);

    const handleShareLink = useCallback(async() => {
        if (!invitationUrl) {
            return;
        }

        const shared = await shareInvitationLink(invitationUrl, message);

        if (shared) {
            return;
        }

        const copied = await copyInvitationLink(invitationUrl);

        if (copied) {
            toast.success('Ссылка скопирована в буфер обмена');
            return;
        }

        toast.error('Не удалось поделиться ссылкой');
    }, [invitationUrl, message]);

    const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }, [handleClose]);

    if (!isOpen) {return null;}

    return (
        <div className="add-client-modal-overlay" onClick={handleOutsideClick}>
            <div className="add-client-modal">
                <h3 className="modal-title">Создать ссылку-приглашение</h3>
                <p className="modal-description">
                    Создайте ссылку и отправьте её клиенту в любом удобном канале.
                </p>

                <textarea
                    className="modal-input"
                    placeholder="Сообщение к приглашению (необязательно)"
                    value={message}
                    onChange={handleMessageChange}
                    rows={4}
                />

                <input
                    className="modal-input"
                    placeholder="Ссылка появится после создания"
                    value={invitationUrl}
                    readOnly
                />

                {error && <p className="modal-error">{error}</p>}

                <div className="modal-actions">
                    <button className="modal-button cancel" onClick={handleClose}>Закрыть</button>
                    <button className="modal-button secondary" onClick={handleCopyLink} disabled={!invitationUrl}>Скопировать</button>
                    <button className="modal-button secondary" onClick={handleShareLink} disabled={!invitationUrl}>Поделиться</button>
                    <button className="modal-button add" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Создаём...' : 'Создать ссылку'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AddClientModal);
