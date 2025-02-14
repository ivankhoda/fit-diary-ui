/* eslint-disable complexity */
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPanel from '../../AdminPanel';
import { adminUsersController } from '../../controllers/global';
import { adminUsersStore } from '../../store/global';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    fullName?: string;
    phoneNumber?: string;
    status?: string;
    lastLogin?: string;
    accountCreated?: string;
    twoFactorEnabled?: boolean;
    lastLoginIP?: string;
    subscriptionPlan?: string;
    membershipExpiry?: string;
    group?: string;
    activityHistory?: string[];
    confirmed_at?: string;
}

// eslint-disable-next-line max-statements
const UserData: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isProfileVisible, setIsProfileVisible] = useState(true);

    useEffect(() => {
        if (userId) {
            const fetchUserData = async() => {
                await adminUsersController?.getUserById(parseInt(userId, 10));
            };
            fetchUserData();
        }
    }, [userId]);

    useEffect(() => {
        const fetchedUser = adminUsersStore?.userProfile;

        if (fetchedUser) {
            setCurrentUser(fetchedUser);
        }
    }, [adminUsersStore?.userProfile]);


    const handleToggleProfile = useCallback(() => {
        setIsProfileVisible(prevState => !prevState);
    }, []);



    const handleWorkoutsClick = useCallback(() => {
        navigate(`/admin/users/${userId}/workouts`);
    }, [navigate]);

    const handleSendEmail = useCallback(() => {
        adminUsersController?.sendEmail(parseInt(userId, 10));
    }, [navigate]);

    const handleConfirm = useCallback(() => {
        adminUsersController?.confirm(parseInt(userId, 10));
    }, [navigate]);

    const handlePermissonsClick = useCallback(() => {
        navigate(`/admin/users/${userId}/permissions`);
    }, [navigate]);

    return (
        <AdminPanel>
            <div className="user-data-modal">
                <h2>Детали</h2>

                <div className="user-profile">
                    <h3 onClick={handleToggleProfile}>
                        Информация профиля {isProfileVisible ? '▼' : '▲'}
                    </h3>
                    {isProfileVisible && (
                        <div className="user-section">
                            <p><strong>ID:</strong> {currentUser?.id || 'x'}</p>


                            <p><strong>Email:</strong> {currentUser?.email || 'x'}</p>

                            <p><strong>Роль:</strong> {currentUser?.role || 'x'}</p>
                            <p><strong>Дата подтверждения:</strong> {currentUser?.confirmed_at}</p>
                            <button onClick={handleSendEmail}>Отправить письмо с подтверждением</button>
                            <button onClick={handleConfirm}>Подтвердить</button>
                        </div>
                    )}
                </div>



                <button onClick={handleWorkoutsClick}>Тренировки пользователя</button>
                <button onClick={handlePermissonsClick}>Разрешения</button>
            </div>
        </AdminPanel>
    );
};

export default inject('adminUsersStore')(observer(UserData));
