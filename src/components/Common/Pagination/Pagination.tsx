import React, { useCallback } from 'react';
import './Pagination.style.scss';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    showPageNumbers?: boolean;
    previousLabel?: string;
    nextLabel?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
    showPageNumbers = true,
    previousLabel,
    nextLabel,
}) => {
    const { t } = useTranslation();

    const handlePreviousClick = useCallback(() => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }, [currentPage, onPageChange]);

    const handleNextClick = useCallback(() => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    }, [currentPage,
        totalPages,
        onPageChange]);

    const handlePageClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const page = Number(event.currentTarget.dataset.page);

        if (!isNaN(page)) {
            onPageChange(page);
        }
    }, [onPageChange]);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`pagination-controls ${className}`}>
            <button
                disabled={currentPage === 1}
                onClick={handlePreviousClick}
                aria-label={previousLabel || t('workouts.pagination.previous', { defaultValue: t('paginationPrevious') })}
            >
                {previousLabel || t('workouts.pagination.previous', { defaultValue: t('paginationPrevious') })}
            </button>

            {showPageNumbers
                ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={page === currentPage ? 'active' : ''}
                            data-page={page}
                            onClick={handlePageClick}
                            aria-label={`Page ${page}`}
                            // eslint-disable-next-line no-undefined
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    ))
                )
                : (
                    <span className="page-info">{currentPage} / {totalPages}</span>
                )}

            <button
                disabled={currentPage === totalPages}
                onClick={handleNextClick}
                aria-label={nextLabel || t('workouts.pagination.next', { defaultValue: t('paginationNext') })}
            >
                {nextLabel || t('workouts.pagination.next', { defaultValue: t('paginationNext') })}
            </button>
        </div>
    );
};

export default Pagination;
