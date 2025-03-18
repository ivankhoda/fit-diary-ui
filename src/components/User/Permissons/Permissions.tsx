/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useCallback } from 'react';
import './Permissions.style.scss';

import { inject, observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserController from '../../../controllers/UserController';
import UserStore, { PermissionProfile } from '../../../store/userStore';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PermissionsInterface {
    userStore?: UserStore;
    userController?: UserController;
}

const Permissions: React.FC<PermissionsInterface> = ({
    userController,
    userStore,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        userController.getPermissions();
    }, [userController]);

    const handleGoToCreatePermission = useCallback(() => {
        navigate('/permissions/new');
    }, [navigate]);

    const handleDeletePermission = useCallback((permission: PermissionProfile) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        userController.deletePermission(permission);
    }, []);

    return (
        <div className="permissions-section">
            <h1>{t('permissionManagement')}</h1>

            {/* Permissions Table */}
            <div className="permissions-table-container">
                {userStore?.permissions.length === 0
                    ? (
                        <p>{t('noPermissions')}</p>
                    )
                    : (
                        <table className="permissions-table">
                            <thead>
                                <tr>
                                    <th>{t('user')}</th>
                                    <th>{t('resourceType')}</th>
                                    <th>{t('canAssign')}</th>
                                    <th>{t('canAccess')}</th>
                                    <th>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userStore.permissions.map((permission, index) => (
                                    <tr key={permission.id || `permission-${index}`}>
                                        <td>{permission.to_user}</td>
                                        <td>{t(`${permission.instance}`)}</td>
                                        <td>{permission.can_assign ? t('yes') : t('no')}</td>
                                        <td>{permission.can_access ? t('yes') : t('no')}</td>
                                        <td>
                                            <button onClick={handleDeletePermission(permission)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
            </div>

            {/* Button to Create New Permission */}
            <div className="create-permission-btn-container">
                <button onClick={handleGoToCreatePermission} className="create-permission-btn">
                    {t('createNewPermission')}
                </button>
            </div>
        </div>
    );
};

export default inject('userStore', 'userController')(observer(Permissions));
