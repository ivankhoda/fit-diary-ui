import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { cacheService } from '../../services/cacheService';
import { clearSession, revokeCurrentSession } from '../../services/authSession';

export const useLogout = (): (() => void) => {
    const navigate = useNavigate();

    return useCallback((): void => {
        revokeCurrentSession().finally(() => {
            clearSession();
            cacheService.clear('current_user');
            navigate('/login');
            window.location.reload();
        });
    }, [navigate]);
};
