import React, {useEffect, useState} from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {Provider} from "mobx-react";

import {UserStore} from '../store/userStore';
import {Header} from "./Header/Header";
import {WorkingPanel} from "./WorkingPanel/WorkingPanel";
import {Commands} from "./Commands/Commands";
import {MenuLink} from "./Link/Link";
import {botCommandsStore} from "../store/global";
import {Statistics} from "./Statistics/Statistics";


export const App = (): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {WebApp} = window.Telegram;
    const userStore = new UserStore(WebApp);

    const routes = [
        {Component:  <Provider botCommandsStore={botCommandsStore}><Commands /></Provider>,
                name: 'Commands', path: '/commands'},
        {Component:  <Provider><Statistics {...userStore?.shortStat}/></Provider>,
            name: 'Stats', path: '/stats'}
    ];

    const links = [
        {linkTo: '/stats', text:'Статистика'},
        {linkTo: '/info', text:'Информация'}
    ]

    useEffect(() => {

        WebApp.ready()
        WebApp.expand()
        // @ts-ignore
        // WebApp.MainButton.show()
        // WebApp.onEvent('mainButtonClicked', ()=>userStore.getShortStat(WebApp.initData))
        userStore.getShortStat(WebApp.initData)

    }, [WebApp]);

    return <div className="paper">
        <HashRouter>
            <div>
                <Header {...userStore.webAppUser} />
                <div className="link-container">{links.map((l, i) =>
                    <MenuLink linkTo={l.linkTo} text={l.text}/>
                )}</div>

                <WorkingPanel>
                    <Routes>
                        {routes
                            .map(({path, Component}) => <Route key={path} path={path} element={Component} />)}
                    </Routes>
                </WorkingPanel>
            </div>
        </HashRouter>
    </div>;
};

