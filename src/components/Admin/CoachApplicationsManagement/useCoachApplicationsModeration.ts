import i18n from 'i18next';
import { useCallback, useState } from 'react';

import AdminCoachApplicationsController from '../controllers/AdminCoachApplicationsController';

type UseCoachApplicationsModerationResult = {
    error: string;
    handleApprove: (applicationId: number) => void;
    handleOpenReject: (applicationId: number) => void;
    handleRejectCancel: () => void;
    handleRejectChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleRejectSubmit: (applicationId: number) => void;
    processingId: number | null;
    rejectingId: number | null;
    rejectionReason: string;
    setErrorMessage: (message: string) => void;
};

const getMutationError = (error?: string): string => error || i18n.t('Не удалось обновить заявку');

export const useCoachApplicationsModeration = (
    adminCoachApplicationsController: AdminCoachApplicationsController,
): UseCoachApplicationsModerationResult => {
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const setErrorMessage = useCallback((message: string) => {
        setError(message);
    }, []);

    const handleApprove = useCallback((applicationId: number) => {
        setProcessingId(applicationId);

        adminCoachApplicationsController.approveApplication(applicationId)
            .then(response => {
                setError(response.ok ? '' : getMutationError(response.error));
                setProcessingId(null);
            })
            .catch(() => {
                setError(getMutationError());
                setProcessingId(null);
            });
    }, [adminCoachApplicationsController]);

    const handleOpenReject = useCallback((applicationId: number) => {
        setRejectingId(applicationId);
        setRejectionReason('');
        setError('');
    }, []);

    const handleRejectCancel = useCallback(() => {
        setRejectingId(null);
        setRejectionReason('');
    }, []);

    const handleRejectChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRejectionReason(event.target.value);
    }, []);

    const handleRejectSubmit = useCallback((applicationId: number) => {
        if (!rejectionReason.trim()) {
            setError(i18n.t('Причина отклонения обязательна'));
            return;
        }

        setProcessingId(applicationId);
        adminCoachApplicationsController.rejectApplication(applicationId, rejectionReason)
            .then(response => {
                setError(response.ok ? '' : getMutationError(response.error));
                setProcessingId(null);
                setRejectingId(response.ok ? null : applicationId);
                setRejectionReason(response.ok ? '' : rejectionReason);
            })
            .catch(() => {
                setError(getMutationError());
                setProcessingId(null);
            });
    }, [adminCoachApplicationsController, rejectionReason]);

    return {
        error,
        handleApprove,
        handleOpenReject,
        handleRejectCancel,
        handleRejectChange,
        handleRejectSubmit,
        processingId,
        rejectingId,
        rejectionReason,
        setErrorMessage,
    };
};
