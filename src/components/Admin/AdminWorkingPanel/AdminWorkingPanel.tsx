import React, { PropsWithChildren } from 'react';
import './AdminWorkingPanel.style.scss';

interface AdminWorkingPanelProps {
    children: React.ReactNode;
}

// eslint-disable-next-line max-len
export const AdminWorkingPanel: React.FC<PropsWithChildren<AdminWorkingPanelProps>> = ({ children }) => <div className='admin-working-panel'>{children}</div>;
