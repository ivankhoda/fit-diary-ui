import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { cacheService } from '../../services/cacheService';
import getApiBaseUrl from '../../utils/apiUrl';
import { clearAuthStorage } from '../../utils/clearAuthStorage';

export const useLogout = (): (() => void) => {
    const navigate = useNavigate();

    return useCallback((): void => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch(`${getApiBaseUrl()}/users/sign_out`, {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                keepalive: true,
                method: 'DELETE',
            }).catch(() => null);
        }

        clearAuthStorage();
        cacheService.clear('current_user');
        navigate('/');
        window.location.reload();
    }, [navigate]);
};
