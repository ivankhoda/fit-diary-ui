/* eslint-disable max-statements */
/* eslint-disable sort-keys */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import DropDownIcon from '../../../icons/DropDownIcon';
import { MenuLink } from '../Link/Link';
import './Dropdown.style.scss';
import { useCoachMode } from '../../Coach/CoachContext';
import { useToken } from '../../Auth/useToken';
import { useNavigate } from 'react-router';
import { userStore } from '../../../store/global';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';

export interface OptionInterface {
  linkTo?: string;
  text: string;
  subOptions?: OptionInterface[];
  visibleIf?: boolean;
}
const {userProfile} = userStore;

const options: OptionInterface[] = [
    { linkTo: '/training_goals', text: 'Цели' },
    { linkTo: '/exercises', text: 'Упражнения' },
    {
        text: 'Тренировки',
        subOptions: [
            { linkTo: '/workouts', text: 'Все тренировки' },
            { linkTo: '/workouts/in-progress', text: 'Тренировки в процессе' },
            { linkTo: '/workouts/done', text: 'Завершённые тренировки' },
            { linkTo: '/workouts/archive', text: 'Архив' },
        ],
    },
    { linkTo: '/plans', text: 'Планы' },
    {
        text: 'Статистика',
        subOptions: [
            { linkTo: '/exercises-stats', text: 'Упражнения' }, { linkTo: '/self-stats', text: 'Показатели' },
        ],
    },
    { linkTo: '/profile', text: 'Профиль' },

    {
        text: 'Тренерская',
    },
    {text: 'О приложении', linkTo: '/about'},
];

const filterOptionsByVisibility = (
    opts: OptionInterface[],

): OptionInterface[] => opts
    .map(option => {
        if (option.subOptions) {
            const filteredSubs = filterOptionsByVisibility(option.subOptions);

            // Если после фильтрации подопций ничего не осталось — скрыть весь пункт
            if (filteredSubs.length === 0) {return null;}

            return { ...option, subOptions: filteredSubs };
        }
        return option;
    })
    .filter(Boolean) as OptionInterface[];

const Dropdown = (): React.ReactElement => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const {  setMode } = useCoachMode();
    const { isCoach } = useToken();

    const filteredOptions = useMemo(() => filterOptionsByVisibility(options), [userProfile]);

    const handleCoachModeClick = useCallback(() => {
        setMode('coach');
        setIsOpen(false);
        setOpenSubMenu(null);
        navigate('/');
    }, [setMode, navigate]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setOpenSubMenu(null);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    const handleButtonClick = useCallback(() => {
        setIsOpen(prev => !prev);
        setOpenSubMenu(null);
    }, []);

    const handleOptionClick = useCallback(() => {
        setIsOpen(false);
        setOpenSubMenu(null);
    }, []);

    const handleSubMenuToggle = useCallback((optionText: string) => {
        setOpenSubMenu(prev => (prev === optionText ? null : optionText));
    }, []);

    const createSubMenuToggleHandler = useCallback(
        (optionText: string) => () => handleSubMenuToggle(optionText),
        [handleSubMenuToggle]
    );

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button onClick={handleButtonClick} aria-haspopup="true" aria-expanded={isOpen}>
                <DropDownIcon />
            </button>

            {isOpen && (
                <div className="dropdown-menu" role="menu">
                    {filteredOptions.map(option => {
                        if (option.subOptions) {
                            return (
                                <div key={option.text} className="dropdown-item" role="none">
                                    <button
                                        className="dropdown-submenu-trigger"
                                        onClick={createSubMenuToggleHandler(option.text)}
                                        aria-haspopup="true"
                                        aria-expanded={openSubMenu === option.text}
                                        role="menuitem"
                                    >
                                        {option.text}
                                    </button>
                                    {openSubMenu === option.text && (
                                        <div className="dropdown-submenu" role="menu">
                                            {option.subOptions.map(subOption => (
                                                <MenuLink
                                                    key={subOption.text}
                                                    linkTo={subOption.linkTo}
                                                    text={subOption.text}
                                                    onClick={handleOptionClick}
                                                    className="dropdown-link"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        } else if (option.text === 'Тренерская' && isCoach()) {
                            return (
                                <div key={option.text} className="dropdown-item">
                                    <button className="dropdown-submenu-trigger" onClick={handleCoachModeClick}>
                                        {option.text}
                                    </button>
                                </div>
                            );
                        } else if (option.linkTo) {
                            return (
                                <div key={option.text} className="dropdown-item">
                                    <MenuLink
                                        linkTo={option.linkTo}
                                        text={option.text}
                                        onClick={handleOptionClick}
                                        className="dropdown-link"
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};

export default inject('userStore', 'userController')(observer(Dropdown));
