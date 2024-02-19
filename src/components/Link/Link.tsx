import React from 'react';
import {Link} from 'react-router-dom';


type LinkProps = {
    linkTo: string;
    text: string;
};

export const MenuLink = (props: LinkProps):JSX.Element => {
    const {linkTo, text} = props;
    return <Link to={`${linkTo}`}><div className="button">{text}</div></Link>;
};
