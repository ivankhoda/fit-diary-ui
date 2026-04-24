import i18n from 'i18next';
import { useCallback, useState } from 'react';

import AdminCoachApplicationsController from '../controllers/AdminCoachApplicationsController';
import { CoachApplication } from '../../../store/coachApplicationsStore';

type UseCoachApplicationDetailModerationResult = {
    error: string;
    handleApprove: () => void;
    handleRejectCancel: () => void;
    handleRejectChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleRejectOpen: () => void;
    handleRejectSubmit: () => void;
    isProcessing: boolean;
    isRejecting: boolean;
    rejectionReason: string;
    setErrorMessage: (message: string) => void;
};

const getMutationError = (error?: string): string => error || i18n.t('Не удалось обновить заявку');

export const useCoachApplicationDetailModeration = (
    adminCoachApplicationsController: AdminCoachApplicationsController,
    application: CoachApplication | null,
): UseCoachApplicationDetailModerationResult => {
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const setErrorMessage = useCallback((message: string) => {
        setError(message);
    }, []);

    const handleApprove = useCallback(() => {
        if (!application) {
            return;
        }

        setIsProcessing(true);
        adminCoachApplicationsController.approveApplication(application.id)
            .then(response => {
                setError(response.ok ? '' : getMutationError(response.error));
                setIsProcessing(false);
            })
            .catch(() => {
                setError(getMutationError());
                setIsProcessing(false);
            });
    }, [adminCoachApplicationsController, application]);

    const handleRejectOpen = useCallback(() => {
        setIsRejecting(true);
        setRejectionReason(application?.rejection_reason || '');
    }, [application?.rejection_reason]);

    const handleRejectCancel = useCallback(() => {
        setIsRejecting(false);
        setRejectionReason('');
    }, []);

    const handleRejectChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRejectionReason(event.target.value);
    }, []);

    const handleRejectSubmit = useCallback(() => {
        if (!application) {
            return;
        }

        if (!rejectionReason.trim()) {
            setError(i18n.t('Причина отклонения обязательна'));
            return;
        }

        setIsProcessing(true);
        adminCoachApplicationsController.rejectApplication(application.id, rejectionReason)
            .then(response => {
                setError(response.ok ? '' : getMutationError(response.error));
                setIsProcessing(false);
                setIsRejecting(!response.ok);
            })
            .catch(() => {
                setError(getMutationError());
                setIsProcessing(false);
            });
    }, [
        adminCoachApplicationsController,
        application,
        rejectionReason,
    ]);

    return {
        error,
        handleApprove,
        handleRejectCancel,
        handleRejectChange,
        handleRejectOpen,
        handleRejectSubmit,
        isProcessing,
        isRejecting,
        rejectionReason,
        setErrorMessage,
    };
};
