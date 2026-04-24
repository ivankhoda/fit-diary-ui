import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import i18n from 'i18next';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

import AdminPanel from '../AdminPanel';
import AdminCoachApplicationsController from '../controllers/AdminCoachApplicationsController';
import AdminCoachApplicationsStore from '../store/AdminCoachApplicationsStore';
import { CoachApplication } from '../../../store/coachApplicationsStore';
import CoachApplicationModeration from './CoachApplicationModeration';
import { ITEMS_PER_PAGE, coachApplicationStatusOptions } from './maps';
import { useCoachApplicationFilters } from './useCoachApplicationFilters';
import { useCoachApplicationsModeration } from './useCoachApplicationsModeration';
import './CoachApplicationsManagement.style.scss';

type Props = {
    adminCoachApplicationsController?: AdminCoachApplicationsController;
    adminCoachApplicationsStore?: AdminCoachApplicationsStore;
};

type RowProps = {
    application: CoachApplication;
    isProcessing: boolean;
    isRejecting: boolean;
    onApprove: (applicationId: number) => void;
    onOpen: (applicationId: number) => void;
    onRejectCancel: () => void;
    onRejectChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onRejectSubmit: (applicationId: number) => void;
    onSelect: (applicationId: number) => void;
    rejectionReason: string;
};

const SORT_AFTER = 1;
const SORT_BEFORE = -1;

const getApplicantLabel = (application: CoachApplication): string => (
    application.user?.email
    || application.user?.username
    || [application.user?.first_name, application.user?.last_name].filter(Boolean).join(' ')
    || i18n.t('Без email')
);

const getSearchableValue = (application: CoachApplication): string => [
    application.message,
    application.user?.email,
    application.user?.first_name,
    application.user?.last_name,
    application.user?.username,
].filter(Boolean).join(' ').toLowerCase();

const getSortableValue = (application: CoachApplication, sortKey: string): number | string => {
    if (sortKey === 'user') {
        return getApplicantLabel(application).toLowerCase();
    }

    return application[sortKey as keyof CoachApplication] as number | string;
};

const sortApplications = (
    applications: CoachApplication[],
    sortDirection: 'asc' | 'desc',
    sortKey: string,
): CoachApplication[] => [...applications].sort((leftApplication, rightApplication) => {
    const leftValue = getSortableValue(leftApplication, sortKey);
    const rightValue = getSortableValue(rightApplication, sortKey);

    if (leftValue === rightValue) {
        return 0;
    }

    if (sortDirection === 'asc') {
        return leftValue > rightValue ? SORT_AFTER : SORT_BEFORE;
    }

    return leftValue < rightValue ? SORT_AFTER : SORT_BEFORE;
});

const CoachApplicationRow = ({
    application,
    isProcessing,
    isRejecting,
    onApprove,
    onOpen,
    onRejectCancel,
    onRejectChange,
    onRejectSubmit,
    onSelect,
    rejectionReason,
}: RowProps): JSX.Element => {
    const handleApprove = useCallback(() => {
        onApprove(application.id);
    }, [application.id, onApprove]);

    const handleOpenReject = useCallback(() => {
        onOpen(application.id);
    }, [application.id, onOpen]);

    const handleRejectCancel = useCallback(() => {
        onRejectCancel();
    }, [onRejectCancel]);

    const handleRejectSubmit = useCallback(() => {
        onRejectSubmit(application.id);
    }, [application.id, onRejectSubmit]);

    const handleSelect = useCallback(() => {
        onSelect(application.id);
    }, [application.id, onSelect]);

    const actionContent = application.status === 'pending'
        ? (
            <CoachApplicationModeration
                isProcessing={isProcessing}
                isRejecting={isRejecting}
                onApprove={handleApprove}
                onRejectCancel={handleRejectCancel}
                onRejectChange={onRejectChange}
                onRejectOpen={handleOpenReject}
                onRejectSubmit={handleRejectSubmit}
                rejectionReason={rejectionReason}
            />
        )
        : <span>{i18n.t('Открыть')}</span>;

    return (
        <tr className="coach-applications-table__row" onClick={handleSelect}>
            <td>{application.id}</td>
            <td>{getApplicantLabel(application)}</td>
            <td>{application.status}</td>
            <td>{application.created_at}</td>
            <td className="coach-applications-table__message">{application.message}</td>
            <td>{actionContent}</td>
        </tr>
    );
};

const CoachApplicationsListComponent: React.FC<Props> = ({
    adminCoachApplicationsController,
    adminCoachApplicationsStore,
}): JSX.Element | null => {
    const navigate = useNavigate();

    if (!adminCoachApplicationsController || !adminCoachApplicationsStore) {
        return null;
    }

    const {
        clearFilters,
        currentPage,
        handlePageChange,
        handleSearchChange,
        handleSort,
        handleStatusChange,
        searchName,
        sortDirection,
        sortKey,
        statusFilter,
    } = useCoachApplicationFilters();
    const {
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
    } = useCoachApplicationsModeration(adminCoachApplicationsController);
    const { applications } = adminCoachApplicationsStore;

    useEffect(() => {
        adminCoachApplicationsController.fetchApplications(statusFilter)
            .then(response => {
                setErrorMessage(response.ok ? '' : response.error || i18n.t('Не удалось загрузить заявки'));
            })
            .catch(() => {
                setErrorMessage(i18n.t('Не удалось загрузить заявки'));
            });
    }, [
        adminCoachApplicationsController,
        setErrorMessage,
        statusFilter,
    ]);

    const filteredApplications = useMemo(() => sortApplications(
        applications.filter(application => getSearchableValue(application).includes(searchName.toLowerCase())),
        sortDirection,
        sortKey,
    ), [
        applications,
        searchName,
        sortDirection,
        sortKey,
    ]);

    const currentApplications = useMemo(() => filteredApplications.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE,
    ), [currentPage, filteredApplications]);

    const pageCount = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

    const handleSelect = useCallback((applicationId: number) => {
        navigate(`/admin/coach-applications/${applicationId}`);
    }, [navigate]);

    const handleSortButtonClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const { sortKey: nextSortKey } = event.currentTarget.dataset;

        if (nextSortKey) {
            handleSort(nextSortKey);
        }
    }, [handleSort]);

    return (
        <AdminPanel>
            <div className="coach-applications-management">
                <h2>{i18n.t('Заявки на тренеров')}</h2>

                {error && <p className="coach-applications-management__error">{error}</p>}

                <div className="search-bar">
                    <input
                        onChange={handleSearchChange}
                        placeholder={i18n.t('Поиск по имени или email')}
                        type="text"
                        value={searchName}
                    />
                </div>

                <div className="filters">
                    <select onChange={handleStatusChange} value={statusFilter}>
                        {coachApplicationStatusOptions.map(status => (
                            <option key={status} value={status}>{i18n.t(status)}</option>
                        ))}
                    </select>
                    <button onClick={clearFilters} type="button">{i18n.t('Очистить фильтры')}</button>
                </div>

                <table className="coach-applications-table">
                    <thead>
                        <tr>
                            <th><button data-sort-key="id" onClick={handleSortButtonClick} type="button">{i18n.t('ID')}</button></th>
                            <th><button data-sort-key="user" onClick={handleSortButtonClick} type="button">{i18n.t('Пользователь')}</button></th>
                            <th><button data-sort-key="status" onClick={handleSortButtonClick} type="button">{i18n.t('Статус')}</button></th>
                            <th><button data-sort-key="created_at" onClick={handleSortButtonClick} type="button">{i18n.t('Создана')}</button></th>
                            <th>{i18n.t('Сообщение')}</th>
                            <th>{i18n.t('Действия')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentApplications.map(application => (
                            <CoachApplicationRow
                                application={application}
                                isProcessing={processingId === application.id}
                                isRejecting={rejectingId === application.id}
                                key={application.id}
                                onApprove={handleApprove}
                                onOpen={handleOpenReject}
                                onRejectCancel={handleRejectCancel}
                                onRejectChange={handleRejectChange}
                                onRejectSubmit={handleRejectSubmit}
                                onSelect={handleSelect}
                                rejectionReason={rejectionReason}
                            />
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    activeClassName={'active'}
                    breakClassName={'break-me'}
                    breakLabel={'...'}
                    containerClassName={'pagination'}
                    marginPagesDisplayed={2}
                    nextLabel={i18n.t('next')}
                    onPageChange={handlePageChange}
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    previousLabel={i18n.t('previous')}
                />
            </div>
        </AdminPanel>
    );
};

export default inject('adminCoachApplicationsStore', 'adminCoachApplicationsController')(
    observer(CoachApplicationsListComponent),
);
