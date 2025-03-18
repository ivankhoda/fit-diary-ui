import React from 'react';
import { Link } from 'react-router-dom';

type LinkProps = {
    linkTo: string;
    text: string;
    onClick?: () => void | void;
    className?: string;
};

export const MenuLink = (props: LinkProps):JSX.Element => {
    const {linkTo, text, onClick, className} = props;
    return <Link onClick={onClick} to={`${linkTo}`}><div className={`${className}`}>{text}</div></Link>;
};
