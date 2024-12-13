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
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

export const App = observer((): JSX.Element => {
    const { token, setToken, isAdmin } = useToken();
    const [isLogin, setIsLogin] = useState(true);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);

    const toggleForm = () => {
        setIsLogin(prevIsLogin => !prevIsLogin);
    };

    const proceedToAuth = () => {
        setIsDescriptionVisible(false);
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
                    <Route
                        path="/*"
                        element={
                            isDescriptionVisible ? (
                                <DescriptionScreen proceedToAuth={proceedToAuth} />
                            ) : (
                                <AuthRoutes isLogin={isLogin} setIsLogin={toggleForm} setToken={setToken} isAdmin={isAdmin} />
                            )
                        }
                    />
                )}
            </Routes>
        </Router>
    );
});

const DescriptionScreen = ({ proceedToAuth }: { proceedToAuth: () => void }) => {
    const { t } = useTranslation();
    const textWithLineBreaks = t('desc.text').split("\n").map((item, index) => (
        <React.Fragment key={index}>
            {item}
            <br />
        </React.Fragment>
    ));
    return (
        <div className="description-container">
            <h1>{t('desc.title')}</h1>
            <div>{textWithLineBreaks}</div>
            <button className="proceed-button" onClick={proceedToAuth}>
                {t('desc.proceed')}
            </button>
        </div>
    );
};

const AdminRoutes = (): JSX.Element => {
    const store = Object.assign(adminStores, adminControllers);
    return (
        <Provider {...store}>
            <Routes>
                {adminRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={Component} />
                ))}
            </Routes>
        </Provider>
    );
};

const MainAppRoutes = ({ token }: { token: string }) => (
    <>
        <Header />
        <WorkingPanel>
            <Routes>
                {routes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={Component} />
                ))}
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
                <Login setToken={setToken} isAdmin={isAdmin} />
                <button className="toggle-button" onClick={setIsLogin}>
                {t('auth.no_account')}
                </button>
            </>
        ) : (
            <>
                <Registration setToken={setToken} />
                <button className="toggle-button" onClick={setIsLogin}>
                {t('auth.have_account')}
                </button>
            </>
        )}
    </div>
);
