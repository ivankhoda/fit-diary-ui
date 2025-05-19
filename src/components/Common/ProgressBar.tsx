/* eslint-disable no-magic-numbers */
import React from 'react';
import './ProgressBar.scss';

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
    const safeValue = Math.min(100, Math.max(0, value));

    let progressClass = '';
    if (safeValue < 30) {
        progressClass = 'low';
    } else if (safeValue < 70) {
        progressClass = 'medium';
    } else {
        progressClass = 'high';
    }

    return (
        <div className="progress-bar">
            <div
                className={`progress-fill ${progressClass}`}
                style={{ width: `${safeValue}%` }}
            >
                {value}%
            </div>
        </div>
    );
};

export default ProgressBar;
