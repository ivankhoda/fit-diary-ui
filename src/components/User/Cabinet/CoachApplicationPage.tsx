import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CoachApplicationsController from '../../../controllers/CoachApplicationsController';
import CoachApplicationsStore, { CoachApplication } from '../../../store/coachApplicationsStore';
import UserStore from '../../../store/userStore';
import {
    CoachApplicationForm,
    CoachApplicationFormValues,
    CoachApplicationHistory,
    CoachApplicationStatusCard,
} from './CoachApplicationSections';
import './CoachApplicationPage.style.scss';

type Props = {
    coachApplicationsController?: CoachApplicationsController;
    coachApplicationsStore?: CoachApplicationsStore;
    userStore?: UserStore;
};

const EMPTY_FORM_STATE: CoachApplicationFormValues = {
    contacts: '',
    experience: '',
    message: '',
    specialization: '',
};

const hasCoachRole = (roles?: string[]): boolean => Boolean(roles?.includes('coach'));

const createFormState = (application: CoachApplication | null): CoachApplicationFormValues => ({
    contacts: application?.contacts ?? '',
    experience: application?.experience ?? '',
    message: application?.message ?? '',
    specialization: application?.specialization ?? '',
});

const getStatusTitle = (application: CoachApplication | null, isCoach: boolean, t: (key: string) => string): string => {
    if (isCoach) {
        return t('У вас уже есть роль тренера');
    }

    if (!application) {
        return t('Стать тренером');
    }

    if (application.status === 'approved') {
        return t('Заявка одобрена');
    }

    if (application.status === 'rejected') {
        return t('Заявка отклонена');
    }

    return t('Заявка на рассмотрении');
};

const getStatusDescription = (application: CoachApplication | null, isCoach: boolean, t: (key: string) => string): string => {
    if (isCoach) {
        return t('Повторная заявка не требуется. Вы можете пользоваться тренерским режимом.');
    }

    if (!application) {
        return t('Расскажите о вашем опыте, специализации и о том, почему вы хотите стать тренером.');
    }

    if (application.status === 'approved') {
        return t('Заявка одобрена. После обновления профиля вам будет доступен тренерский режим.');
    }

    if (application.status === 'rejected') {
        return t('Вы можете подать новую заявку после исправления замечаний.');
    }

    return t('Мы получили вашу заявку. Пока она в статусе pending, повторно отправлять форму не нужно.');
};

const shouldDisplayForm = (
    application: CoachApplication | null,
    isCoach: boolean,
    isResubmitting: boolean,
): boolean => {
    if (isCoach) {
        return false;
    }

    if (!application) {
        return true;
    }

    if (application.status === 'rejected') {
        return isResubmitting;
    }

    return false;
};

const getLoadErrorMessage = (
    currentError: string | undefined,
    historyError: string | undefined,
    t: (key: string) => string,
): string => {
    if (currentError) {
        return currentError || t('Не удалось загрузить статус заявки');
    }

    return historyError || t('Не удалось загрузить историю заявок');
};

const getSubmitErrorMessage = (error: string | undefined, t: (key: string) => string): string => (
    error || t('Не удалось отправить заявку')
);

const isRejectedApplication = (application: CoachApplication | null): boolean => application?.status === 'rejected';

const isPendingApplication = (application: CoachApplication | null): boolean => application?.status === 'pending';

const isMessageMissing = (formState: CoachApplicationFormValues): boolean => !formState.message.trim();

const getOptionalField = (value: string): string => value.trim();

const buildApplicationPayload = (formState: CoachApplicationFormValues) => {
    const contacts = getOptionalField(formState.contacts);
    const experience = getOptionalField(formState.experience);
    const specialization = getOptionalField(formState.specialization);

    return {
        ...(contacts ? { contacts } : {}),
        ...(experience ? { experience } : {}),
        message: formState.message.trim(),
        ...(specialization ? { specialization } : {}),
    };
};

const applyFailedSubmit = ({
    error,
    setError,
    setIsSubmitting,
    t,
}: {
    error: string | undefined;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    t: (key: string) => string;
}): void => {
    setError(getSubmitErrorMessage(error, t));
    setIsSubmitting(false);
};

const applySuccessfulSubmit = ({
    application,
    setFormState,
    setIsResubmitting,
    setIsSubmitting,
    setSuccessMessage,
    t,
}: {
    application: CoachApplication | null;
    setFormState: React.Dispatch<React.SetStateAction<CoachApplicationFormValues>>;
    setIsResubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    t: (key: string) => string;
}): void => {
    setSuccessMessage(t('Заявка отправлена'));
    setIsResubmitting(false);
    setFormState(createFormState(application));
    setIsSubmitting(false);
};

const useCoachApplicationLoading = ({
    coachApplicationsController,
    currentApplication,
    setError,
    setFormState,
    t,
}: {
    coachApplicationsController: CoachApplicationsController;
    currentApplication: CoachApplication | null;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setFormState: React.Dispatch<React.SetStateAction<CoachApplicationFormValues>>;
    t: (key: string) => string;
}): boolean => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadApplications = async() => {
            setIsLoading(true);
            const currentRequest = coachApplicationsController.getCurrentCoachApplication();
            const historyRequest = coachApplicationsController.getCoachApplicationHistory();
            const responses = await Promise.all([currentRequest, historyRequest]);
            const [currentResponse, historyResponse] = responses;

            if (!isMounted) {
                return;
            }

            const hasLoadError = !currentResponse.ok || !historyResponse.ok;
            const nextError = hasLoadError
                ? getLoadErrorMessage(currentResponse.error, historyResponse.error, t)
                : '';

            setError(nextError);
            setIsLoading(false);
        };

        loadApplications().catch(() => {
            if (isMounted) {
                setError(t('Не удалось загрузить данные по заявке'));
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [
        coachApplicationsController,
        setError,
        t,
    ]);

    useEffect(() => {
        if (isRejectedApplication(currentApplication)) {
            setFormState(createFormState(currentApplication));
        }
    }, [currentApplication, setFormState]);

    return isLoading;
};

const useCoachApplicationForm = ({
    coachApplicationsController,
    currentApplication,
    setError,
    t,
}: {
    coachApplicationsController: CoachApplicationsController;
    currentApplication: CoachApplication | null;
    setError: React.Dispatch<React.SetStateAction<string>>;
    t: (key: string) => string;
}) => {
    const [formState, setFormState] = useState<CoachApplicationFormValues>(EMPTY_FORM_STATE);
    const [isResubmitting, setIsResubmitting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleFieldChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormState(previousState => ({
            ...previousState,
            [name]: value,
        }));
        setError('');
        setSuccessMessage('');
    }, [setError]);

    const handleResubmitClick = useCallback(() => {
        setFormState(createFormState(currentApplication));
        setIsResubmitting(true);
        setError('');
        setSuccessMessage('');
    }, [currentApplication, setError]);

    const handleCancelResubmission = useCallback(() => {
        setIsResubmitting(false);
        setFormState(createFormState(currentApplication));
        setError('');
    }, [currentApplication, setError]);

    const handleSubmit = useCallback(async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || isPendingApplication(currentApplication)) {
            return;
        }

        if (isMessageMissing(formState)) {
            setError(t('Сообщение обязательно для заявки'));
            return;
        }

        setIsSubmitting(true);
        setError('');

        const response = await coachApplicationsController.createCoachApplication(
            buildApplicationPayload(formState),
        );

        if (!response.ok) {
            applyFailedSubmit({
                error: response.error,
                setError,
                setIsSubmitting,
                t,
            });
            return;
        }

        applySuccessfulSubmit({
            application: response.application ?? null,
            setFormState,
            setIsResubmitting,
            setIsSubmitting,
            setSuccessMessage,
            t,
        });
    }, [
        coachApplicationsController,
        currentApplication,
        formState,
        isSubmitting,
        setError,
        t,
    ]);

    return {
        formState,
        handleCancelResubmission,
        handleFieldChange,
        handleResubmitClick,
        handleSubmit,
        isResubmitting,
        isSubmitting,
        setFormState,
        successMessage,
    };
};

const CoachApplicationPageComponent: React.FC<Props> = ({
    coachApplicationsController,
    coachApplicationsStore,
    userStore,
}): JSX.Element | null => {
    const { t } = useTranslation();

    if (!coachApplicationsController || !coachApplicationsStore || !userStore) {
        return null;
    }

    const [error, setError] = useState('');
    const { currentApplication, history: applicationsHistory } = coachApplicationsStore;
    const {
        formState,
        handleCancelResubmission,
        handleFieldChange,
        handleResubmitClick,
        handleSubmit,
        isResubmitting,
        isSubmitting,
        setFormState,
        successMessage,
    } = useCoachApplicationForm({
        coachApplicationsController,
        currentApplication,
        setError,
        t,
    });
    const isCoach = hasCoachRole(userStore.userProfile?.roles);
    const isLoading = useCoachApplicationLoading({
        coachApplicationsController,
        currentApplication,
        setError,
        setFormState,
        t,
    });

    const statusTitle = useMemo(() => getStatusTitle(currentApplication, isCoach, t), [
        currentApplication,
        isCoach,
        t,
    ]);
    const statusDescription = useMemo(
        () => getStatusDescription(currentApplication, isCoach, t),
        [
            currentApplication,
            isCoach,
            t,
        ],
    );
    const isFormVisible = shouldDisplayForm(currentApplication, isCoach, isResubmitting);

    return (
        <div className="coach-application-page">
            <section className="coach-application-page__hero">
                <p className="coach-application-page__eyebrow">Coach Applications</p>
                <h1>{statusTitle}</h1>
                <p>{statusDescription}</p>
            </section>

            {isLoading && <div className="coach-application-page__state">Загружаем данные по заявке...</div>}

            {!isLoading && (
                <>
                    <CoachApplicationStatusCard
                        application={currentApplication}
                        isResubmitting={isResubmitting}
                        onResubmit={handleResubmitClick}
                    />

                    {error && <p className="coach-application-page__error">{error}</p>}
                    {successMessage && <p className="coach-application-page__success">{successMessage}</p>}

                    {isFormVisible && (
                        <CoachApplicationForm
                            application={currentApplication}
                            formState={formState}
                            isSubmitting={isSubmitting}
                            onCancel={handleCancelResubmission}
                            onFieldChange={handleFieldChange}
                            onSubmit={handleSubmit}
                        />
                    )}

                    <CoachApplicationHistory applications={applicationsHistory} />
                </>
            )}
        </div>
    );
};

export default inject('coachApplicationsStore', 'coachApplicationsController', 'userStore')(
    observer(CoachApplicationPageComponent),
);
