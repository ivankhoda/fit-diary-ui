import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter as Router, useNavigate } from "react-router-dom";
import "./App.style.scss";
import { Header } from "./User/Header/Header";
import { observer, Provider } from "mobx-react";
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
import { useTranslation } from "react-i18next";
import { t, use } from "i18next";
import Footer from "./User/Footer/Footer";
import { CoachModeProvider, useCoachMode } from "./Coach/CoachContext";
import { CoachPanel } from "./Coach/CoachPanel";
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

Modal.setAppElement('#root');

export const App = observer((): JSX.Element => {
  const { token, setToken, isAdmin } = useToken();
  const [isLogin, setIsLogin] = useState(true);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);

  const toggleForm = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const proceedToAuth = () => {
    setIsDescriptionVisible(false);
  };

  const handleClick =()=> {
        proceedToAuth();
        setIsLogin(false);
  }

  return (
     <CoachModeProvider>
    <Router>
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/about-deletion" element={<AccountDeletion />} />
        <Route path="/landing" element={<LandingPage onRegisterClick={handleClick}/>}/>
        <Route path="/password/reset" element={<ResetPasswordWithToken />} />
        <Route path="/password/recovery" element={<PasswordRecovery />} />
        <Route path="/common-exercises" element={<CommonExercises />} />
         <Route path="/about" element={<AboutApp />} />
        <Route path='/exercises/:id' element={<Exercise />} />
        <Route path='/login' element={<Login setToken={setToken} isAdmin={isAdmin} />}/>
        <Route path='/registration' element={<Registration setToken={setToken} />}/>
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
            element={
              isDescriptionVisible ? (
                <DescriptionScreen />
              ) : (
                <AuthRoutes
                  isLogin={isLogin}
                  setToken={setToken}
                  isAdmin={isAdmin}
                />
              )
            }
          />
        )}
      </Routes>
    </Router>
    </CoachModeProvider>
  );
});


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
  const { mode } = useCoachMode();


  return (
    <>
      {mode === "coach" ?
      <CoachPanel/> :
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
      }
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
    console.log(loginPath)
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
