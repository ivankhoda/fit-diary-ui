import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import './App.style.scss';
import { Header } from './User/Header/Header';
import { inject, observer, Provider } from 'mobx-react';
import {
  ConfirmRegistrationWithToken,
  ResetPasswordWithToken,
  routes,
} from '../routes/routes';
import { Login } from './Auth/Login';
import { Registration } from './Auth/Registration';
import { useToken } from './Auth/useToken';
import { WorkingPanel } from './User/WorkingPanel/WorkingPanel';
import { PasswordRecovery } from './Auth/PasswordRecovery';
import { adminRoutes } from './Admin/routes/routes';
import adminStores from './Admin/store/stores';
import adminControllers from './Admin/controllers/controllers';
import Footer from './User/Footer/Footer';
import { CoachModeProvider, useCoachMode } from './Coach/CoachContext';
import LandingPage from '../landing/LandingPage';
import PrivacyPolicy from './privacy/PrivacyPolicy';
import TermsOfUse from './terms/TermsOfUse';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import AccountDeletion from '../deletion/AccountDeletion';
import { DescriptionScreen } from './Public/DescriprtionScreen/DescriprionScreen';
import CoachInvitationPage from './Public/CoachInvitation/CoachInvitationPage';
import Exercise from './User/Exercises/Exercise/Exercise';
import CommonExercises from './Public/PublicExercises/PublicExercises';
import AboutApp from './Public/About/AboutApp';
import UserStore from '../store/userStore';
import UserController from '../controllers/UserController';
import { buildCoachInvitationPath, resolveCoachInvitationToken } from '../services/coachInvitation';
import { cacheService } from '../services/cacheService';
import { CoachPanel } from './Coach/CoachPanel';

Modal.setAppElement('#root');

const getAuthenticatedAuthRedirectPath = (search: string): string => {
  const invitationToken = resolveCoachInvitationToken(search);

  if (!invitationToken) {
    return '/';
  }

  return buildCoachInvitationPath(invitationToken, { autoAccept: true });
};

const AuthPageRedirect = (): JSX.Element => {
  const location = useLocation();

  return <Navigate to={getAuthenticatedAuthRedirectPath(location.search)} replace />;
};

type AppProps = {
  userStore?: UserStore;
  userController?: UserController;
};

const AppComponent: React.FC<AppProps> = ({ userStore, userController }) => {
  const {
    bootstrapSession,
    hasRefreshToken,
    isAdmin,
    isReady,
    setToken,
    token,
  } = useToken();
  const [isTgAuthPending, setIsTgAuthPending] = useState<boolean>(false);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    void userController?.getUserFromCache();
  }, [userController]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (token) {
      setIsTgAuthPending(false);
      return;
    }

    if (hasRefreshToken()) {
      setIsTgAuthPending(false);
      return;
    }

    const initData = window.Telegram?.WebApp?.initData ?? '';

    if (!initData || !userController) {
      setIsTgAuthPending(false);
      return;
    }

    setIsTgAuthPending(true);

    void userController.loginWithTelegram(initData)
      .finally(() => setIsTgAuthPending(false));
  }, [hasRefreshToken, isReady, token, userController]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (token) {
      return;
    }

    userStore?.clearUserData();
    cacheService.clear('current_user');
  }, [isReady, token, userStore]);

  useEffect(() => {
    if (token && !userStore?.currentUser) {
      userController?.getUserFromCache();
    }
  }, [token, userStore?.currentUser, userController]);

  if (!isReady || isTgAuthPending) {
    return null;
  }


  return (
    <CoachModeProvider>
      <Router>
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/about-deletion" element={<AccountDeletion />} />
          <Route path="/landing" element={token ? <Navigate to="/" replace /> : <LandingPage setToken={setToken} />}/>
          <Route path="/password/reset" element={<ResetPasswordWithToken />} />
          <Route path="/password/recovery" element={<PasswordRecovery />} />
          <Route path="/common-exercises" element={<CommonExercises />} />
          <Route path="/about" element={<AboutApp />} />
          <Route path="/coach-invitations/:token" element={<CoachInvitationPage />} />
        <Route path='/exercises/:id' element={<Exercise />} />
          <Route path='/login' element={token ? <AuthPageRedirect /> : <Login setToken={setToken} isAdmin={isAdmin} />}/>
          <Route path='/registration' element={token ? <AuthPageRedirect /> : <Registration setToken={setToken} />}/>
          <Route
            path="/users/confirmation/*"
            element={<ConfirmRegistrationWithToken />}
          />
          {token ? (
            <>
              {isAdmin() && <Route path="/admin/*" element={<AdminRoutes />} />}
              <Route path="/*" element={<MainAppRoutes />} />
            </>
          ) : (
            <Route
              path="/*"
              element={<DescriptionScreen setToken={setToken} isAdmin={isAdmin} />}
            />
          )}
        </Routes>
      </Router>
    </CoachModeProvider>
  );
};
export const App = inject('userStore', 'userController')(observer(AppComponent));


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

const MainAppRoutes = (): JSX.Element => {
  const { isCoach } = useToken();
  const { mode } = useCoachMode();
  const isCoachMode = mode === 'coach' && isCoach();

  return (
    <>
      {isCoachMode ? (
        <CoachPanel />
      ) : (
        <>
          <Header />
          <WorkingPanel>
            <Routes>
              {routes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} />
              ))}
            </Routes>
          </WorkingPanel>
          <Footer />
        </>
      )}
      <ToastContainer />
    </>
  );
};
