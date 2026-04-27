import React, { useCallback } from 'react';
import i18n from 'i18next';

type Props = {
    isProcessing: boolean;
    isRejecting: boolean;
    onApprove: () => void;
    onRejectCancel: () => void;
    onRejectChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onRejectOpen: () => void;
    onRejectSubmit: () => void;
    rejectionReason: string;
};

const CoachApplicationModeration = ({
    isProcessing,
    isRejecting,
    onApprove,
    onRejectCancel,
    onRejectChange,
    onRejectOpen,
    onRejectSubmit,
    rejectionReason,
}: Props): JSX.Element => {
    const handleContainerClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    }, []);

    if (isRejecting) {
        return (
            <div className="coach-application-moderation" onClick={handleContainerClick}>
                <textarea
                    className="coach-application-moderation__textarea"
                    onChange={onRejectChange}
                    placeholder={i18n.t('Укажите причину отклонения')}
                    value={rejectionReason}
                />
                <div className="coach-application-moderation__actions">
                    <button disabled={isProcessing} onClick={onRejectSubmit} type="button">
                        {isProcessing ? i18n.t('Сохраняем...') : i18n.t('Подтвердить отклонение')}
                    </button>
                    <button
                        className="coach-application-moderation__secondary"
                        disabled={isProcessing}
                        onClick={onRejectCancel}
                        type="button"
                    >
                        {i18n.t('Отмена')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="coach-application-moderation__actions" onClick={handleContainerClick}>
            <button disabled={isProcessing} onClick={onApprove} type="button">
                {isProcessing ? i18n.t('Обновляем...') : i18n.t('Approve')}
            </button>
            <button
                className="coach-application-moderation__danger"
                disabled={isProcessing}
                onClick={onRejectOpen}
                type="button"
            >
                {i18n.t('Reject')}
            </button>
        </div>
    );
};

export default CoachApplicationModeration;
