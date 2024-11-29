import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from '../AdminPanel';
import Dashboard from '../Dashboard/Dashboard';
import UserList from '../UserManagement/UserList';

export const AdminRoutes = (): JSX.Element => (
    // <Route key={path} path={path} element={Component} />
    <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserList />} />
    </Routes>
);
