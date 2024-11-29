import React, { useState, useCallback, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './AsidePanel.style.scss';
import LogoutIcon from '../../../icons/logout';
import { useLogout } from '../../Auth/logout';

interface OptionInterface {
    linkTo?: string;
    text: string;
    subOptions?: OptionInterface[];
}

// Define the navigation options, including sub-options
const options: OptionInterface[] = [
    { linkTo: '/admin/users', text: 'Пользователи' },

    { linkTo: '/admin/exercises', text: 'Упражнения' },
    { linkTo: '/admin/workouts', text: 'Тренировки' },
    { subOptions: [
        { linkTo: '/admin/reports/sales', text: 'Отчет продаж' }, { linkTo: '/admin/reports/analytics', text: 'Аналитика' },
    ],

    text: 'Отчеты',

    },
    { linkTo: '/admin/settings', text: 'Настройки' },
];

const AsidePanel: React.FC = () => {
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const asideRef = useRef<HTMLDivElement>(null);
    const logout = useLogout();

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
                setOpenSubMenu(null);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    // Toggle the sub-menu based on its text (memoized)
    const handleSubMenuToggle = useCallback((optionText: string) => {
        setOpenSubMenu(prevOpenSubMenu => (prevOpenSubMenu === optionText ? null : optionText));
    }, []);

    // Generate an event handler for each sub-menu
    const createSubMenuToggleHandler = useCallback(
        (optionText: string) => () => handleSubMenuToggle(optionText),
        [handleSubMenuToggle]
    );

    // Handle a single option click
    const handleOptionClick = useCallback(() => {
        setOpenSubMenu(null);
    }, []);

    return (
        <div className="admin-aside" ref={asideRef}>
            <nav>
                <ul className="admin-nav">
                    {options.map(option => (
                        <li key={option.text} className="nav-item">
                            {option.subOptions ?
                                (<><button className="nav-item-toggle"
                                    onClick={createSubMenuToggleHandler(option.text)}
                                > {option.text}
                                </button>

                                {openSubMenu === option.text && (
                                    <ul className="sub-menu">
                                        {option.subOptions.map(subOption => (
                                            <li key={subOption.text}>
                                                <NavLink
                                                    to={subOption.linkTo || ''}
                                                    className="nav-link"
                                                    onClick={handleOptionClick}
                                                >
                                                    {subOption.text}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                </>
                                )
                                : (
                                    <NavLink
                                        to={option.linkTo || ''}
                                        className="nav-link"
                                        onClick={handleOptionClick}
                                    >
                                        {option.text}
                                    </NavLink>
                                )}
                        </li>
                    ))}
                    <li>
                        <button onClick={logout}>
                            <LogoutIcon />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AsidePanel;
