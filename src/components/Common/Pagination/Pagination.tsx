import React from 'react';
import './Pagination.style.scss';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onNext,
    onPrevious,
    className = '',
}) => {
    const { t } = useTranslation();

    if (totalPages <= 1) {return null;}

    return (
        <div className={`pagination ${className}`}>
            <button onClick={onPrevious} disabled={currentPage === 1}>
                {t('paginationPrevious')}
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={onNext} disabled={currentPage === totalPages}>
                {t('paginationNext')}
            </button>
        </div>
    );
};

export default Pagination;
