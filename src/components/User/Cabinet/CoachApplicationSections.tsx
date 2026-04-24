import React from 'react';

import { CoachApplication } from '../../../store/coachApplicationsStore';
import { formatDate } from '../../Common/date/formatDate';

export type CoachApplicationFormValues = {
    contacts: string;
    experience: string;
    message: string;
    specialization: string;
};

const getApplicationBadgeStatus = (application: CoachApplication | null): string => application?.status ?? 'new';

const isRejectedApplication = (application: CoachApplication | null): boolean => application?.status === 'rejected';

export const CoachApplicationStatusCard = ({
    application,
    isResubmitting,
    onResubmit,
}: {
    application: CoachApplication | null;
    isResubmitting: boolean;
    onResubmit: () => void;
}): JSX.Element => {
    const badgeStatus = getApplicationBadgeStatus(application);

    return (
        <section className="coach-application-page__status-card">
            <h2>Текущий статус</h2>
            <p>
                Статус:{' '}
                <span className={`coach-application-page__badge coach-application-page__badge--${badgeStatus}`}>
                    {badgeStatus}
                </span>
            </p>
            {application?.created_at && <p>Создана: {formatDate(application.created_at)}</p>}
            {application?.reviewed_at && <p>Проверена: {formatDate(application.reviewed_at)}</p>}
            {application?.rejection_reason && <p>Причина отказа: {application.rejection_reason}</p>}
            {isRejectedApplication(application) && !isResubmitting && (
                <button
                    className="coach-application-page__secondary-button"
                    onClick={onResubmit}
                    type="button"
                >
                    Подать повторно
                </button>
            )}
        </section>
    );
};

export const CoachApplicationForm = ({
    application,
    formState,
    isSubmitting,
    onCancel,
    onFieldChange,
    onSubmit,
}: {
    application: CoachApplication | null;
    formState: CoachApplicationFormValues;
    isSubmitting: boolean;
    onCancel: () => void;
    onFieldChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}): JSX.Element => (
    <section className="coach-application-page__form-section">
        <h2>Форма заявки</h2>
        <form className="coach-application-page__form" onSubmit={onSubmit}>
            <label>
                Сообщение*
                <textarea name="message" onChange={onFieldChange} rows={5} value={formState.message} />
            </label>
            <label>
                Опыт
                <input name="experience" onChange={onFieldChange} type="text" value={formState.experience} />
            </label>
            <label>
                Специализация
                <input name="specialization" onChange={onFieldChange} type="text" value={formState.specialization} />
            </label>
            <label>
                Контакты
                <input name="contacts" onChange={onFieldChange} type="text" value={formState.contacts} />
            </label>
            <div className="coach-application-page__form-actions">
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
                </button>
                {isRejectedApplication(application) && (
                    <button className="coach-application-page__secondary-button" onClick={onCancel} type="button">
                        Отмена
                    </button>
                )}
            </div>
        </form>
    </section>
);

export const CoachApplicationHistory = ({ applications }: { applications: CoachApplication[] }): JSX.Element | null => {
    if (applications.length === 0) {
        return null;
    }

    return (
        <section className="coach-application-page__history">
            <h2>История заявок</h2>
            <div className="coach-application-page__history-list">
                {applications.map(application => (
                    <article className="coach-application-page__history-card" key={application.id}>
                        <div className="coach-application-page__history-header">
                            <strong>Заявка #{application.id}</strong>
                            <span className={`coach-application-page__badge coach-application-page__badge--${application.status}`}>
                                {application.status}
                            </span>
                        </div>
                        <p>{application.message}</p>
                        <p>Создана: {formatDate(application.created_at)}</p>
                        {application.rejection_reason && <p>Причина отказа: {application.rejection_reason}</p>}
                        {application.reviewed_by && (
                            <p>
                                Проверил: {application.reviewed_by.first_name || application.reviewed_by.email}
                            </p>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
};
