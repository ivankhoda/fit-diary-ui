import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter as Router, useNavigate, Navigate } from "react-router-dom";
import "./App.style.scss";
import { Header } from "./User/Header/Header";
import { inject, observer, Provider } from "mobx-react";
import {
  ConfirmRegistrationWithToken,
  ResetPasswordWithToken,
  routes,
} from "../routes/routes";
import { Login } from "./Auth/Login";
import { Registration } from "./Auth/Registration";
import { useToken } from "./Auth/useToken";
import { WorkingPanel } from "./User/WorkingPanel/WorkingPanel";
import { PasswordRecovery } from "./Auth/PasswordRecovery";
import { adminRoutes } from "./Admin/routes/routes";
import adminStores from "./Admin/store/stores";
import adminControllers from "./Admin/controllers/controllers";
import { t, use } from "i18next";
import Footer from "./User/Footer/Footer";
import { CoachModeProvider, useCoachMode } from "./Coach/CoachContext";
import LandingPage from "../landing/LandingPage";
import PrivacyPolicy from "./privacy/PrivacyPolicy";
import TermsOfUse from "./terms/TermsOfUse";
import { ToastContainer } from "react-toastify";
import Modal from 'react-modal';
import AccountDeletion from "../deletion/AccountDeletion";
import { DescriptionScreen } from "./Public/DescriprtionScreen/DescriprionScreen";
import Exercise from "./User/Exercises/Exercise/Exercise";
import CommonExercises from "./Public/PublicExercises/PublicExercises";
import AboutApp from "./Public/About/AboutApp";
import UserStore from "../store/userStore";
import UserController from "../controllers/UserController";


Modal.setAppElement('#root');

type AppProps = {
  userStore?: UserStore;
  userController?: UserController;
};

const AppComponent: React.FC<AppProps> = ({ userStore, userController }) => {
  const { token, setToken, isAdmin } = useToken();

  const [isTgAuthPending, setIsTgAuthPending] = useState<boolean>(() => {
    const initData = window.Telegram?.WebApp?.initData ?? '';
    const hasToken = Boolean(localStorage.getItem('token'));
    return Boolean(initData) && !hasToken;
  });

  useEffect(() => {
    userController?.getUserFromCache();
    }, [userController, userStore]);


  useEffect(() => {
    const tgObj = window.Telegram?.WebApp;
    const initData = tgObj?.initData ?? '';
    const existingToken = localStorage.getItem('token');
    if (!initData) {
      setIsTgAuthPending(false);
      return;
    }
    if (existingToken) {
      setIsTgAuthPending(false);
      return;
    }

    if (!userController) {
      setIsTgAuthPending(false);
      return;
    }

    userController.loginWithTelegram(initData)
      .then(ok => {
        if (ok) {
          const newToken = localStorage.getItem('token');
          if (newToken) setToken(newToken);
        }
      })
      .catch(err => console.error('[Telegram auth] error:', err))
      .finally(() => setIsTgAuthPending(false));

  }, [token, userController, setToken]);

  useEffect(() => {
    if (token && !userStore?.currentUser) {
      userController?.getUserFromCache();
    }
  }, [token, userStore?.currentUser, userController]);



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
        <Route path='/exercises/:id' element={<Exercise />} />
        <Route path='/login' element={token ? <Navigate to="/" replace /> : <Login setToken={setToken} isAdmin={isAdmin} />}/>
        <Route path='/registration' element={token ? <Navigate to="/" replace /> : <Registration setToken={setToken} />}/>
        <Route
          path="/users/confirmation/*"
          element={<ConfirmRegistrationWithToken />}
        />
        {token ? (
          <>
            {isAdmin() && <Route path="/admin/*" element={<AdminRoutes />} />}
            <Route path="/*" element={<MainAppRoutes token={token} />} />
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

const MainAppRoutes = ({ token }: { token: string }) => {
  // COACH MODE DISABLED FOR V1.0
  // const { mode } = useCoachMode();


  return (
    <>
      {/* COACH MODE DISABLED FOR V1.0 - Always show user interface */}
      {/* {mode === "coach" ? <CoachPanel/> : */}
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
      {/* } */}
       <ToastContainer />
    </>
  );
};

const AuthRoutes = ({
  isLogin,
  setToken,
  isAdmin,
}: {
  isLogin: boolean;
  setToken: (token: string) => void;
  isAdmin: () => boolean;
}) => {
  const [loginPath, setLoginPath] = useState('login')
     const navigate = useNavigate()


      const toggleForm = () => {
    setLoginPath(loginPath === 'registration' ? 'login': 'registration')
    navigate(loginPath)
  };
  return (
  <div className="auth-container">
    <>
      {isLogin ? (
        <>

          <Login setToken={setToken} isAdmin={isAdmin} />
          <button className="toggle-button" onClick={toggleForm}>
            {t("auth.no_account")}
          </button>
        </>
      ) : (
        <>

          <Registration setToken={setToken} />
          <button className="toggle-button" onClick={toggleForm}>
            {t("auth.have_account")}
          </button>
        </>
      )}
    </>
  </div>)}
;
