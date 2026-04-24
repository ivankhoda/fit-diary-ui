import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import i18n from 'i18next';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AdminPanel from '../AdminPanel';
import AdminCoachApplicationsController from '../controllers/AdminCoachApplicationsController';
import AdminCoachApplicationsStore from '../store/AdminCoachApplicationsStore';
import CoachApplicationModeration from './CoachApplicationModeration';
import { useCoachApplicationDetailModeration } from './useCoachApplicationDetailModeration';
import './CoachApplicationsManagement.style.scss';

type Props = {
    adminCoachApplicationsController?: AdminCoachApplicationsController;
    adminCoachApplicationsStore?: AdminCoachApplicationsStore;
};

const CoachApplicationDataComponent: React.FC<Props> = ({
    adminCoachApplicationsController,
    adminCoachApplicationsStore,
}): JSX.Element | null => {
    const navigate = useNavigate();
    const { applicationId = '' } = useParams<{ applicationId: string }>();

    if (!adminCoachApplicationsController || !adminCoachApplicationsStore) {
        return null;
    }

    const { application } = adminCoachApplicationsStore;
    const {
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
    } = useCoachApplicationDetailModeration(adminCoachApplicationsController, application);

    useEffect(() => {
        adminCoachApplicationsController.fetchApplication(Number(applicationId))
            .then(response => {
                setErrorMessage(response.ok ? '' : response.error || i18n.t('Заявка не найдена'));
            })
            .catch(() => {
                setErrorMessage(i18n.t('Заявка не найдена'));
            });
    }, [
        adminCoachApplicationsController,
        applicationId,
        setErrorMessage,
    ]);

    const handleBack = useCallback(() => {
        navigate('/admin/coach-applications');
    }, [navigate]);

    return (
        <AdminPanel>
            <div className="coach-application-detail">
                <button className="coach-application-detail__back" onClick={handleBack} type="button">
                    {i18n.t('Назад к списку')}
                </button>

                {error && <p className="coach-applications-management__error">{error}</p>}

                {application && (
                    <article className="coach-application-detail__card">
                        <h2>{i18n.t('Заявка')} #{application.id}</h2>
                        <p>{i18n.t('Статус')}: {application.status}</p>
                        <p>{i18n.t('Пользователь')}: {application.user?.email || i18n.t('Без email')}</p>
                        <p>{i18n.t('Сообщение')}: {application.message}</p>
                        <p>{i18n.t('Опыт')}: {application.experience || i18n.t('Не указано')}</p>
                        <p>{i18n.t('Специализация')}: {application.specialization || i18n.t('Не указано')}</p>
                        <p>{i18n.t('Контакты')}: {application.contacts || i18n.t('Не указано')}</p>
                        <p>{i18n.t('Причина отказа')}: {application.rejection_reason || i18n.t('Не указано')}</p>
                        <p>{i18n.t('Создана')}: {application.created_at}</p>
                        <p>{i18n.t('Обновлена')}: {application.updated_at}</p>
                        {application.status === 'pending' && (
                            <CoachApplicationModeration
                                isProcessing={isProcessing}
                                isRejecting={isRejecting}
                                onApprove={handleApprove}
                                onRejectCancel={handleRejectCancel}
                                onRejectChange={handleRejectChange}
                                onRejectOpen={handleRejectOpen}
                                onRejectSubmit={handleRejectSubmit}
                                rejectionReason={rejectionReason}
                            />
                        )}
                    </article>
                )}
            </div>
        </AdminPanel>
    );
};

export default inject('adminCoachApplicationsStore', 'adminCoachApplicationsController')(
    observer(CoachApplicationDataComponent),
);
