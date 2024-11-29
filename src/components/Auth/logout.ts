import { useCallback } from 'react';
import Delete from '../../utils/DeleteRequest';
import { useNavigate } from 'react-router';

export const useLogout = (): (() => void) => {
    const navigate = useNavigate();

    return useCallback((): void => {
        new Delete({ url: 'http://localhost:3000/users/sign_out' })
            .execute()
            .then((r: Response) => {
                if (r.ok) {
                    sessionStorage.removeItem('token');
                    navigate('/');
                    window.location.reload();
                }
            })
            .catch((error: Error) => {
                console.error('Logout failed:', error);
            });
    }, [navigate]);
};
