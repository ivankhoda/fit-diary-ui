import { useCallback } from 'react';
import Delete from '../../utils/DeleteRequest';
import { useNavigate } from 'react-router';
import getApiBaseUrl from '../../utils/apiUrl';
import { cacheService } from '../../services/cacheService';

export const useLogout = (): (() => void) => {
    const navigate = useNavigate();

    return useCallback((): void => {
        new Delete({ url: `${getApiBaseUrl()}/users/sign_out` })
            .execute()
            .then((r: Response) => {
                if (r.ok) {
                    localStorage.removeItem('token');
                    navigate('/');
                    cacheService.clear('current_user');
                    window.location.reload();
                }
            })
            .catch((error: Error) => {
                console.error('Logout failed:', error);
            });
    }, [navigate]);
};
