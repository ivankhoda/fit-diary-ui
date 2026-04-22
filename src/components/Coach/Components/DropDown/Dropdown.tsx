/* eslint-disable no-nested-ternary */
/* eslint-disable sort-keys */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import DropDownIcon from '../../../../icons/DropDownIcon';

import { useCoachMode } from '../../CoachContext';
import { MenuLink } from '../../../User/Link/Link';
import { useToken } from '../../../Auth/useToken';

import './CoachDropdown.style.scss';
import { useNavigate } from 'react-router';

const VIEWPORT_PADDING = 8;

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
        text: 'Тренировки',
        subOptions: [
            { linkTo: '/workouts', text: 'Все тренировки' }, { linkTo: '/workouts/archive', text: 'Архив' },
        ],
    },
    {
        text: 'Планы',
        subOptions: [
            { linkTo: '/plans', text: 'Планы' }
        ]
    },

    {
        text: 'Режим спортсмена',
        isModeSwitch: true
    },
    {
        text: 'O приложении', linkTo: '/about'
    },
];

interface UseSubMenuPositionResult {
    resetSubMenuPosition: () => void;
    shouldOpenSubMenuLeft: boolean;
    submenuRef: React.RefObject<HTMLDivElement>;
}

const useSubMenuPosition = (openSubMenu: string | null): UseSubMenuPositionResult => {
    const [shouldOpenSubMenuLeft, setShouldOpenSubMenuLeft] = useState(false);
    const submenuRef = useRef<HTMLDivElement>(null);

    const resetSubMenuPosition = useCallback(() => {
        setShouldOpenSubMenuLeft(false);
    }, []);

    useEffect(() => {
        if (!openSubMenu) {
            setShouldOpenSubMenuLeft(false);
            return;
        }

        if (!submenuRef.current) {
            return;
        }

        const submenuRect = submenuRef.current.getBoundingClientRect();
        setShouldOpenSubMenuLeft(submenuRect.right > window.innerWidth - VIEWPORT_PADDING);
    }, [openSubMenu]);

    return { resetSubMenuPosition, shouldOpenSubMenuLeft, submenuRef };
};

const Dropdown = (): React.ReactElement => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isCoach } = useToken();
    const { mode, setMode } = useCoachMode();
    const navigate = useNavigate();
    const { resetSubMenuPosition, shouldOpenSubMenuLeft, submenuRef } = useSubMenuPosition(openSubMenu);

    const handleModeSwitchClick = useCallback(() => {
        const newMode = mode === 'coach' ? 'user' : 'coach';

        setMode(newMode);
        setIsOpen(false);
        setOpenSubMenu(null);
        navigate('/');
    }, [mode,
        navigate,
        setMode]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setOpenSubMenu(null);
                resetSubMenuPosition();
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [resetSubMenuPosition]);

    const handleButtonClick = useCallback(() => {
        setIsOpen(prev => !prev);
        setOpenSubMenu(null);
        resetSubMenuPosition();
    }, [resetSubMenuPosition]);

    const handleOptionClick = useCallback(() => {
        setIsOpen(false);
        setOpenSubMenu(null);
        resetSubMenuPosition();
    }, [resetSubMenuPosition]);

    const handleSubMenuToggle = useCallback((optionText: string) => {
        resetSubMenuPosition();
        setOpenSubMenu(prev => (prev === optionText ? null : optionText));
    }, [resetSubMenuPosition]);

    const handleSubMenuToggleHandlers = React.useMemo(() => {
        const handlers: { [key: string]: () => void } = {};

        options.forEach(option => {
            if (option.subOptions) {
                handlers[option.text] = () => handleSubMenuToggle(option.text);
            }
        });

        return handlers;
    }, [handleSubMenuToggle]);

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
                                            <div
                                                className={[
                                                    'coach-dropdown-submenu', shouldOpenSubMenuLeft ? 'coach-dropdown-submenu-left' : '',
                                                ].filter(Boolean).join(' ')}
                                                ref={submenuRef}
                                            >
                                                {option.subOptions.map(subOption => {
                                                    if (!subOption.linkTo) {
                                                        return null;
                                                    }

                                                    return (
                                                        <MenuLink
                                                            key={subOption.text}
                                                            linkTo={subOption.linkTo}
                                                            text={subOption.text}
                                                            onClick={handleOptionClick}
                                                            className="coach-dropdown-link"
                                                        />
                                                    );
                                                })}
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
                                    : option.linkTo
                                        ? (
                                            <MenuLink
                                                linkTo={option.linkTo}
                                                text={option.text}
                                                onClick={handleOptionClick}
                                                className="coach-dropdown-link"
                                            />
                                        )
                                        : null}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
