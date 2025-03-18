/* eslint-disable no-undefined */
/* eslint-disable no-nested-ternary */
import { t } from 'i18next';
import React, { useCallback, useState } from 'react';
import { convertDurationToMMSS } from '../../../../Admin/utils/convertDurationToMMSS';

interface ProgressTableProps {
  progress: { date: string; progress_data: { [key: string]: number } }[];
  type_of_measurement: string;
}

const ProgressTable: React.FC<ProgressTableProps> = ({ progress, type_of_measurement }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const columns: { [key: string]: string[] } = {
        cardio: ['date',
            'distance',
            'duration',
            'sets'],
        duration: ['date',
            'duration',
            'sets'],
        duration_and_distance: ['date',
            'duration',
            'distance',
            'sets'],
        duration_and_reps: ['date',
            'duration',
            'reps',
            'sets'],
        reps: ['date',
            'reps',
            'sets'],
        weight_and_reps: ['date',
            'weight',
            'reps',
            'sets'],
    };

    const headers = columns[type_of_measurement] || [];
    const rows = progress
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((session): { [key: string]: string | number } => {
            const { date, progress_data } = session;
            const formattedProgressData = Object.keys(progress_data).reduce((acc, key) => {
                const value = progress_data[key];

                if (key === 'duration' && typeof value === 'number') {
                    acc[key] = convertDurationToMMSS(value);
                } else {
                    acc[key] = value;
                }

                return acc;
            }, {} as { [key: string]: string | number });

            return {
                date: new Date(date).toLocaleDateString(),
                ...formattedProgressData,
            };
        });

    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const paginatedRows = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) {setCurrentPage(currentPage - 1);}
    }, [currentPage]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {setCurrentPage(currentPage + 1);}
    },[currentPage]);

    return (
        <div className="exercise-log">
            <h4>{t('progress')}</h4>
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{t(`workoutData.${header}`)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedRows.map((row: { [key: string]: string | number }, index) => (
                        <tr key={index}>
                            {headers.map((header: string, i: number) => (
                                <td key={i}>
                                    {header === 'date'
                                        ? row[header]
                                        : row[header] === undefined
                                            ? '-'
                                            : `${row[header]} ${
                                                header === 'weight'
                                                    ? 'kg'
                                                    : header === 'distance'
                                                        ? 'm'
                                                        : ''
                                            }`}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    {t('paginationPrevious')}
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    {t('paginationNext')}
                </button>
            </div>
        </div>
    );
};

export default ProgressTable;
