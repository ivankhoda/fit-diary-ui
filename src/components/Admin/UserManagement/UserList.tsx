/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable sort-keys */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useCallback, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import ReactPaginate from 'react-paginate';
import AdminPanel from '../AdminPanel';
import './UserList.style.scss';
import AdminUsersStore, { AdminUserProfile } from '../store/AdminUsersStore';
import AdminUsersController from '../controllers/AdminUsersController';
import { useNavigate } from 'react-router-dom';

export interface UserListProps {
    adminUsersStore?: AdminUsersStore;
    adminUsersController?: AdminUsersController;
}

const UserList: React.FC<UserListProps> = observer(({ adminUsersStore, adminUsersController }) => {
    const navigate = useNavigate();
    const { userProfiles } = adminUsersStore!;
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [searchEmail, setSearchEmail] = useState<string>('');
    const usersPerPage = 20;

    useEffect(() => {
        adminUsersController.getUsers();
    }, [adminUsersController]);

    const handleUserClick = useCallback((user: AdminUserProfile) => {
        navigate(`/admin/users/${user.id}`);
    }, [navigate]);

    const handlePageChange = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const filteredUsers = userProfiles.filter(user =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase()));

    const currentUsers = filteredUsers.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);
    const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <AdminPanel>
            <div className="user-management">
                <h2>Пользователи</h2>
                <div className="search-bar">
                    <input
                        type="email"
                        value={searchEmail}
                        onChange={e => setSearchEmail(e.target.value)}
                        placeholder="Поиск по email"
                    />
                </div>


                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Создан</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={'← '}
                    nextLabel={' →'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
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

export default inject('adminUsersStore', 'adminUsersController')(UserList);
