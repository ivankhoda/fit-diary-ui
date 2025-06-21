// Src/components/Coach/CoachPanel.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { coachRoutes } from './routes/routes';

import CoachWorkingPanel from './Components/CoachWorkingPanel/CoachWorkingPanel';
import { Header } from './Components/Header/Header';
import coachStores from './store/stores';
import coachControllers from './controllers/controllers';
import { Provider } from 'mobx-react';

export const CoachPanel: React.FC = () => {
    const store = { ...coachStores, ...coachControllers};
    return (
        <>
            <Header />
            <CoachWorkingPanel>
                <Provider {...store}>
                    <Routes>
                        {coachRoutes.map(({ path, Component }) => (
                            <Route key={path} path={path} element={Component} />
                        ))}
                    </Routes>
                </Provider>
            </CoachWorkingPanel>
        </>
    );
};
