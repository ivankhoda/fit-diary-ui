import React, { useEffect, useState } from 'react';
import { isOnline, onNetworkChange } from '../../utils/network';
import { getPendingCount } from '../../utils/offlineQueue';
import './OfflineIndicator.style.scss';

interface OfflineIndicatorProps {
    className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className }) => {
    const [online, setOnline] = useState(true);
    const [pendingCount, setPendingCount] = useState(0);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        // Initial status check
        isOnline().then(setOnline);
        updatePendingCount();

        // Listen for network changes
        const removeListener = onNetworkChange(connected => {
            setOnline(connected);
            if (connected) {
                setSyncing(true);
            }
        });

        // Listen for sync completion
        const handleSyncComplete = () => {
            setSyncing(false);
            updatePendingCount();
        };

        window.addEventListener('offline-sync-complete', handleSyncComplete);

        // Update pending count periodically
        // eslint-disable-next-line no-magic-numbers
        const interval = setInterval(updatePendingCount, 5000);

        return () => {
            if (removeListener) {
                removeListener.then(listener => listener.remove());
            }
            window.removeEventListener('offline-sync-complete', handleSyncComplete);
            clearInterval(interval);
        };
    }, []);

    // eslint-disable-next-line func-style
    async function updatePendingCount() {
        const count = await getPendingCount();
        setPendingCount(count);
    }

    if (online && pendingCount === 0) {
        return null;
    }

    return (
        <div className={`offline-indicator ${className || ''} ${online ? 'online' : 'offline'}`}>
            {!online && (
                <div className="offline-indicator__status">
                    <span className="offline-indicator__icon">⚠️</span>
                    <span className="offline-indicator__text">Офлайн режим</span>
                </div>
            )}
            {pendingCount > 0 && (
                <div className="offline-indicator__pending">
                    {syncing
                        ? (
                            <>
                                <span className="offline-indicator__spinner">⟳</span>
                                <span>Синхронизация...</span>
                            </>
                        )
                        : (
                            <>
                                <span className="offline-indicator__count">{pendingCount}</span>
                                <span>несохраненных изменений</span>
                            </>
                        )}
                </div>
            )}
        </div>
    );
};
