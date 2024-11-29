/* eslint-disable react/jsx-no-bind */
import React, { useState, useCallback, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import ReactPaginate from 'react-paginate';

import { useNavigate, useParams } from 'react-router';
import AdminPanel from '../../AdminPanel';

import AdminUsersStore, { AdminPermissionProfile } from '../../store/AdminUsersStore';
import AdminUsersController from '../../controllers/AdminUsersController';
import { t } from 'i18next';

export interface PermissionsListProps {

    adminUsersStore?: AdminUsersStore;
    adminUsersController?: AdminUsersController;
}

const UserPermissionsList: React.FC<PermissionsListProps> = observer(({ adminUsersStore, adminUsersController }) => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchUser, setSearchUser] = useState<string>('');
    const [searchInstance, setSearchInstance] = useState<string>('');
    const permissionsPerPage = 10;

    useEffect(() => {
        adminUsersController?.getPermissonsByUser(userId);
    }, [adminUsersController, adminUsersStore]);

    const handlePageChange = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const clearFilters = useCallback(() => {
        setSearchUser('');
        setSearchInstance('');
        setCurrentPage(0);
    }, []);

    const filteredPermissions = Array.isArray(adminUsersStore?.permissions)
        ? adminUsersStore?.permissions
            .filter(permission =>
                permission.to_user.toLowerCase().includes(searchUser.toLowerCase()) &&
                permission.instance.toLowerCase().includes(searchInstance.toLowerCase()))
        : [];

    const currentPermissions = filteredPermissions.slice(currentPage * permissionsPerPage, (currentPage + 1) * permissionsPerPage);
    const pageCount = Math.ceil(filteredPermissions.length / permissionsPerPage);

    const handlePermissionClick = useCallback((permission: AdminPermissionProfile) => {
        navigate(`/admin/permissions/${permission.id}`);
    }, [navigate]);

    return (
        <AdminPanel>
            <div className="permission-management">
                <h2>{t('permissionManagement')}</h2>

                <div className="search-bar">
                    <input
                        type="text"
                        value={searchUser}
                        onChange={e => setSearchUser(e.target.value)}
                        placeholder={t('searchUser')}
                    />
                    <input
                        type="text"
                        value={searchInstance}
                        onChange={e => setSearchInstance(e.target.value)}
                        placeholder={t('searchInstance')}
                    />
                </div>

                <button onClick={clearFilters}>{t('resetFilters')}</button>

                <table className="permission-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t('user')}</th>
                            <th>{t('resourceType')}</th>
                            <th>{t('canAssign')}</th>
                            <th>{t('canAccess')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPermissions.map(permission => (
                            <tr key={permission.id} style={{ cursor: 'pointer' }} onClick={() => handlePermissionClick(permission)}>
                                <td>{permission.id}</td>
                                <td>{permission.to_user}</td>
                                <td>{t(`${permission.instance}`)}</td>
                                <td>{permission.can_assign ? t('yes') : t('no')}</td>
                                <td>{permission.can_access ? t('yes') : t('no')}</td>
                                <td>
                                    {/* Additional actions like edit or delete could go here */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={t('paginationPrevious')}
                    nextLabel={t('paginationNext')}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>
        </AdminPanel>
    );
});

export default inject('adminUsersStore', 'adminUsersController')(UserPermissionsList);
