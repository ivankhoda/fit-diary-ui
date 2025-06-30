/* eslint-disable no-nested-ternary */
/* eslint-disable sort-keys */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import DropDownIcon from '../../../../icons/DropDownIcon';

import { useCoachMode } from '../../CoachContext';
import { MenuLink } from '../../../User/Link/Link';
import { useToken } from '../../../Auth/useToken';

import './CoachDropdown.style.scss';
import { useNavigate } from 'react-router';

export interface OptionInterface {
  linkTo?: string;
  text: string;
  subOptions?: OptionInterface[];
  isModeSwitch?: boolean;
}

const options: OptionInterface[] = [
    {
        text: 'Рабочая зона',
        subOptions: [
            { linkTo: '/clients', text: 'Мои спортсмены' },
        ],
    },
    {
        text: 'Упражнения',
        subOptions: [
            { linkTo: '/exercises', text: 'Упражнения' },
        ],
    },
    {
        text: 'Тренировочные планы',
        subOptions: [
            { linkTo: '/plans', text: 'Тренировочные планы' }
        ]
    },
    {
        text: 'Тренировки',
        subOptions: [
            { linkTo: '/workouts', text: 'Все тренировки' }, { linkTo: '/workouts/archive', text: 'Архив' },
        ],
    },
    {
        text: 'Режим спортсмена',
        isModeSwitch: true
    },
];

const Dropdown = (): React.ReactElement => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isCoach } = useToken();
    const { mode, setMode } = useCoachMode();
    const navigate = useNavigate();

    const handleModeSwitchClick = useCallback(() => {
        const newMode = mode === 'coach' ? 'user' : 'coach';
        setMode(newMode);
        setIsOpen(false);
        setOpenSubMenu(null);
        navigate('/');
    }, [setMode, mode]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
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

    const handleSubMenuToggle = (optionText: string) => {
        setOpenSubMenu(prev => (prev === optionText ? null : optionText));
    };

    const handleSubMenuToggleHandlers = React.useMemo(() => {
        const handlers: { [key: string]: () => void } = {};
        options.forEach(option => {
            if (option.subOptions) {
                handlers[option.text] = () => handleSubMenuToggle(option.text);
            }
        });
        return handlers;
    }, []);

    return (
        <div className="coach-dropdown" ref={dropdownRef}>
            <button className="coach-dropdown-toggle" onClick={handleButtonClick}>
                <DropDownIcon />
            </button>
            {isOpen && (
                <div className="coach-dropdown-menu">
                    {options.map(option => (
                        <div key={option.text} className="coach-dropdown-item">
                            {option.subOptions
                                ? (
                                    <>
                                        <button
                                            className="coach-dropdown-submenu-trigger"
                                            onClick={handleSubMenuToggleHandlers[option.text]}
                                        >
                                            {option.text}
                                        </button>
                                        {openSubMenu === option.text && (
                                            <div className="coach-dropdown-submenu">
                                                {option.subOptions.map(subOption => (
                                                    <MenuLink
                                                        key={subOption.text}
                                                        linkTo={subOption.linkTo}
                                                        text={subOption.text}
                                                        onClick={handleOptionClick}
                                                        className="coach-dropdown-link"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )
                                : option.isModeSwitch && isCoach()
                                    ? (
                                        <button
                                            className="coach-dropdown-submenu-trigger"
                                            onClick={handleModeSwitchClick}
                                        >
                                            {mode === 'coach' ? 'Режим спортсмена' : 'Режим тренера'}
                                        </button>
                                    )
                                    : (
                                        <MenuLink
                                            linkTo={option.linkTo}
                                            text={option.text}
                                            onClick={handleOptionClick}
                                            className="coach-dropdown-link"
                                        />
                                    )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
