import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.style.scss';
import { Header } from './User/Header/Header';
import { observer, Provider } from 'mobx-react';
import { ConfirmRegistrationWithToken, ResetPasswordWithToken, routes } from '../routes/routes';
import { Login } from './Auth/Login';
import { Registration } from './Auth/Registration';
import { useToken } from './Auth/useToken';
import { WorkingPanel } from './User/WorkingPanel/WorkingPanel';
import { PasswordRecovery } from './Auth/PasswordRecovery';
import { adminRoutes } from './Admin/routes/routes';
import adminStores from './Admin/store/stores';
import adminControllers from './Admin/controllers/controllers';


export const App = observer((): JSX.Element => {
    const { token, setToken, isAdmin } = useToken();
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(prevIsLogin => !prevIsLogin);
    };

    return (
        <Router>
            <Routes>
                <Route path="/password/reset" element={<ResetPasswordWithToken />} />
                <Route path="/password/recovery" element={<PasswordRecovery />} />
                <Route path="/users/confirmation/*" element={<ConfirmRegistrationWithToken />} />
                {token ? (
                    <>
                        {isAdmin() && <Route path="/admin/*" element={<AdminRoutes />} />}
                        <Route path="/me/*" element={<MainAppRoutes token={token} />} />
                    </>
                ) : (
                    <Route path="/*" element={<AuthRoutes isLogin={isLogin} setIsLogin={toggleForm} setToken={setToken} isAdmin={isAdmin} />} />
                )}
            </Routes>
        </Router>
    );
});

const AdminRoutes = (): JSX.Element => {
    const store = Object.assign(adminStores, adminControllers);
   return (<>
            <Provider {...store}>
                <Routes>
                    {adminRoutes.map(({ path, Component }) => (<Route key={path} path={path} element={Component} />))}
                </Routes>
            </Provider>

    </>)
};


const MainAppRoutes = ({ token }: { token: string }) => (
    <>
        <Header />
        <WorkingPanel>
            <Routes>
                {routes.map(({ path, Component }) => (<Route key={path} path={path} element={Component} />))}
            </Routes>
        </WorkingPanel>
    </>
);

const AuthRoutes = ({
    isLogin,
    setIsLogin,
    setToken,
    isAdmin
}: {
    isLogin: boolean;
    setIsLogin: () => void;
    setToken: (token: string) => void;
    isAdmin: () => boolean;
}) => (
    <div className="auth-container">
        {isLogin ? (
            <>
                <Login setToken={setToken} isAdmin={isAdmin}/>
                <button className="toggle-button" onClick={setIsLogin}>
                    Нет аккаунта? Зарегистрируйтесь
                </button>
            </>
        ) : (
            <>
                <Registration setToken={setToken} />
                <button className="toggle-button" onClick={setIsLogin}>
                    Уже есть аккаунт? Войдите
                </button>
            </>
        )}
    </div>
);
