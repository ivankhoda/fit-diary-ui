import React from 'react';
import './Header.style.scss';
import {WebAppUserInterface} from '../../store/userStore';


export const Header = (props: WebAppUserInterface):JSX.Element => {
    const {username} = props;

    return <header className="header">
        <nav className="header__menu"/>
        <div className="header__text">
            <p>{username}</p>
        </div>
    </header>;
};


