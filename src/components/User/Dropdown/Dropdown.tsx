import React, { useEffect, useRef, useState, useCallback } from 'react';
import DropDownIcon from '../../../icons/DropDownIcon';
import { MenuLink } from '../Link/Link';
import './Dropdown.style.scss';

export interface OptionInterface {
  linkTo?: string;
  text: string;
  subOptions?: OptionInterface[];
}

// Main menu options
const options: OptionInterface[] = [
    { linkTo: '/exercises', text: 'Упражнения' },

    {
        linkTo: '/info',
        subOptions: [
            { linkTo: '/exercises-stats', text: 'Стастистика упражнений' }, { linkTo: '/self-stats', text: 'Собственные показатели' },
        ],
        text: 'Статистика',
    },
    {
        subOptions: [
            { linkTo: '/workouts', text: 'Все тренировки' },
            { linkTo: '/workouts/in-progress', text: 'Тренировки в процессе' },
            { linkTo: '/workouts/done', text: 'Завершённые тренировки' },
        ],
        text: 'Тренировки',
    },
];

const Dropdown = (): React.ReactElement => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleButtonClick = useCallback(() => {
        setIsOpen(prevIsOpen => !prevIsOpen);
        setOpenSubMenu(null);
    }, []);

    const handleOptionClick = useCallback(() => {
        setIsOpen(false);
        setOpenSubMenu(null);
    }, []);

    const handleSubMenuToggle = useCallback((optionText: string) => {
        setOpenSubMenu(prevOpenSubMenu =>
            prevOpenSubMenu === optionText ? null : optionText);
    }, []);

    const createSubMenuToggleHandler = useCallback(
        (optionText: string) => () => handleSubMenuToggle(optionText),
        [handleSubMenuToggle]
    );

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="" onClick={handleButtonClick}>
                <DropDownIcon />
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    {options.map(option => (
                        <div key={option.text} className="dropdown-item">
                            {option.subOptions
                                ? (
                                    <>
                                        <button
                                            className="dropdown-submenu-trigger"
                                            onClick={createSubMenuToggleHandler(option.text)}
                                        >
                                            {option.text}
                                        </button>
                                        {openSubMenu === option.text && (
                                            <div className="dropdown-submenu">
                                                {option.subOptions.map(
                                                    subOption =>
                                                        subOption.linkTo && (
                                                            <MenuLink
                                                                key={subOption.text}
                                                                linkTo={subOption.linkTo}
                                                                text={subOption.text}
                                                                onClick={handleOptionClick}
                                                                className="dropdown-link"
                                                            />
                                                        )
                                                )}
                                            </div>
                                        )}
                                    </>
                                )
                                : (
                                    option.linkTo && (
                                        <MenuLink
                                            linkTo={option.linkTo}
                                            text={option.text}
                                            onClick={handleOptionClick}
                                            className="dropdown-link"
                                        />
                                    )
                                )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
