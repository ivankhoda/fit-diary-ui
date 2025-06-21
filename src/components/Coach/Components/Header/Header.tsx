import React from 'react';
import LogoutIcon from '../../../../icons/logout';

import './Header.style.scss';
import { useLogout } from '../../../Auth/logout';
import Dropdown from '../DropDown/Dropdown';

export const Header = (): JSX.Element => {
    const logout = useLogout();
    return (<header className="header">
        <nav className="header__menu">
            <div>
                <Dropdown />
            </div>
            <button onClick={logout}>
                <LogoutIcon />
            </button>
        </nav>
    </header>);
};
